const { combineRgb } = require('@companion-module/base')

module.exports = async function (self) {
	self.setFeedbackDefinitions({
		brightness_level: {
			type: 'advanced',
			name: 'Brightness Level',
			description: 'Update button text and color based on current brightness',
			options: [],
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
				text: 'Brightness: 0%',
			},
			callback: (feedback, context) => {
				const brightness = self.getVariableValue('brightness') || 0

				const bg = combineRgb(Math.round(brightness * 2.55), Math.round(brightness * 2.55), 0)
				const textColor = brightness <= 50 ? combineRgb(255, 255, 255) : combineRgb(0, 0, 0)

				return {
					color: textColor,
					bgcolor: bg,
					text: `Brightness ${brightness}%`,
				}
			},
		},
	})
}

