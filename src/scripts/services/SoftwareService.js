class SoftwareService {
  static software = [];
  static initPromise = null;

  constructor() {
    this.initPromise = null;
  }

  async initialize() {
    if (this.isInitialized) return this.softwares;

    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      try {
        console.log("[SetupHub] Carregandos softwares e seus status");

        const softwares = await window.api.software.getAll();
        console.log(softwares);
        const installedApps = await window.api.software.getStatus();

        this.softwares = softwares.map((software) => {
          const found = installedApps.find(
            (app) => app.id.toLowerCase() === software.wingetId.toLowerCase(),
          );

          if (found) {
            return {
              ...software,
              instalado: true,
              versaoInstalada: found.versaoInstalada,
              ultimaVersao: found.ultimaVersao,
              status: found.status,
              progresso: 0,
            };
          } else {
            return {
              ...software,
              instalado: false,
              versaoInstalada: null,
              status: "not-installed",
              progresso: 0,
            };
          }
        });

        this.isInitialized = true;
        console.log(
          `[SetupHub] SoftwareService inicialido com ${this.softwares.length} programas encontrado!`,
        );
        return this.softwares;
      } catch (err) {
        console.error("[SetupHub] Erro ao inicializar SoftwareService:", err);
        this.initPromise = null;
        return [];
      }
    })();

    return this.initPromise;
  }

  async getAll() {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return this.softwares;
  }

  async getByCategory(category) {
    const softwares = await this.getAll();
    return softwares.filter((software) => software.categoria === category);
  }

  async getById(id) {
    const softwares = await this.getAll();
    return softwares.find((software) => software.id === id);
  }

  async searchSoftwares(term) {
    const softwares = await this.getAll();

    if (!term || term.trim() === "") {
      return softwares;
    }

    const lowerTerm = term.toLowerCase();

    return softwares.filter(
      (software) =>
        software.nome?.toLowerCase().includes(lowerTerm) ||
        software.descricao?.toLowerCase().includes(lowerTerm) ||
        software.wingetId?.toLowerCase().includes(lowerTerm),
    );
  }
}

export default new SoftwareService();
