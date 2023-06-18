module.exports = {
	packagerConfig: {},
	rebuildConfig: {},
	makers: [
		{
			name: '@electron-forge/maker-squirrel',
			config: {
				icon: './icons/windows.ico'
			},
		},
		{
			name: '@electron-forge/maker-deb',
			config: {
				icon: './icons/linux.png'
			},
		},
		{
			name: '@electron-forge/maker-rpm',
			config: {
				icon: './icons/linux.png'
			},
		},
	],
};
