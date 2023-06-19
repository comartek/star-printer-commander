import { spawn } from 'child_process';
import { StarCLIClient } from '../StarCLIClient';
import { StatusTypeEnum } from '../models/status-type.enum';
import { NewLineStream } from '../helpers/new-line-stream';
import { BarcodeStatus } from '../models/barcode-status';
import { DrawerStatus } from '../models/drawer-status';
import { PrinterStatus } from '../models/printer-status';

type Status = BarcodeStatus | DrawerStatus | PrinterStatus;
export function status(
	this: StarCLIClient,
	portName: string,
	type: StatusTypeEnum
) {
	return new Promise((resolve, reject) => {
		const theCommand = this.pathToCLI;
		let status: Status
		const childProcess = spawn(theCommand, [
			'status',
			'--port',
			portName,
			'--type',
			type,
		]);

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

			status = part[0] === 'Status' ? part[1] as Status : PrinterStatus.Error;
		});

		wsStrErr.on('data', (buffer: Buffer) => {
			wsStdOut.destroy();
			wsStrErr.destroy();
			reject(new Error('STD Error: ' + buffer.toString()));
		});

		childProcess.on('close', () => {
			wsStdOut.destroy();
			wsStrErr.destroy();
			resolve({ status });
		});
	});
}
