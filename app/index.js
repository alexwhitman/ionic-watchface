import { battery, charger }   from 'power';
import { BodyPresenceSensor } from 'body-presence';
import clock                  from 'clock';
import * as document          from 'document';
import { display }            from 'display';
import { HeartRateSensor }    from 'heart-rate';
import { today }              from 'user-activity';

class ClockFace {
	constructor() {
		this.batteryValue = document.getElementById('battery-value');
		this.bpmValue = document.getElementById('bpm-value');
		this.clockValue1 = document.getElementById('clock-value1');
		this.clockValue2 = document.getElementById('clock-value2');
		this.dateValue = document.getElementById('date-value');
		this.stepsValue = document.getElementById('steps-value');

		if (HeartRateSensor) {
			this.heartRateSensor = new HeartRateSensor();
		}
		if (BodyPresenceSensor) {
			this.bodyPresenceSensor = new BodyPresenceSensor();
		}
	}

	start() {
		battery.addEventListener('change', () => {
			this.updateBattery(battery.chargeLevel);
		});
		this.updateBattery(battery.chargeLevel);

		clock.granularity = 'seconds';
		clock.addEventListener('tick', (evt) => {
			this.updateClock(evt.date);
			this.updateDate(evt.date);

			this.updateSteps(today.adjusted.steps);
		});

		if (this.heartRateSensor) {
			this.heartRateSensor.addEventListener('reading', () => {
				this.updateHeartRate(this.heartRateSensor.heartRate);
			});

			display.addEventListener('change', () => {
				this.heartRateActive(display.on);
			});

			if (display.on) {
				this.heartRateSensor.start();
			}
		}

		if (this.bodyPresenceSensor) {
			this.bodyPresenceSensor.addEventListener('reading', () => {
				this.heartRateActive(this.bodyPresenceSensor.present);
			});

			display.addEventListener('change', () => {
				if (display.on) {
					this.bodyPresenceSensor.start();
				}
				else {
					this.bodyPresenceSensor.stop();
				}
			});

			if (display.on) {
				this.bodyPresenceSensor.start();
			}
		}
	}

	updateBattery(charge) {
		const chargeValue = Math.floor(charge);
		if (chargeValue <= 16 || battery.charging || charger.connected) {
			this.batteryValue.x = 36;
		}
		else {
			setTimeout(() => {
				this.batteryValue.x = 0;
			}, 1000);
		}
		this.batteryValue.text = chargeValue + '%';
	}

	updateClock(date) {
		const time = date.toTimeString().slice(0, -4);

		this.clockValue1.text = time.slice(0, 4);
		this.clockValue2.text = time.slice(4);
	}

	updateDate(date) {
		let [year, month, day] = date.toISOString().split('T')[0].split('-')
		this.dateValue.text = day + '/' + month + '/' + year;
	}

	updateSteps(steps) {
		this.stepsValue.text = steps;
	}

	heartRateActive(on) {
		if (on) {
			this.heartRateSensor.start();
		}
		else {
			this.heartRateSensor.stop();
			this.updateHeartRate()
		}
	}

	updateHeartRate(rate) {
		if (!rate) {
			rate = '--';
		}
		this.bpmValue.text = rate;
	}
}

(new ClockFace()).start();
