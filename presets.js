const Icons = require('./icons.js');
const { combineRgb } = require('@companion-module/base')

/**
 * Initialize presets for Evision HD102
 * @param {import('@companion-module/base').InstanceBase} self
 */
function initPresets(self) {
	const presets = {}

	// Brightness presets 0 → 100 (step 10)
	for (let i = 0; i <= 100; i += 10) {
		// Calculate background color (0% = dark, 100% = bright yellow)
		const bg = combineRgb(Math.round(i * 2.55), Math.round(i * 2.55), 0)

		// Automatic text color: white for dark, black for light
		const textColor = i <= 50 ? combineRgb(255, 255, 255) : combineRgb(0, 0, 0)

		presets[`brightness_${i}`] = {
			type: 'button',
			category: 'Brightness',
			name: `Set Brightness ${i}%`,
			style: {
				text: `Brightness ${i}%`,
				size: '14',
				color: textColor,
				bgcolor: bg,
			},
			steps: [
				{
					down: [
						{
							actionId: 'set_brightness',
							options: { brightness: i },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}
	}

	// Freeze presets
	presets.freeze_on = {
		type: 'button',
		category: 'Basics',
		name: 'Freeze ON',
		style: {
			text: 'Freeze ON',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 128, 255),
		},
		steps: [
			{
				down: [
					{
						actionId: 'freeze',
						options: { state: 'ON' },
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets.freeze_off = {
		type: 'button',
		category: 'Basics',
		name: 'Freeze OFF',
		style: {
			text: 'Freeze OFF',
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(180, 180, 180),
		},
		steps: [
			{
				down: [
					{
						actionId: 'freeze',
						options: { state: 'OFF' },
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	// Blackout presets
	presets.blackout_on = {
		type: 'button',
		category: 'Basics',
		name: 'Blackout ON',
		style: {
			text: 'Blackout ON',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: 'blackout',
						options: { state: 'ON' },
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets.blackout_off = {
		type: 'button',
		category: 'Basics',
		name: 'Blackout OFF',
		style: {
			text: 'Blackout OFF',
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(200, 200, 200),
		},
		steps: [
			{
				down: [
					{
						actionId: 'blackout',
						options: { state: 'OFF' },
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	// Brightness status button
	presets.brightness_status = {
		type: 'button',
		category: 'Status',
		name: 'Brightness Status',
		style: {
			text: 'Brightness 0%',
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(255, 255, 0),
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: 'brightness_level',
				options: {},
			},
		],
	}

	// Brightness increment +1
	presets.brightness_plus_1 = {
		type: 'button',
		category: 'Basics',
		name: 'Brightness +1',
		style: {
			text: 'Brightness\n+1',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(60, 60, 60),
		},
		steps: [
			{
				down: [
					{
						actionId: 'brightness_adjust',
						options: { delta: 1 },
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	// Brightness decrement -1
	presets.brightness_minus_1 = {
		type: 'button',
		category: 'Basics',
		name: 'Brightness -1',
		style: {
			text: 'Brightness\n-1',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(60, 60, 60),
		},
		steps: [
			{
				down: [
					{
						actionId: 'brightness_adjust',
						options: { delta: -1 },
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

    // ============================
	// Test Pattern Presets
	// ============================
	const testPatterns = [
		{ id: 0,  label: 'NORMAL',  icon: 'normal',             bg: combineRgb(80, 80, 80),   color: combineRgb(0,0,0) },
		{ id: 1,  label: '',        icon: 'red',                bg: combineRgb(200, 0, 0),    color: combineRgb(255,255,255) },
		{ id: 2,  label: '',        icon: 'green',              bg: combineRgb(0, 160, 0),    color: combineRgb(255,255,255) },
		{ id: 3,  label: '',        icon: 'blue',               bg: combineRgb(0, 0, 200),    color: combineRgb(255,255,255) },
		{ id: 4,  label: '',        icon: 'white',              bg: combineRgb(255,255,255),  color: combineRgb(0,0,0) },
		{ id: 5,  label: '',        icon: 'vertical_line',      bg: combineRgb(120,120,120),  color: combineRgb(255,255,255) },
		{ id: 6,  label: '',        icon: 'horizontal_line',    bg: combineRgb(120,120,120),  color: combineRgb(255,255,255) },
		{ id: 7,  label: '',        icon: 'left_slash',         bg: combineRgb(120,120,120),  color: combineRgb(255,255,255) },
		{ id: 8,  label: '',        icon: 'right_slash',        bg: combineRgb(120,120,120),  color: combineRgb(255,255,255) },
		{ id: 9,  label: '',        icon: 'pane',               bg: combineRgb(100,100,100),  color: combineRgb(255,255,255) },
		{ id: 10, label: '',        icon: 'gradient_red',       bg: combineRgb(150, 0, 0),    color: combineRgb(255,255,255) },
		{ id: 11, label: '',        icon: 'gradient_green',     bg: combineRgb(0, 120, 0),    color: combineRgb(255,255,255) },
		{ id: 12, label: '',        icon: 'gradient_blue',      bg: combineRgb(0, 0, 150),    color: combineRgb(255,255,255) },
		{ id: 13, label: '',        icon: 'gradient_white',     bg: combineRgb(200,200,200),  color: combineRgb(0,0,0) },
		{ id: 14, label: '',        icon: 'black',              bg: combineRgb(0,0,0),        color: combineRgb(255,255,255) },
	]

	testPatterns.forEach((pattern) => {
		presets[`test_pattern_${pattern.id}`] = {
			type: 'button',
			category: 'Test Patterns',
			name: `Test Pattern ${pattern.label.replace('\n',' ')}`,
			style: {
				text: pattern.label,
				size: '14',
				color: pattern.color,
				bgcolor: pattern.bg,

                png64: Icons[`ICON_TEST_PATTERN_${pattern.icon.toUpperCase().replace(/\n/g,'_')}`] || undefined,
                pngalignment: 'left:center',
			},
			steps: [
				{
					down: [
						{
							actionId: 'test_pattern',
							options: { pattern: pattern.id },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}
	})

	self.setPresetDefinitions(presets)
}

module.exports = { initPresets }
