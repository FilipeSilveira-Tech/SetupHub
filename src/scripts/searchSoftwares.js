import SoftwareService from "./services/SoftwareService.js";
import CardRenderer from "./render/CardRenderer.js";

console.log("O conteudo de SoftwareService é:", SoftwareService);

document.addEventListener("DOMContentLoaded", async () => {
  // Garante que os dados estejam carregados
  await SoftwareService.initPromise;

  const searchInput = document.getElementById("search-input");
  const mainContainer = document.querySelector(".row"); // Ou o ID da sua row

  searchInput.addEventListener("input", async (e) => {
    const term = e.target.value;

    // CHAMADA CORRETA:
    const filtered = await SoftwareService.searchSoftwares(term);

    if (Array.isArray(filtered)) {
      mainContainer.innerHTML = ""; // Limpa os cards atuais

      filtered.forEach((software) => {
        const card = CardRenderer.render(software);
        mainContainer.appendChild(card);
      });
    }
  });
});
