import { spawn } from 'child_process';
import { StarCLIClient } from '../StarCLIClient';
import { NewLineStream } from '../helpers/new-line-stream';

export function getBarcode(this: StarCLIClient, portName: string) {
	return new Promise<{
		barcode: string;
	}>((resolve, reject) => {
		let barcode = '';
		const theCommand = this.pathToCLI;
		const args = ['barcode', '--port', portName];

		const childProcess = spawn(theCommand, args);

		const wsStdOut = new NewLineStream();
		const wsStrErr = new NewLineStream();

		childProcess.stdout.pipe(wsStdOut);
		childProcess.stderr.pipe(wsStrErr);

		wsStdOut.on('data', (buffer: Buffer) => {
			const data = buffer.toString();
			const part = data.split(':');

			if (part.length !== 2) {
				reject(new Error('STD Error: Is not status'));
			}

			barcode = (part[1] as string) || '';
		});

		wsStrErr.on('data', (buffer: Buffer) => {
			wsStdOut.destroy();
			wsStrErr.destroy();
			reject(new Error('STD Error: ' + buffer.toString()));
		});

		childProcess.on('close', () => {
			wsStdOut.destroy();
			wsStrErr.destroy();
			resolve({ barcode });
		});
	});
}
