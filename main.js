const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const dgram = require('dgram')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdateVariableDefinitions = require('./variables')
const UpdatePresets = require('./presets')

class ModuleInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		this.config = {}
		this.brightnessInterval = null

		// Raw -> Brightness mapping 0-255 → 0-100%
		this.rawToPercent = new Array(256).fill(0)
		const mapping = [
			[0,0],[40,1],[53,2],[63,3],[70,4],[77,5],[83,6],[88,7],[93,8],
			[97,9],[102,10],[105,11],[109,12],[113,13],[116,14],[119,15],[123,16],[126,17],[128,18],[131,19],
			[134,20],[137,21],[139,22],[142,23],[144,24],[146,25],[149,26],[151,27],[153,28],[155,29],
			[158,30],[160,31],[162,32],[164,33],[166,34],[168,35],[169,36],[171,37],[173,38],[175,39],
			[177,40],[179,41],[180,42],[182,43],[184,44],[185,45],[187,46],[189,47],[190,48],[192,49],
			[193,50],[195,51],[196,52],[198,53],[199,54],[201,55],[202,56],[204,57],[205,58],[206,59],
			[208,60],[209,61],[211,62],[212,63],[213,64],[215,65],[216,66],[217,67],[219,68],[220,69],
			[221,70],[222,71],[224,72],[225,73],[226,74],[227,75],[228,76],[230,77],[231,78],[232,79],
			[233,80],[234,81],[236,82],[237,83],[238,84],[239,85],[240,86],[241,87],[242,88],
			[243,89],[244,90],[246,91],[247,92],[248,93],[249,94],[250,95],[251,96],[252,97],[253,98],
			[254,99],[255,100]
		]
		for (const [raw, percent] of mapping) {
			this.rawToPercent[raw] = percent
		}
	}

	async init(config) {
		this.config = config
		this.updateStatus(InstanceStatus.Ok)

		this.updateActions()
		this.updateFeedbacks()
		this.updateVariableDefinitions()
		this.updatePresets()

		this.startBrightnessPolling()
	}

	async destroy() {
		this.stopBrightnessPolling()
	}

	async configUpdated(config) {
		this.config = config
		this.stopBrightnessPolling()
		this.startBrightnessPolling()
	}

	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 8,
				regex: Regex.IP
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Target Port',
				width: 4,
				regex: Regex.PORT,
				default: '9099'
			},
			{
				type: 'checkbox',
				id: 'pollingOn',
				label: 'Enable Polling',
				width: 4,
				default: true
			},
			{
				type: 'textinput',
				id: 'pollingInterval',
				label: 'Polling interval (ms)',
				width: 4,
				regex: Regex.NUMBER,
				default: '1000'
			},
			{
				type: 'static-text',
				id: 'info',
				width: 12,
				label: 'Information',
				value: 'Default port usually 9099'
			}
		]
	}

	updateActions() { UpdateActions(this) }
	updateFeedbacks() { UpdateFeedbacks(this) }
	updateVariableDefinitions() { UpdateVariableDefinitions(this) }
	updatePresets() { UpdatePresets.initPresets(this) }

	startBrightnessPolling() {
		if (!this.config.host || !this.config.port || !this.config.pollingOn) return

		const intervalMs = parseInt(this.config.pollingInterval) || 1000
		this.brightnessInterval = setInterval(() => this.updateBrightness(), intervalMs)
		this.log('debug', `Polling started with interval ${intervalMs} ms`)
	}

	stopBrightnessPolling() {
		if (this.brightnessInterval) {
			clearInterval(this.brightnessInterval)
			this.brightnessInterval = null
			this.log('debug', 'Polling stopped')
		}
	}

	updateBrightness() {
		const DISCOVERY = Buffer.from('99f000136100000000000000000000000000fd', 'hex')
		const SESSION_INIT = Buffer.from('aa44' + '00'.repeat(300), 'hex')
		const sock = dgram.createSocket('udp4')
		let received = false

		sock.on('message', (msg) => {
			received = true
			const hexData = msg.toString('hex')
			const index = hexData.indexOf('a00101')
			if (index !== -1) {
				const valueHex = hexData.substr(index + 6, 2)
				const rawValue = parseInt(valueHex, 16)
				const brightness = this.rawToPercent[rawValue] || 0

				this.setVariableValues({ brightness })
				this.checkFeedbacks('brightness_level')
				this.log('debug', `Raw value: ${rawValue}, Brightness: ${brightness}%`)
			} else {
				this.log('warn', 'Pattern not found in controller response')
			}
			sock.close()
		})

		setTimeout(() => {
			if (!received) {
				this.log('warn', 'No response received from controller within 2 seconds')
				sock.close()
			}
		}, 2000)

		sock.send(DISCOVERY, Number(this.config.port), this.config.host)
		setTimeout(() => sock.send(SESSION_INIT, Number(this.config.port), this.config.host), 50)
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts)
