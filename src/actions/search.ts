import { spawn } from 'child_process';
import { StarCLIClient } from '../StarCLIClient';
import { NewLineStream } from '../helpers/new-line-stream';
import { DeviceInfo } from '../interfaces/device.interface';
export function search(this: StarCLIClient) {
	return new Promise<DeviceInfo[]>((resolve, reject) => {
		const devices: DeviceInfo[] = [];

		const childProcess = spawn(this.pathToCLI, ['search']);
		const wsStdOut = new NewLineStream();
		const wsStrErr = new NewLineStream();

		childProcess.stdout.pipe(wsStdOut);
		childProcess.stderr.pipe(wsStrErr);

		wsStdOut.on('data', (buffer: Buffer) => {
			let deviceInfoInString = buffer.toString().trim();
			if (
				deviceInfoInString.startsWith('"') &&
        deviceInfoInString.endsWith('"')
			) {
				deviceInfoInString = deviceInfoInString.substring(
					1,
					deviceInfoInString.length - 1
				);
			}
			if (
				deviceInfoInString.startsWith('\'') &&
        deviceInfoInString.endsWith('\'')
			) {
				deviceInfoInString = deviceInfoInString.substring(
					1,
					deviceInfoInString.length - 1
				);
			}
			const [modelName, portName, macAddress, usbSerialNumber] =
        deviceInfoInString.split('|');

			devices.push({
				modelName,
				portName,
				macAddress,
				usbSerialNumber,
			});
		});

		wsStrErr.on('data', (buffer: Buffer) => {
			wsStdOut.destroy();
			wsStrErr.destroy();
			reject(new Error('STD Error: ' + buffer.toString()));
		});

		childProcess.on('close', () => {
			wsStdOut.destroy();
			wsStrErr.destroy();
			resolve(devices);
		});
	});
}
