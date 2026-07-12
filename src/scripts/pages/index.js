import SoftwareService from "../services/SoftwareService";

document.addEventListener("DOMContentLoaded", () => {
  console.log("[SETUPHUB] Aplicativo inicializado. Carregando dados...");

  SoftwareService.initialize()
    .then((software) => {
      console.log(
        `[SETUPHUB] Todos os ${software.length} softwares foram carregados`,
      );
    })
    .catch((error) => {
      console.error("[SETUPHUB] Erro ao carregar dados inicias: ", error);
    });
});
