/*!
 * This module takes care of 
 * rendering the list of Laps.
 */

import React from 'react';

class Laps extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        if(this.props.appState === "Not Started" || this.props.appState === "Settings") {
            return "";
        }
        let lapTableSection = "";
        if(this.props.laps.length <= 0) {
            lapTableSection = (
                <div className='noLaps'>No Laps yet</div>                
            );
        } else {
            lapTableSection = (
                this.props.laps.map((lap, index) => {
                    const thresholdTime = this.props.thresholdTime;
                    let className = "lap";
                    if(lap.duration > thresholdTime){
                        className += " beyondThreshold";
                    }
                    return (
                        <div className={className} key={index}>
                            <div className='sno'>{index + 1}</div>
                            <div className='lapStartTime'>{lap.startTimeStr}</div>
                            <div className='lapEndTime'>{lap.endTimeStr}</div>
                            <div className='lapDuration'>{lap.durationStr}</div>
                        </div>
                    )
                })                
            );
        }
        return(
            <div id='lapsSection' className='lapsSection'>
                <div className='lapsSectionHeader'>Laps</div>
                <div className='lapTableHeader'>
                    <div className='sno'>#</div>
                    <div className='lapStartTime'>Start</div>
                    <div className='lapEndTime'>End</div>
                    <div className='lapDuration'>Duration</div>
                </div>
                <div className='lapsTable'>
                    {lapTableSection}
                </div>
            </div>             
        );
    }
}

export default Laps;