import fs from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

// Recriando as variáveis que sumiram
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SoftwareRepository {
  constructor() {
    this.softwares = [];
  }

  async getAll() {
    const softwarePath = path.join(__dirname, "..", "..", "data", "softwares");
    const files = await fs.readdir(softwarePath);
    const softwares = [];

    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      const filePath = path.join(softwarePath, file);
      const content = await fs.readFile(filePath, "utf-8");
      softwares.push(JSON.parse(content));
    }
    return softwares;
  }
}

export default new SoftwareRepository();
