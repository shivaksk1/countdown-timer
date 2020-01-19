/*!
 * This module takes care of capturing the
 * user inputs for the Countdown timer and
 * Threshold values in hh:mm:ss
 */

import React from 'react';

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            target_hours: 0,
            target_minutes: 0,
            target_seconds: 0,
            threshold_hours: 0,
            threshold_minutes: 0,
            threshold_seconds: 0,
            target_error_message: '',
            threshold_error_message: ''
        };
    }
    render() {
        if(this.props.appState !== "Not Started" && this.props.appState !== "Settings") {
            return "";
        }
        return(
            <div className='settingsSection'>
                <div className='setCountdownTimer'>
                    <div className='settingsHeader'>Set Countdown</div>
                    <div className='timer'>
                        <div className='counterInput'>
                            <div className='counterInputHeader'>Hours</div>
                            <div className='counterInputTextbox'>
                                <input type='text' placeholder='hh' id='target_hours' maxLength='2'
                                    defaultValue={this.state.target_hours}
                                    onKeyUp={(event) => this.handleKeyUp(event, 23)}
                                    onBlur={(event) => this.handleBlur(event)}/>
                            </div>
                        </div>
                        <div className='counterInputSeparator'>:</div>
                        <div className='counterInput'>
                            <div className='counterInputHeader'>Minutes</div>
                            <div className='counterInputTextbox'>
                                <input type='text' placeholder='mm' id='target_minutes' maxLength='2' 
                                    defaultValue={this.state.target_minutes}
                                    onKeyUp={(event) => this.handleKeyUp(event, 59)}
                                    onBlur={(event) => this.handleBlur(event)}/>
                            </div>
                        </div>
                        <div className='counterInputSeparator'>:</div>
                        <div className='counterInput'>
                            <div className='counterInputHeader'>Seconds</div>
                            <div className='counterInputTextbox'>
                                <input type='text' placeholder='ss' id='target_seconds' maxLength='2' 
                                    defaultValue={this.state.target_seconds}
                                    onKeyUp={(event) => this.handleKeyUp(event, 59)}
                                    onBlur={(event) => this.handleBlur(event)}/>
                            </div>
                        </div>                                        
                    </div>
                    <div className='targetInputErrorMessage'>{this.state.target_error_message}</div>
                </div>
                <div className='setThreshold'>
                    <div className='settingsHeader'>Set Threshold</div>
                    <div className='threshold'>
                        <div className='counterInput'>
                            <div className='counterInputHeader'>Hours</div>
                            <div className='counterInputTextbox'>
                                <input type='text' placeholder='hh' id='threshold_hours' maxLength='2' 
                                    defaultValue={this.state.threshold_hours}
                                    onKeyUp={(event) => this.handleKeyUp(event, 23)}
                                    onBlur={(event) => this.handleBlur(event)}/>
                            </div>
                        </div>
                        <div className='counterInputSeparator'>:</div>
                        <div className='counterInput'>
                            <div className='counterInputHeader'>Minutes</div>
                            <div className='counterInputTextbox'>
                                <input type='text' placeholder='mm' id='threshold_minutes' maxLength='2' 
                                    defaultValue={this.state.threshold_minutes}
                                    onKeyUp={(event) => this.handleKeyUp(event, 59)}
                                    onBlur={(event) => this.handleBlur(event)}/>
                            </div>
                        </div>
                        <div className='counterInputSeparator'>:</div>
                        <div className='counterInput'>
                            <div className='counterInputHeader'>Seconds</div>
                            <div className='counterInputTextbox'>
                                <input type='text' placeholder='ss' id='threshold_seconds' maxLength='2' 
                                    defaultValue={this.state.threshold_seconds}
                                    onKeyUp={(event) => this.handleKeyUp(event, 59)}
                                    onBlur={(event) => this.handleBlur(event)}/>
                            </div>
                        </div>                                        
                    </div>
                    <div className='thresholdInputErrorMessage'>{this.state.threshold_error_message}</div>
                </div>  
                <div className='actionsSection'>
                    <button className='btnStartTimer' id='btnStartTimer' onClick={(event) => this.handleStartCounter(event)}>Start Counter</button>
                </div>          
            </div>
        );
    }
    handleKeyUp(event, maxAllowedValue) {
        const id = event.target.id;
        const value = event.target.value;
        let error = "";

        // Validation
        if(isNaN(value)) {
            error = "Please enter a valid number";
        } else {
            const numericValue = Number(value);
            if(numericValue < 0 || numericValue > maxAllowedValue) {
                error = "Please enter a value between 0 and " + maxAllowedValue;
            }
        }

        const newState = {
            'target_error_message': '',
            'threshold_error_message': ''
        };
        
        // Update the appropirate error message
        if(error) {
            if(id.indexOf('target') >= 0) {
                newState['target_error_message'] = error;
            } else {
                newState['threshold_error_message'] = error;
            }
        } else {
            newState[id] = value;
        }

        this.setState(newState);
    }

    handleBlur(event) {
        const value = event.target.value;
        if(value && value.toString().length < 2) {
            event.target.value = '0' + value;
        }
    }

    handleStartCounter() {
        if(this.state.target_hours === 0 
            && this.state.target_minutes === 0
            && this.state.target_seconds === 0) {
            alert("Please enter the Countdown Timer value");
            return false;
        }
        if(this.state.threshold_hours === 0 
            && this.state.threshold_minutes === 0
            && this.state.threshold_seconds === 0) {
            alert("Please enter a Threshold value");
            return false;
        }        

        const currentTime = new Date().getTime();
        const targetTime  = currentTime 
            + this.state.target_hours * 60 * 60 * 1000 
            + this.state.target_minutes * 60 * 1000 
            + this.state.target_seconds * 1000;
        const thresholdTime = this.state.threshold_hours * 60 * 60 * 1000 
            + this.state.threshold_minutes * 60 * 1000 
            + this.state.threshold_seconds * 1000;
        const state = {
            ...this.state,
            targetTime: targetTime,
            thresholdTime: thresholdTime
        };
        this.props.startCounterHandler(state);
    }
}

export default Settings;