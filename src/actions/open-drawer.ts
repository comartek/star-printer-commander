import { spawn } from 'child_process';
import { StarCLIClient } from '../StarCLIClient';
import { NewLineStream } from '../helpers/new-line-stream';

export function openDrawer(
	this: StarCLIClient,
	portName: string,
) {
	return new Promise((resolve, reject) => {
		const theCommand = this.pathToCLI;
		const args = ['opencash', '--port', portName];

		const childProcess = spawn(theCommand, args);

		const wsStdOut = new NewLineStream();
		const wsStrErr = new NewLineStream();

		childProcess.stdout.pipe(wsStdOut);
		childProcess.stderr.pipe(wsStrErr);

		wsStrErr.on('data', (buffer: Buffer) => {
			wsStdOut.destroy();
			wsStrErr.destroy();
			reject(new Error('STD Error: ' + buffer.toString()));
		});

		childProcess.on('close', () => {
			wsStdOut.destroy();
			wsStrErr.destroy();
			resolve(null);
		});
	});
}
