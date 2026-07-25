import SoftwareService from "../services/SoftwareService.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("[SETUPHUB] Aplicativo inicializado. Carregando dados...");

  // function moreOneHours(ISOTimestamp) {
  //   if (!ISOTimestamp) return true;

  //   const dataTimestamp = new Date(ISOTimestamp).getTime();

  //   if (isNaN(dataTimestamp)) return true;

  //   const now = Date.now();
  //   const ONE_HOURS_MS = 60 * 60 * 1000; // 3.600.000 ms

  //   console.log("Diferença de minutos: ", (now - dataTimestamp) / 1000 / 60);

  //   return now - dataTimestamp > ONE_HOURS_MS;
  // }

  async function SoftwaresByCategory(data) {
    const navegadores = data.filter(
      (software) => software.categoria === "Navegadores",
    );
    const comunicatao = data.filter(
      (software) => software.categoria === "Comunicação",
    );
    const desenvolvimento = data.filter(
      (software) => software.categoria === "Desenvolvimento",
    );
    const ides = data.filter((software) => software.categoria === "IDEs");
    const produtividade = data.filter(
      (software) => software.categoria === "Produtividade",
    );
    const multimida = data.filter(
      (software) => software.categoria === "Multimídia",
    );
    const jogos = data.filter((software) => software.categoria === "Jogos");
    const compactadores = data.filter(
      (software) => software.categoria === "Compactadores",
    );
    const utilitarios = data.filter(
      (software) => software.categoria === "Utilitários",
    );
    const drivers = data.filter((software) => software.categoria === "Drivers");
    const seguranca = data.filter(
      (software) => software.categoria === "Segurança",
    );
    const fontes = data.filter((software) => software.categoria === "Fontes");

    return {
      navegadores,
      comunicatao,
      desenvolvimento,
      ides,
      produtividade,
      multimida,
      jogos,
      compactadores,
      utilitarios,
      drivers,
      seguranca,
      fontes,
    };
  }

  const cacheStorage = localStorage.getItem("@SetupHub:AppsData");
  // const lastUpdate = localStorage.getItem("@SetupHub:LastUpdate");

  if (!cacheStorage) {
    const data = await SoftwareService.initialize();
    console.log(
      `[SetupHub] Todos os ${data.lenght} softwares foram carregados!`,
    );
    const {
      navegadores,
      comunicatao,
      desenvolvimento,
      ides,
      produtividade,
      multimida,
      jogos,
      compactadores,
      utilitarios,
      drivers,
      seguranca,
      fontes,
    } = await SoftwaresByCategory(data);

    await localStorage.setItem(
      "@SetupHub:Navegadores",
      JSON.stringify(navegadores),
    );
    await localStorage.setItem(
      "@SetupHub:Comunicação",
      JSON.stringify(comunicatao),
    );
    await localStorage.setItem(
      "@SetupHub:Desenvolvimento",
      JSON.stringify(desenvolvimento),
    );
    await localStorage.setItem("@SetupHub:IDEs", JSON.stringify(ides));
    await localStorage.setItem(
      "@SetupHub:Produtividade",
      JSON.stringify(produtividade),
    );
    await localStorage.setItem(
      "@SetupHub:Multimídia",
      JSON.stringify(multimida),
    );
    await localStorage.setItem("@SetupHub:Jogos", JSON.stringify(jogos));
    await localStorage.setItem(
      "@SetupHub:Compactadores",
      JSON.stringify(compactadores),
    );
    await localStorage.setItem(
      "@SetupHub:Utilitários",
      JSON.stringify(utilitarios),
    );
    await localStorage.setItem("@SetupHub:Drivers", JSON.stringify(drivers));
    await localStorage.setItem(
      "@SetupHub:Segurança",
      JSON.stringify(seguranca),
    );
    await localStorage.setItem("@SetupHub:Fontes", JSON.stringify(fontes));
    await localStorage.setItem(
      "@SetupHub:LastUpdate",
      new Date().toISOString(),
    );
    console.log("[NO CACHE] Cache gravado com sucesso!");
  }

  // if (moreOneHours(lastUpdate)) {
  //   const data = await SoftwareService.initialize();
  //   console.log(
  //     `[SetupHub] Todos os ${data.lenght} softwares foram carregados!`,
  //   );

  //   const {
  //     navegadores,
  //     comunicatao,
  //     desenvolvimento,
  //     ides,
  //     produtividade,
  //     multimida,
  //     jogos,
  //     compactadores,
  //     utilitarios,
  //     drivers,
  //     seguranca,
  //     fontes,
  //   } = await SoftwaresByCategory(data);
  //   await localStorage.setItem(
  //     "@SetupHub:Navegadores",
  //     JSON.stringify(navegadores),
  //   );
  //   await localStorage.setItem(
  //     "@SetupHub:Comunicação",
  //     JSON.stringify(comunicatao),
  //   );
  //   await localStorage.setItem(
  //     "@SetupHub:Desenvolvimento",
  //     JSON.stringify(desenvolvimento),
  //   );
  //   await localStorage.setItem("@SetupHub:IDEs", JSON.stringify(ides));
  //   await localStorage.setItem(
  //     "@SetupHub:Produtividade",
  //     JSON.stringify(produtividade),
  //   );
  //   await localStorage.setItem(
  //     "@SetupHub:Multimídia",
  //     JSON.stringify(multimida),
  //   );
  //   await localStorage.setItem("@SetupHub:Jogos", JSON.stringify(jogos));
  //   await localStorage.setItem(
  //     "@SetupHub:Compactadores",
  //     JSON.stringify(compactadores),
  //   );
  //   await localStorage.setItem(
  //     "@SetupHub:Utilitários",
  //     JSON.stringify(utilitarios),
  //   );
  //   await localStorage.setItem("@SetupHub:Drivers", JSON.stringify(drivers));
  //   await localStorage.setItem(
  //     "@SetupHub:Segurança",
  //     JSON.stringify(seguranca),
  //   );
  //   await localStorage.setItem("@SetupHub:Fontes", JSON.stringify(fontes));
  //   await localStorage.setItem(
  //     "@SetupHub:LastUpdate",
  //     new Date().toISOString(),
  //   );
  //   console.log("[CACHE OUTDATED] Cache atualizado!");
  // }
});
