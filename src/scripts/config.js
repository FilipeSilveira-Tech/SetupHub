document.addEventListener("DOMContentLoaded", async () => {
  const themeSwitch = document.getElementById("themeSwitch"); // Tema escuro
  const notifSwitch = document.getElementById("notifSwitch"); // Notificação
  const startupSwitch = document.getElementById("startupSwitch"); // Iniciar com windows
  const silentSwitch = document.getElementById("silentSwitch"); // Modo silencioso
  const agreeSwitch = document.getElementById("agreementsSwitch"); // Aceitas termos
  const cacheSelect = document.getElementById("cacheSelect"); // Limpesa do cache

  // 1. Carrega as configurações salvas ao abrir a tela
  try {
    const config = JSON.parse(localStorage.getItem("@SetupHub:Config"));

    // Aplica os valores salvos nos elementos da tela
    themeSwitch.checked = config.themeDark;
    notifSwitch.checked = config.notifications;
    startupSwitch.checked = config.startWithWindows;
    silentSwitch.checked = config.silentInstall;
    agreeSwitch.checked = config.agreeTerms;
    cacheSelect.value = config.cacheRefresh;
  } catch (error) {
    ((themeSwitch.checked = false),
      (notifSwitch.checked = false),
      (startupSwitch.checked = false),
      (silentSwitch.checked = false),
      (agreeSwitch.checked = false),
      (cacheSelect.value = null));
  }

  // 2. Função que coleta os dados atuais da tela e manda salvar
  function updateAndSave() {
    const currentConfig = {
      themeDark: themeSwitch.checked,
      notifications: notifSwitch.checked,
      startWithWindows: startupSwitch.checked,
      silentInstall: silentSwitch.checked,
      agreeTerms: agreeSwitch.checked,
      cacheRefresh: cacheSelect.value,
    };

    // Envia para o processo principal salvar no JSON
    localStorage.setItem("@SetupHub:Config", JSON.stringify(currentConfig));
  }

  // 3. Escuta qualquer mudança nos inputs/select e dispara a função de salvar
  themeSwitch.addEventListener("change", updateAndSave);
  notifSwitch.addEventListener("change", updateAndSave);
  startupSwitch.addEventListener("change", updateAndSave);
  silentSwitch.addEventListener("change", updateAndSave);
  agreeSwitch.addEventListener("change", updateAndSave);
  cacheSelect.addEventListener("change", updateAndSave);
});
