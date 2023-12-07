var appState = {
    //ArtNet Config
    artnetConfig: {
        host: '192.0.2.0',
        port: 10023,
        sendAll: true
    },

    cues: [],

    pickerColor: [0, 0, 0, 0],

    defaultCueFade: 2000,
    currentFadetime: 2000,

    currentCue: undefined,
    nextCueTime: undefined,

    liveMode: true,

    fixtureProfiles: {},

    fixtures: {},
    activeFixtures: new Set(),

    programmingColors: {},

    //fadeMode
    fadeMode: 'linear',

    pickerFadetime: 1,

    fileversion_major: 1,
    fileversion_minor: 0
};

module.exports = appState;