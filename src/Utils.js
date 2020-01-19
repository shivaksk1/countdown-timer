/*!
 * This module has utility functions to be used
 * by remaining modules.
 */

class Utils {
    formatTimeWithMillis(time){
        return formatTime(time, true);
    }
    formatTimeWithoutMillis(time){
       return formatTime(time, false);
    }    

    /* Given the start time and target time
     * it calculates the display (e.g. "02:03:25")
     * on the clock.
     * totalPausedDuration: 
     *  -   If the user has paused/resumed many times this parameter represents
     *      the total duration when the App was paused.
     */
    calculateClockDisplay(referenceTime, targetTime, totalPausedDuration) {
        let diff = targetTime - referenceTime;
        if(totalPausedDuration > 0) {
            diff = diff + totalPausedDuration;
        }

        let overflow = false;
        let hours, minutes, seconds, millis;
        if(diff < 0) {
            overflow = true;
            diff = -1 * diff;
        }
        hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        seconds = Math.floor((diff % (1000 * 60)) / 1000);
        millis = Math.floor(((diff  % 1000) * 10 ) / 1000);

        let display = twoDigits(hours) + ":" + twoDigits(minutes) + ":" + twoDigits(seconds) + "." + (millis);
        if(overflow) {
            display = "- " + display;
        }
        return display;
    }    

    /* This contains the logic of displaying the 
     * action buttons in their corresponding states (active/not active)
     * based on the App state.
     */
    getButtonStates(appState, lapsCount){
        let pauseButtonName = "Pause";
        let pauseButtonClass = "clockButton ", 
            splitButtonClass = "clockButton ", 
            undoButtonClass = "clockButton ", 
            resetButtonClass = "clockButton ";
    
        if(appState === "Not Started") {
            pauseButtonClass += "notActive";
            splitButtonClass += "notActive";
            resetButtonClass += "notActive";
        } else if(appState === "Running") {
            pauseButtonClass += "pauseTheme";
        } else if(appState === "Paused") {
            pauseButtonName = "Resume";
            pauseButtonClass += "resumeTheme";
            splitButtonClass += "notActive";
        } else if(appState === "Reset") {
            pauseButtonName = "Start";
            pauseButtonClass += "resumeTheme";
            splitButtonClass += "notActive";
            resetButtonClass += "notActive";
        }
    
        if(lapsCount <= 0) {
            undoButtonClass += "notActive";
        }
    
        return {
            pauseButtonName: pauseButtonName,
            pauseButtonClass: pauseButtonClass,
            splitButtonClass: splitButtonClass,
            undoButtonClass: undoButtonClass,
            resetButtonClass: resetButtonClass
        };
    }    

    calculateClockParams(state) {
        try{
            let target = "", threshold = "", currentLap = "";
            const settings = state.settings;
            if(settings && Object.keys(settings).length > 0) {
                target = twoDigits(settings.target_hours) + ":" + twoDigits(settings.target_minutes) + ":" + twoDigits(settings.target_seconds);
                threshold = twoDigits(settings.threshold_hours) + ":" + twoDigits(settings.threshold_minutes) + ":" + twoDigits(settings.threshold_seconds);
            }
            let lapStartTime = 0;
            if(state.laps.length > 0){
                lapStartTime = state.laps[state.laps.length - 1].endTime;
            } else {
                lapStartTime = state.startedTime;
            }
            const lapDuration = new Date().getTime() - lapStartTime;
            currentLap = this.formatTimeWithoutMillis(lapDuration);
            return {
                target: target,
                threshold: threshold,
                currentLap: currentLap
            };
        } catch(error) {
            return {
                target: "",
                threshold: "",
                currentLap: ""
            };
        }
    }

    getTwoDigits(input) {
        return twoDigits(input);
    }

    formatTimestamp(time) {
        const output = new Date(time).toTimeString();
        return output.replace("GMT+0530 (India Standard Time)", "");
    }
}

function formatTime(time, includeMillis){

    let diff = time;
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    const millis = Math.floor(((diff  % 1000) * 10 ) / 1000);

    let formattedOutput = twoDigits(hours) + ":" + twoDigits(minutes) + ":" + twoDigits(seconds);
    if(includeMillis){
        formattedOutput +=  "." + millis;
    }
    return formattedOutput;
}

function twoDigits(input) {
    let output = input.toString();
    if(output.length < 2) {
        output = '0' + input;
    }
    return output;
}

export default new Utils();