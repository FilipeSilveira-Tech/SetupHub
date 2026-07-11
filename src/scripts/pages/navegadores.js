import { SoftwareService } from "../SoftwareService.js";
const softwareService = new SoftwareService();

async function init() {
  const softwares = await softwareService.getAll();
  console.log(softwares);
}
init();
