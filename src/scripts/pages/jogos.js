import CardRenderer from "../render/CardRenderer.js";
import SoftwareService from "../services/SoftwareService.js";

async function renderGamesCategory() {
  const container = document.getElementById("games-list");
  if (!container) return;

  if (!SoftwareService.isInitialized) {
    container.innerHTML = `
      <section class="bg-white border-bottom pb-4 pt-4 mb-4">
          <div class="container">
              <div class="d-flex align-items-center gap-3">
                  <a href="../index.html" class="btn btn-light rounded-circle border shadow-sm text-secondary" style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
                      <i class="bi bi-arrow-left"></i>
                  </a>
                  <div>
                      <h2 class="fw-bolder text-dark mb-0">Jogos</h2>
                      <p class="text-muted mb-0">As melhores maiores plataformas de distribuição de games!</p>
                  </div>
              </div>
          </div>
      </section>
    `;
  }

  // getByCategory vai dar um await global
  const softwares = await SoftwareService.getByCategory("Jogos");
  console.log(softwares);

  container.innerHTML = "";

  softwares.forEach((software) => {
    const card = CardRenderer.render(software);
    container.appendChild(card);
  });
}

export { renderGamesCategory };
