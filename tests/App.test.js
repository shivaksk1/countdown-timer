/*!
 * This contains all the test cases 
 * for the Countdown Timer.
 * The tests given in this module are Integration tests.
 */
import React from 'react';
import { configure, mount} from 'enzyme';
import {expect} from 'chai';
import Adapter from 'enzyme-adapter-react-16';
import App from '../src/App';
import TestUtils from './TestUtils';

configure({adapter: new Adapter()});

const DEFAULT_TIMEOUT = 1 * 60 * 1000; // 1 minute

afterEach(() => {
  const app = mount(<App/>);
  //Reset App after every test
  app.setState({
    appState: "Not Started",
    targetTime: 0,
    thresholdTime: 0,
    beyondThreshold: false,
    startedTime: 0,
    overflow: false,
    totalPausedDuration: 0,
    clockDisplay: ' 00:00:00.0',
    laps: [],
    settings: {},
    currentLapStartTime: 0,
    timerFunction: undefined
  });
});

/* For testing the application's initial state.
 * When application is launched, only the settings screen is to be shown.
 * Clock and Laps sections are to be hidden.
 */
test('Launch App -> Only Settings to be shown. Clock and Laps to be hidden', () => {
  const app = mount(<App/>);
  expect(app.state('appState')).to.equal('Not Started');
  expect(app.find('#clockSection')).to.have.length(0);
  expect(app.find('#lapsSection')).to.have.length(0);
});

/* After entering the Countdown Timer value and Threshold value,
 * when the 'Start Counter' button is clicked,
 * validate the states (active/inactive) of buttons.
 */
test('Start Counter -> Clock to be Shown, Button states to be proper', () => {
  const app = mount(<App/>);

  //Set Timer and Threshold, click Start button
  TestUtils.setTimerAndThreshold(app, ['00', '02', '10'], ['00', '00', '10']);
  app.find('#btnStartTimer').simulate('click');

  expect(app.state('appState')).to.equal('Running');
  expect(app.find('#clockSection')).to.have.length(1);
  expect(app.find('#lapsSection')).to.have.length(1);

  //Counter Started: Pause, Split, Reset buttons to be Active. Undo button to be inactive, as there are no laps yet.
  expect(app.find('#pauseButton').hasClass('notActive')).to.equal(false);
  expect(app.find('#splitButton').hasClass('notActive')).to.equal(false);
  expect(app.find('#undoButton').hasClass('notActive')).to.equal(true);
  expect(app.find('#resetButton').hasClass('notActive')).to.equal(false);
});

/* After starting the counter, try toggling between Pause and Resume.
 * Validate the following aspects:
 *  - Application state should be updated accordingly
 *  - Counter Display should be paused on clicking Pause button
 *  - Button UI states and Label (Pause/Resume) should be updated accordingly
 */
test('Pause/Resume functionality', async () => {
  const app = mount(<App/>);

  //Set Timer and Threshold, click Start button
  TestUtils.setTimerAndThreshold(app, ['00', '02', '10'], ['00', '00', '10']);

  /* Counter Started: 
   *  - Pause button should be active
   *  - Label of the button should be 'Pause'
   *  - CSS should correspond to Pause button
  */
  app.find('#btnStartTimer').simulate('click');
  let pauseBtn = app.find('#pauseButton');
  expect(pauseBtn.hasClass('notActive')).to.equal(false);
  expect(pauseBtn.hasClass('pauseTheme')).to.equal(true);
  expect(pauseBtn.text()).to.equal('Pause');

  /* Click Pause button:
   *  - App State should change to 'Paused'
   *  - Button should change to 'Resume'
   *  - CSS should correspond to Resume button
   *  - Clock Display should remain unchaged.
   */
  const clockBeforePause = app.find('#clock').text();
  expect(clockBeforePause.trim() === "").to.equal(false);
  pauseBtn.simulate('click');
  const resumeBtn = app.find('#pauseButton');
  expect(app.state('appState')).to.equal('Paused');
  expect(resumeBtn.text()).to.equal('Resume');
  expect(resumeBtn.hasClass('resumeTheme')).to.equal(true);

  /* Wait for sometime in Paused state, 
   * assert that the counter value has not changed
   */
  await TestUtils.sleep(2000);
  const clockAfterPause = app.find('#clock').text();
  expect(clockBeforePause === clockAfterPause).to.equal(true);

  /* Click Resume button:
   *  - App State should be 'Running'
   *  - Button should change to 'Pause'
   *  - CSS should correspond to Pause button.
   */
  resumeBtn.simulate('click');
  pauseBtn = app.find('#pauseButton');
  expect(app.state('appState')).to.equal('Running');
  expect(pauseBtn.text()).to.equal('Pause');
  expect(pauseBtn.hasClass('pauseTheme')).to.equal(true);

  /* Wait for sometime in Resume state, 
   * assert that the counter value has changed
   */
  await TestUtils.sleep(2000);
  const clockAfterResume = app.find('#clock').text();

  expect(clockAfterPause === clockAfterResume).to.equal(false);

}, DEFAULT_TIMEOUT);

/* When the Counter is in Running State,
 * clicking on Split button should create a new Lap.
 */
test('Split Button -> Clock to be Shown, Laps should be created', async () => {
  const app = mount(<App/>);
  
  //Set Timer and Threshold, click Start button
  TestUtils.setTimerAndThreshold(app, ['00', '02', '10'], ['00', '00', '10']);
  app.find('#btnStartTimer').simulate('click');

  //Let the counter run for sometime
  await TestUtils.sleep(2000);

  //Since Split button is not clicked, Undo button should not be Active
  expect(app.find('#undoButton').hasClass('notActive')).to.equal(true);

  /* When the counter is running, click on Split
   *  - App State should still be 'Running'
   *  - One Lap to be created
   *  - Undo Button to be Active
   */
  const splitBtn = app.find('#splitButton');
  splitBtn.simulate('click');
  expect(app.state('appState')).to.equal('Running');
  expect(app.find('.lap')).to.have.length(1);

  /* Click on Split second time, after sometime
   *  - App State should still be 'Running'
   *  - One more lap to be created. Total laps: 2
   *  - Undo button to be Active
   */
  await TestUtils.sleep(2000);
  splitBtn.simulate('click');
  expect(app.state('appState')).to.equal('Running');
  expect(app.find('.lap')).to.have.length(2);
  expect(app.find('#undoButton').hasClass('notActive')).to.equal(false);
  
}, DEFAULT_TIMEOUT);

/* If there are any laps present,
 * clicking on the Undo button should delete the
 * previous lap and merge with the current lap.
 */
test('Undo Button -> Laps to be adjusted', async () => {
  const app = mount(<App/>);

  //Set Timer and Threshold, click Start button
  TestUtils.setTimerAndThreshold(app, ['00', '02', '10'], ['00', '00', '10']);
  app.find('#btnStartTimer').simulate('click');

  //Let the counter run for sometime
  await TestUtils.sleep(2000);

  //Since Split button is not clicked, Undo button should not be Active
  expect(app.find('#undoButton').hasClass('notActive')).to.equal(true);

  /* When the counter is running, click on Split
   *  - One Lap to be created
   */
  const splitBtn = app.find('#splitButton');
  splitBtn.simulate('click');
  expect(app.find('.lap')).to.have.length(1);

  /* Click on Split second time, after sometime
   *  - One more Lap to be created. Total Laps: 2
   */
  await TestUtils.sleep(2000);
  splitBtn.simulate('click');
  expect(app.find('.lap')).to.have.length(2);

  //Store the first lap locally to compare it later
  const storedLap = app.find('.lapsTable').childAt(0).find('.lapStartTime').text();

  /* Click on Undo button
   *  - Total Laps to be reduced by 1
   *  - First lap to be retained. Last lap to be deleted.
   */
  await TestUtils.sleep(2000);
  const undoBtn = app.find('#undoButton');
  undoBtn.simulate('click');
  expect(app.find('.lap')).to.have.length(1);

  //Check if the first lap is not deleted
  const newLap = app.find('.lapsTable').childAt(0).find('.lapStartTime').text();
  expect(newLap).to.equal(storedLap);
  
}, DEFAULT_TIMEOUT);

/* Clicking on the Reset button should reset the
 * Counter to the initial state.
 */
test('Reset Button ->  Counter to be reset', async () => {
  const app = mount(<App/>);

  //Set Timer as 02:55:56
  TestUtils.setTimerAndThreshold(app, ['02', '55', '56'], ['00', '00', '10']);
  app.find('#btnStartTimer').simulate('click');

  //Allow counter to run
  await TestUtils.sleep(2000);

  //Reset
  const resetBtn = app.find('#resetButton');
  resetBtn.simulate('click');

  //Counter to be reset
  const clockAfterReset = app.find('#clock').text();

  //After timer reset, it should be 02:55:56
  expect(clockAfterReset === "02:55:56.0").to.equal(true);

}, DEFAULT_TIMEOUT);

/* Counter reaches the target time, still continues.
 * Counter value should be negative.
 */
test('Counter Overflow ->  Target time is reached but counter still continues', async () => {
  const app = mount(<App/>);

  //Set Timer as 00:00:03 (3 seconds)
  TestUtils.setTimerAndThreshold(app, ['00', '00', '03'], ['00', '00', '10']);
  app.find('#btnStartTimer').simulate('click');

  //Allow counter to run more than Target (3 seconds)
  await TestUtils.sleep(5000);

  //Counter to be reset
  const clock = app.find('#clock').text();

  //Timer should be negative, "-00:00:02"
  expect(clock.indexOf("-") >= 0).to.equal(true);

}, DEFAULT_TIMEOUT);

/* Counter reaches the target time, still continues.
 * Counter value should be negative.
 */
test('Lap falls over Threshold ->  Current Lap is highlighted in a different color', async () => {
  const app = mount(<App/>);

  //Set Timer as 00:01:00 (1 min), and Threshold 00:00:03 (3 seconds)
  TestUtils.setTimerAndThreshold(app, ['00', '01', '00'], ['00', '00', '03']);

  //Start Timer
  app.find('#btnStartTimer').simulate('click');

  //Before the Threshold (3 seconds), check clock color
  expect(app.find('#clock').hasClass('beyondThreshold')).to.equal(false);

  expect(app.state('appState')).to.equal('Running');
  
  //Allow counter to run more than Threshold (3 seconds)
  await TestUtils.sleep(5000);

  //Pause and then read the counter value
  app.find('#pauseButton').simulate('click');

  //Clock to be in a different color
  expect(app.find('#clock').hasClass('beyondThreshold')).to.equal(true);

}, DEFAULT_TIMEOUT);