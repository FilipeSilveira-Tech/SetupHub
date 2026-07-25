import CardRenderer from "../render/CardRenderer.js";
import SoftwareService from "../services/SoftwareService.js";

async function renderComunicationCategory() {
  const container = document.getElementById("comunication-list");
  if (!container) return;

  const data = JSON.parse(localStorage.getItem("@SetupHub:Comunicação"));
  console.log("NAVEGADORES", data);

  if (!SoftwareService.isInitialized) {
    container.innerHTML = `
      <section class="bg-white border-bottom pb-4 pt-4 mb-4">
          <div class="container">
              <div class="d-flex align-items-center gap-3">
                  <a href="../index.html" class="btn btn-light rounded-circle border shadow-sm text-secondary" style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
                      <i class="bi bi-arrow-left"></i>
                  </a>
                  <div>
                      <h2 class="fw-bolder text-dark mb-0">Comunicação</h2>
                      <p class="text-muted mb-0">Gerencie seus aplicativos de mensagens e chamadas.</p>
                  </div>
              </div>
          </div>
      </section>
    `;
  }

  // getByCategory vai dar um await global
  if (!data) {
    const softwares = await SoftwareService.getByCategory("Comunicação");
    container.innerHTML = "";

    softwares.forEach((software) => {
      const card = CardRenderer.render(software);
      container.appendChild(card);
    });

    await localStorage.setItem(
      "@SetupHub:Comunicação",
      JSON.stringify(softwares),
    );
  }

  container.innerHTML = "";

  data.forEach((software) => {
    const card = CardRenderer.render(software);
    container.appendChild(card);
  });
}

export { renderComunicationCategory };
