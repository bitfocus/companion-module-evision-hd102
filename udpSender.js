const dgram = require('dgram')

/**
 * General UDP send function
 * @param {object} self - Companion module instance
 * @param {string[]} packetArray - Array of hex strings
 */
function sendPackets(self, packetArray) {
	const ip = self.config.host
	const port = parseInt(self.config.port)

	if (!ip || !port) {
		self.log('error', 'IP or port not configured!')
		return
	}

	const client = dgram.createSocket('udp4')

	for (const hex of packetArray) {
		try {
			const payload = Buffer.from(hex, 'hex')
			client.send(payload, port, ip, (err) => {
				if (err) self.log('error', err.message)
			})
		} catch (err) {
			self.log('error', `Hex conversion error: ${err.message}`)
		}
	}

	self.log('debug', `UDP sent to ${ip}:${port}`)

	setTimeout(() => {
		client.close()
	}, 50)
}

module.exports = { sendPackets }
