import { StarCLIClient } from './StarCLIClient';
import { BarcodeStatus } from './models/barcode-status';
import { DrawerStatus } from './models/drawer-status';
import { PrinterStatus } from './models/printer-status';
import { StatusTypeEnum } from './models/status-type.enum';

export class StarPrinterClient {
	portName: string;
	lastPrinterStatus?: PrinterStatus;
	lastBarcodeStatus?: BarcodeStatus;
	lastDrawerStatus?: DrawerStatus;

	private starCLIClient: StarCLIClient;

	constructor(_starCLIClient: StarCLIClient, portname: string) {
		this.portName = portname;
		this.starCLIClient = _starCLIClient;
	}

	open = async () => {
		return this.starCLIClient.openDrawer(this.portName);
	};

	printerStatus = async (): Promise<PrinterStatus> => {
		const status = (await this.starCLIClient.status(
			this.portName,
			StatusTypeEnum.Printer
		)) as PrinterStatus;

		this.lastPrinterStatus = status;

		return status;
	};

	getBarcode = async (): Promise<{
		barcodes: string[];
	}> => {
		return this.starCLIClient.getBarcode(this.portName);
	};

	barcodeStatus = async (): Promise<BarcodeStatus> => {
		const status = (await this.starCLIClient.status(
			this.portName,
			StatusTypeEnum.Printer
		)) as BarcodeStatus;

		this.lastBarcodeStatus = status;

		return status;
	};

	drawerStatus = async (): Promise<DrawerStatus> => {
		const status = (await this.starCLIClient.status(
			this.portName,
			StatusTypeEnum.Printer
		)) as DrawerStatus;

		this.lastDrawerStatus = status;

		return status;
	};
}
