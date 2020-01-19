/*!
 * Utility functions to be used by the Test Cases.
 */

import 'babel-polyfill';

class TestUtils {
    setTimerAndThreshold(app, timerValue, thresholdValue) {
        //Setting Timer
        populateTextbox(app, 'target_hours', timerValue[0]);
        populateTextbox(app, 'target_minutes', timerValue[1]);
        populateTextbox(app, 'target_seconds', timerValue[2]);

        //Setting Threshold
        populateTextbox(app, 'threshold_hours', thresholdValue[0]);
        populateTextbox(app, 'threshold_minutes', thresholdValue[1]);
        populateTextbox(app, 'threshold_seconds', thresholdValue[2]);
    }

    async sleep(millis) {
        await new Promise(resolve => setTimeout(resolve, millis));
    }
}

//Only for inputting Numbers to a Textbox
function populateTextbox(app, textbox, value) {
    const textboxSelector = '#' + textbox;
    const keycodes = {
        '0':'48', '1':'49', '2':'50', '3':'51', '4':'52', '5':'53', '6':'54', '7':'55', '8':'56', '9':'57'
    };
    if(value !== null && value !== "") {
        value = value.toString();
        app.find(textboxSelector).simulate('keyUp', {target:{id:textbox, value:value}});
    }
}

export default new TestUtils();