import { StarCLIClient } from "./src/StarCLIClient";
import { StarPrinterClient } from "./src/StarPrinterClient";

const client = new StarCLIClient('./star-printer-cli/StarCashCLI.exe', );
const starPrinterClient = new StarPrinterClient(client, 'USBPRN:Star POP10')



  const main = async () => {
//   const data =  await client.search();
   await starPrinterClient.open();
 }
 main()