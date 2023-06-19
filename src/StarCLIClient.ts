import { openDrawer } from './actions/open-drawer';
import {search} from './actions/search'
import {status} from './actions/status'

export class StarCLIClient {
    pathToCLI: string;
    constructor(pathToCLI: string) {
        this.pathToCLI = pathToCLI;
    }
    
    search = search
    status = status
    openDrawer = openDrawer

}

