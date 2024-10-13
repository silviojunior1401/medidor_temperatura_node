var sensorLib = require("node-dht-sensor");

var sensor = {
	sensors: [
		{
			name: "Indoor",
			type: 22,
			pin: 22,
		},
	],
	readLogLoop: function () {
		for (var sensor in this.sensors) {
			var readout = sensorLib.read(
				this.sensors[sensor].type,
				this.sensors[sensor].pin
			);
			// console.log(readout);
			console.log(
				`[${this.sensors[sensor].name}] ` +
					`temperature: ${readout.temperature.toFixed(1)}°C, ` +
					`humidity: ${readout.humidity.toFixed(1)}%`
			);
		}
		setTimeout(function () {
			sensor.read();
		}, 4000);
	},
	read: function () {
		data = [];
		for (var sensor in this.sensors) {
			var readout = sensorLib.read(
				this.sensors[sensor].type,
				this.sensors[sensor].pin
			);

			data.push({
				temperatura: readout.temperature,
				umidade: readout.humidity,
			});
		}

		return data;
	},
};

// sensor.readLogLoop();

(async function () {
	const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

	while (true) {
		console.log(sensor.read());

		await sleep(4000);
	}
})();
