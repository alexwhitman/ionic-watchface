# Ionic Watchface

A simple watch face for the FitBit Ionic.

<img src="https://raw.githubusercontent.com/alexwhitman/ionic-watchface/master/screenshot.png" width="348">

## Building

Building doesn't work on Node.js >= 17.x so 16.x is added as a dependency. To build, clone the repository and run
```sh
npm install
./node_modules/.bin/node $(which npm) run-script debug
```