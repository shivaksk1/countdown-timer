/*!
 * This is the main module.
 * This contains child components for each UI element (Settings, Clock, Laps).
 * All the event handlers (Pause, Resume, Reset, Split, Undo) are defined in this module.
 * State management is handled by this module.
 */

import React from 'react';
import Settings from './Settings';
import Clock from './Clock';
import Laps from './Laps';
import Utils from './Utils';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleStartCounter = this.handleStartCounter.bind(this);
        this.handlePause = this.handlePause.bind(this);
        this.handleSplit = this.handleSplit.bind(this);
        this.handleUndo = this.handleUndo.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleChangeSettings = this.handleChangeSettings.bind(this);
        this.state = getInitialState();
    }
    render() {
       const clockParams = Utils.calculateClockParams(this.state);
        return (
            <div>
                <div className='header'>Countdown Timer</div>
                <div className='main'>
                    <Settings 
                        appState={this.state.appState}
                        startCounterHandler={this.handleStartCounter}/>
                    <div className='heroSection'>
                        <Clock
                            appState={this.state.appState}
                            lapsCount={this.state.laps.length}
                            clockDisplay={this.state.clockDisplay}
                            beyondThreshold={this.state.beyondThreshold}
                            pauseHandler={this.handlePause}
                            splitHandler={this.handleSplit}
                            undoHandler={this.handleUndo}
                            resetHandler={this.handleReset}
                            changeSettingsHandler={this.handleChangeSettings}
                            target={clockParams.target}
                            threshold={clockParams.threshold}
                            currentLap={clockParams.currentLap}
                        />
                        <Laps 
                            appState={this.state.appState}
                            thresholdTime={this.state.thresholdTime}
                            laps={this.state.laps}
                            currentLapStartTime={this.state.currentLapStartTime}/>
                    </div>
                </div>
            </div>
        );
    }
    componentDidMount() {
        // If a state is stored previously, resume directly from that state.
        if(window.localStorage.getItem("counter_state")) {
            const state = JSON.parse(window.localStorage.getItem("counter_state"));

            //Account for the time difference since browser was closed
            const snapshotTakenTime = new Date(Number(window.localStorage.getItem("counter_state_saved_on")));
            const currentTime = new Date().getTime();
            const diff = currentTime - snapshotTakenTime;

            const newTargetTime = state.targetTime + diff;
            state.lastPausedTime = state.lastPausedTime + diff;
            state.targetTime = newTargetTime;
            state.startedTime = new Date().getTime();

            //If the user is in Settings page, do not start the counter
            if(state.appState !== "Settings") {
                this.handleStartCounter(this.state);
            }
            this.setState(state);
        }
    }
    handleStartCounter(settingsState) {
        //Clear any existing timer
        if(this.state.timer) {
            clearInterval(this.state.timer);
        }
        const timerId = setInterval(this.tickingTimer.bind(this), 1);
        const newState = {
            targetTime: settingsState.targetTime,
            thresholdTime: settingsState.thresholdTime,
            startedTime: new Date().getTime(),
            appState: 'Running',
            laps: [],
            timer: timerId,
            settings: {
                target_hours: settingsState.target_hours,
                target_minutes: settingsState.target_minutes,
                target_seconds: settingsState.target_seconds,
                threshold_hours: settingsState.threshold_hours,
                threshold_minutes: settingsState.threshold_minutes,
                threshold_seconds: settingsState.threshold_seconds,
            }
        };
        window.localStorage.removeItem("counter_state");
        window.localStorage.removeItem("counter_state_saved_on");
        this.setState(newState);
    }

    /* This is the main logic for updating the Clock Display.
     * Called every millisecond by the timer.
     */
    tickingTimer() {
        // Persist the state in local storage
        window.localStorage.setItem("counter_state", JSON.stringify(this.state));
        window.localStorage.setItem("counter_state_saved_on", new Date().getTime());

        //Only when the Timer is running, update the Clock Display
        if(this.state.appState !== "Running" && this.state.appState !== "Started") {
            return false;
        }
        const currentTime = new Date().getTime();
        const display = Utils.calculateClockDisplay(currentTime, this.state.targetTime, this.state.totalPausedDuration);
        
        let currentLapDuration = 0;
        if(this.state.laps.length > 0) {
            currentLapDuration = new Date().getTime() - this.state.laps[this.state.laps.length - 1].endTime;
        } else {
            currentLapDuration = new Date().getTime() - this.state.startedTime;
        }

        let beyondThreshold = false;
        if(currentLapDuration > this.state.thresholdTime) {
            beyondThreshold = true;
        }

        //This would update the Clock with the updated time
        this.setState({
            clockDisplay: display,
            beyondThreshold: beyondThreshold
        });
    }

    /* Back to Settings Page */
    handleChangeSettings() {
        clearInterval(this.state.timer);
        this.setState({
            appState: "Settings"
        });
    }

    /* Pause, Split, Undo, Reset Handlers */
    handlePause() {
        //Pause Button is clicked
        if(this.state.appState === "Started" || this.state.appState === "Running") {
            this.setState({
                appState: "Paused",
                lastPausedTime: new Date().getTime()
            });
        } 
        //Resume Button is clicked
        else if(this.state.appState === "Paused") {
            const newTotalPausedDuration = this.state.totalPausedDuration + (new Date().getTime() - this.state.lastPausedTime);
            this.setState({
                appState: "Running",
                totalPausedDuration: newTotalPausedDuration
            });        
        }
        //Start Button is clicked    
        else if(this.state.appState === "Reset") {
            const newTargetTime = new Date().getTime() + (this.state.targetTime - this.state.startedTime);
            this.handleStartCounter({
                ...this.state.settings,
                targetTime: newTargetTime,
                thresholdTime: this.state.thresholdTime
            });
        }
    }

    /* When the Split button is clicked,
     * a new Lap should be added.
     */
    handleSplit() {
        if(this.state.appState === "Running") {
            const currentTime = new Date().getTime();
            let lastLapTime = this.state.startedTime;
            const laps = this.state.laps;
            if(laps.length > 0) {
                lastLapTime = laps[laps.length - 1].endTime;
            }
            const lapStartTime = lastLapTime + 1;
            const lapEndTime = currentTime;
            const lapDuration = lapEndTime - lapStartTime;
            laps.push({
                sno: laps.length + 1,
                startTime: lapStartTime,
                endTime: lapEndTime,
                duration: lapDuration,
                startTimeStr: new Date(lapStartTime).toLocaleTimeString(),
                endTimeStr: new Date(lapEndTime).toLocaleTimeString(),
                durationStr: Utils.formatTimeWithMillis(lapDuration)
            });
            this.setState({
                laps: laps,
                currentLapStartTime: currentTime
            });
        }
    }

    /* When Undo button is clicked,
     * the last lap should be merged with the previous lap.
     */
    handleUndo() {
        const laps = this.state.laps;
        if(laps.length > 0) {
            laps.pop();
            let startTime = undefined;
            if(laps.length > 0) {
                startTime = laps[laps.length - 1].endTime + 1
            } else {
                startTime = this.state.startedTime;
            }
            this.setState({
                laps: laps,
                currentLapStartTime: startTime
            });
        }
    }

    /* On clicking Reset button,
     * the counter should be reset to original Target time.
     * All Laps should be cleared.
     */
    handleReset() {
        clearInterval(this.state.timer);
        const newState = getInitialState();
        newState.appState = 'Reset';
        newState.targetTime = this.state.targetTime;
        newState.timer = undefined;
        newState.thresholdTime = this.state.thresholdTime;
        newState.startedTime = this.state.startedTime;
        newState.settings = this.state.settings;
        newState.clockDisplay = Utils.calculateClockDisplay(this.state.startedTime, newState.targetTime, 0);
        this.setState(newState);
    }
}

function getInitialState() {
    return {
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
    }
}

export default App;