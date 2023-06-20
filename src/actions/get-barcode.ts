import { spawn } from 'child_process';
import { StarCLIClient } from '../StarCLIClient';
import { NewLineStream } from '../helpers/new-line-stream';

export function getBarcode(this: StarCLIClient, portName: string) {
	return new Promise<{
		barcodes: string[];
	}>((resolve, reject) => {
		let barcodes: string[] = [];
		const theCommand = this.pathToCLI;
		const args = ['barcode', '--port', portName];

		const childProcess = spawn(theCommand, args);

		const wsStdOut = new NewLineStream();
		const wsStrErr = new NewLineStream();

		childProcess.stdout.pipe(wsStdOut);
		childProcess.stderr.pipe(wsStrErr);

		wsStdOut.on('data', (buffer: Buffer) => {
			const data = buffer.toString();
			barcodes = data
				.trim()
				// eslint-disable-next-line no-control-regex
				.replace(new RegExp('\rBarcode', 'g'), '')
				.split(':')
				.splice(1)
				.filter((i) => i !== '');
		});

		wsStrErr.on('data', (buffer: Buffer) => {
			wsStdOut.destroy();
			wsStrErr.destroy();
			reject(new Error('STD Error: ' + buffer.toString()));
		});

		childProcess.on('close', () => {
			wsStdOut.destroy();
			wsStrErr.destroy();
			resolve({ barcodes });
		});
	});
}
