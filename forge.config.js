module.exports = {
	packagerConfig: {},
	rebuildConfig: {},
	makers: [
		{
			name: '@electron-forge/maker-squirrel',
			config: {
				icon: './icons/windows'
			},
		},
		{
			name: '@electron-forge/maker-deb',
			config: {
				icon: './icons/linux'
			},
		},
		{
			name: '@electron-forge/maker-rpm',
			config: {
				icon: './icons/linux'
			},
		},
	],
};
