# Smart Countdown Timer in React.js

The user can set the Countdown value and start the timer.
The timer supports the following features:
* Start/Stop, Play/Resume.
* Laps
* Set a Threshold (in hh:mm:ss) for Laps. If any Lap exceeds this Threshold, the Lap would be highlighted.
* The timer still continues even after completing the countdown (negative overflow) unless the user stops.
* The timer maintains state even when the browser tab is closed, or refreshed.
* Mobile compatible (responsive).

## Prerequisites

* Node version: ^10.18
* Npm version: ^6.13

## Steps to install and run

### To access as a standalone html file:
After cloning the repository, run npm install:
```
npm install
```

Execute the following command:
```
npm run start
```

After building, the files would be generated in the dist folder.
* index.html
* styles.css
* bundle.js

Open the index.html directly from the browser.

### To access from a dev web server:
After cloning the repository, and running npm install, execute the following command:
```
npm run start-dev
```
This would build the sources, and also start a dev server on port 4040.
The timer can then be accessed by http://localhost:4040 from the browser.

## Running Tests
Execute the following command to run the integration tests:
```
npm run test
```

