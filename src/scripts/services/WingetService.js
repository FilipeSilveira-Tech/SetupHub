import { exec } from "child_process";
import util from "util";

const execAsync = util.promisify(exec);

class WingetService {
  constructor() {
    this._installedAppsCache = null;
    this._isInitializing = false;
  }

  async initializeCache() {
    if (this._installedAppsCache || this._isInitializing) return;

    this._isInitializing = true;
    console.log("[SETUPHUB] Iniciando carregando do Winget em background...");

    this._installedAppsCache = await this.listInstalled();
    this._isInitializing = false;
    console.log(
      `[SetupHub] Cache do winget carregado! ${this._installedAppsCache.length} programas encontrados!`,
    );
  }

  async getStatus() {
    if (!this._installedAppsCache) {
      if (this._isInitializing) {
        while (this._isInitializing) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
        return this._installedAppsCache || [];
      }
      await this.initializeCache();
    }
    return this._installedAppsCache;
  }

  async listInstalled() {
    try {
      // 1. Executa o comando padrão
      const output = await this.execute("winget list");
      if (!output) return [];

      // 2. Divide as linhas removendo completamente os '\r' invisíveis do Windows
      const lines = output.replace(/\r/g, "").split("\n");
      if (lines.length < 2) return [];

      // 3. Captura a primeira linha para mapear o índice inicial de cada coluna
      const header = lines[0];
      const idxId = header.indexOf("Id");
      const idxVersion = header.indexOf("Version");
      const idxAvailable = header.indexOf("Available");
      const idxSource = header.indexOf("Source");

      const installedApps = [];

      // Começamos na linha 2 (pulando cabeçalho e os tracinhos "------")
      for (let i = 2; i < lines.length; i++) {
        const line = lines[i];
        if (!line || line.trim() === "" || line.startsWith("---")) continue;

        // Extrai os blocos de texto com base nas posições exatas do cabeçalho
        const name = line.substring(0, idxId).trim();
        const id = line.substring(idxId, idxVersion).trim();
        const version = line.substring(idxVersion, idxAvailable).trim();

        // As colunas finais podem variar dependendo se há atualização ou não
        let available = line.substring(idxAvailable, idxSource).trim();
        let source = line.substring(idxSource).trim();

        // Se o ID estiver vazio, ignoramos a linha
        if (!id) continue;

        // Trata as variações do Winget: se a coluna 'Available' contiver a fonte (ex: winget)
        // significa que o programa está atualizado e não há uma nova versão ali.
        if (available === "winget" || available === "msstore") {
          source = available;
          available = "";
        }

        const isOutdated =
          !!available && available !== version && available !== "Unknown";

        installedApps.push({
          id: id,
          nome: name,
          versaoInstalada: version,
          ultimaVersao: available || version,
          status: isOutdated ? "update" : "installed",
          fonte: source || "Local",
        });
      }
      return installedApps;
    } catch (erro) {
      console.error("Erro ao lista programas do Winget:", erro);
      return [];
    }
  }
  async show(packageId) {
    const output = await this.execute(
      `winget show --id ${packageId} --output json`,
    );
  }
  async install(packageId) {
    return this.execute(
      `winget install --id ${packageId} --accept-source-agreements --accept-packge-agrements`,
    );
  }
  async uninstall(packageId) {
    return this.execute(`winget uninstall --id ${packageId}`);
  }
  async upgrade(packageId) {
    return this.execute(
      `winget upgrade --id ${packageId} --accept-source-agreements --accept-package-agreements`,
    );
  }

  async execute(command) {
    const { stdout } = await execAsync(command);
    return stdout;
  }
}

export default new WingetService();
