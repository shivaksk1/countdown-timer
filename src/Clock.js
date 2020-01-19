/*!
 * This module takes care of 
 * rendering the Clock and also displaying
 * the action buttons - Pause/Split/Undo/Reset
 */

import React from 'react';
import Utils from './Utils';

class Clock extends React.PureComponent {
    constructor(props) {
        super(props);
    }
    render() {
        if(this.props.appState === "Not Started" || this.props.appState === "Settings") {
            return "";
        }        
        const appState = this.props.appState;
        const lapsCount = this.props.lapsCount;
        const buttonStates = Utils.getButtonStates(appState, lapsCount);
        const pauseButtonName = buttonStates.pauseButtonName;
        const pauseButtonClass = buttonStates.pauseButtonClass;
        const splitButtonClass = buttonStates.splitButtonClass;
        const undoButtonClass = buttonStates.undoButtonClass;
        const resetButtonClass = buttonStates.resetButtonClass;

        let clockDisplayClass = "clockValue";
        let currentLapClass = "snapshotText";
        if(this.props.beyondThreshold) {
            clockDisplayClass += " beyondThreshold";
            currentLapClass += " beyondThreshold";
        }
        
        return (
            <div id='clockSection' className='clockSection'>
                <div className='clockDisplay'>
                    <div className='clockHeaderRow'>
                        <div className='clockHeader'>Hours</div>
                        <div className='clockHeader'>Minutes</div>
                        <div className='clockHeader'>Seconds</div>
                        <div className='clockHeader'>Millis</div>
                    </div>
                    <div id='clock' className={clockDisplayClass}>{this.props.clockDisplay}</div>
                </div>
                <div className='clockActions'>
                    <div className={pauseButtonClass} id='pauseButton' onClick={(event) => this.props.pauseHandler(event)}>{pauseButtonName}</div>
                    <div className={splitButtonClass} id='splitButton' onClick={(event) => this.props.splitHandler(event)}>Split</div>
                    <div className={undoButtonClass} id='undoButton' onClick={(event) => this.props.undoHandler(event)}>Undo</div>
                    <div className={resetButtonClass} id='resetButton' onClick={(event) => this.props.resetHandler(event)}>Reset</div>
                </div>
                <div className='shortcutsSection'>
                    <div className='shortcutsSectionHeader'>Shortcuts: </div>
                    <div className='shortcut'>
                        <div className='shortcutKey'>Space key:</div>
                        <div className='shortcutDescription'>Split</div>
                    </div>
                    <div className='shortcut'>
                        <div className='shortcutKey'>Backspace:</div>
                        <div className='shortcutDescription'>Undo</div>
                    </div>
                </div>
                <div className='snapshotViewSection'>
                    <div className='snapshotTable'>
                        <div className='snapshot'>
                            <div className='snapshotHeader'>Timer Value</div>
                            <div className='snapshotText'>{this.props.target}</div>
                        </div>
                        <div className='snapshot'>
                            <div className='snapshotHeader'>Threshold</div>
                            <div className='snapshotText'>{this.props.threshold}</div>
                        </div>
                        <div className='snapshot'>
                            <div className='snapshotHeader'>Current Lap</div>
                            <div className={currentLapClass}>{this.props.currentLap}</div>
                        </div>                                                                        
                    </div>
                    <div className='backToSettings'>
                        <button className='btnBack' onClick={(event) => this.props.changeSettingsHandler(event)}>Back</button>
                    </div>
                </div>
            </div>            
        );
    }
}

export default Clock;