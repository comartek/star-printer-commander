import { openDrawer } from './actions/open-drawer';
import { search } from './actions/search';
import { status } from './actions/status';
import { getBarcode } from './actions/get-barcode';

export class StarCLIClient {
	pathToCLI: string;
	constructor(pathToCLI: string) {
		this.pathToCLI = pathToCLI;
	}

	search = search;
	status = status;
	openDrawer = openDrawer;
	getBarcode = getBarcode;
}
