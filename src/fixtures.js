const crypto = require('crypto');

const config = require('./config.js');
const appState = require('./state.js');

function loadProfiles() {
    let profileData = config.parseConfigJson('profiles.json');
    appState.fixtureProfiles = profileData;
    appState.fixtureProfiles.dimmer = {
        label: "Dimmer",
        colorProfile: [1]
    };
}

function loadFixtures() {
    let fixtureData = config.parseConfigJson('fixtures.json');
    appState.fixtures = fixtureData;

    for (i in appState.fixtures) {
        let fixtureProfile = appState.fixtureProfiles[appState.fixtures[i].profile];
        appState.fixtures[i].type = fixtureProfile.label;
    }
}

function initProgrammingColors() {
    for(i in appState.fixtures) {
        appState.programmingColors[i] = Array(appState.fixtureProfiles[appState.fixtures[i].profile].colorProfile.length).fill(0);
    }
}

function getFixtures() {
    return appState.fixtures;
}

function getProgrammingColors(allFixtures = false) {
    let programmingColors = {};
    if (!allFixtures) {
        for (i of appState.activeFixtures) {
            programmingColors[i] = appState.programmingColors[i];
        }
    } else {
        programmingColors = appState.programmingColors;
    }

    return programmingColors;
}

function getProfile(profileName) {
    //return
    return appState.fixtureProfiles[profileName];
};

function addFixture(label, profile, address, type, uuid = crypto.randomUUID()) {
    const fixture = {
        uuid: uuid,
        label: label,
        profile: profile,
        address: address,
        type: type,
        programmingColor: []
    };
}

module.exports = {
    loadProfiles: loadProfiles,
    loadFixtures: loadFixtures,

    initProgrammingColors: initProgrammingColors,

    getFixtures: getFixtures,

    getProgrammingColors: getProgrammingColors,

    addFixture: addFixture
};