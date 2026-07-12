import CardRenderer from "../render/CardRenderer.js";
import SoftwareService from "../services/SoftwareService.js";

async function renderMultimidiaCategory() {
  const container = document.getElementById("multimidia-list");
  if (!container) return;

  if (!SoftwareService.isInitialized) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="text-muted mt-2">Sincronizando programas com o Winget...</p>
      </div>
    `;
  }

  // getByCategory vai dar um await global
  const softwares = await SoftwareService.getByCategory("Multimídia");
  console.log(softwares);

  container.innerHTML = "";

  softwares.forEach((software) => {
    const card = CardRenderer.render(software);
    container.appendChild(card);
  });
}

export { renderMultimidiaCategory };
