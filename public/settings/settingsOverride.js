/**
 * // /////////////////////////////////////////////////////////////////////////////
 *
 * @Copyright (C) 2016-2024 Theodore Kruczek
 * @Copyright (C) 2020-2024 Heather Kruczek
 *
 * KeepTrack is free software: you can redistribute it and/or modify it under the
 * terms of the GNU Affero General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * KeepTrack is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License along with
 * KeepTrack. If not, see <http://www.gnu.org/licenses/>.
 *
 * /////////////////////////////////////////////////////////////////////////////
 */

// Settings Manager Overrides
const settingsOverride = {
  // Classification can be "Unclassified", "Secret", "Top Secret", "Top Secret//SCI", "ALDORIA CONFIDENTIAL"
  classificationStr: '',
  // This controls which of the built-in plugins are loaded
  plugins: {
    debug: false,
    satInfoboxCore: true,
    aboutManager: false,
    collisions: true,
    trackingImpactPredict: false,
    dops: false,
    findSat: true,
    launchCalendar: true,
    newLaunch: true,
    nextLaunch: true,
    nightToggle: true,
    photoManager: false,
    screenRecorder: true,
    satChanges: false,
    stereoMap: true,
    timeMachine: true,
    initialOrbit: false,
    missile: true,
    breakup: true,
    editSat: true,
    constellations: true,
    countries: true,
    colorsMenu: true,
    shortTermFences: false,
    orbitReferences: false,
    analysis: true,
    plotAnalysis: true,
    sensorFov: true,
    sensorSurv: true,
    satelliteFov: true,
    satelliteView: true,
    planetarium: true,
    astronomy: false,
    screenshot: false,
    watchlist: true,
    sensor: true,
    settingsMenu: true,
    datetime: true,
    social: false,
    topMenu: true,
    classificationBar: false,
    soundManager: true,
    gamepad: false,
    scenarioCreator: true,
    debrisScreening: true,
    videoDirector: true,
    reports: true,
    polarPlot: true,
    timeline: true,
    timelineAlt: true,
    transponderChannelData: true,
    calculator: false,
    createSat: true,
  },
  /*
   * searchLimit: 150,
   * isDisableCss: false,
   * isShowSplashScreen: true,
   */
};

// Expose these to the console
window.settingsOverride = settingsOverride;
