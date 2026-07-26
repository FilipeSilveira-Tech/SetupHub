class CardRenderer {
  static render(software) {
    const col = this.createColumn();
    const card = this.createCard(software);
    const body = this.createBody();
    const header = this.createHeader(software);
    const description = this.createDescription(software);
    const footer = this.createFooter(software);

    body.append(header, description, footer);
    card.appendChild(body);
    col.appendChild(card);
    return col;
  }

  // Coluna
  static createColumn() {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-xl-4";
    return col;
  }

  // Card principal
  static createCard(software) {
    const card = document.createElement("div");
    card.id = `card-${software.wingetId.replace(/\./g, "-")}`;
    // Adicionado rounded-4 e software-card para o efeito hover no CSS
    card.className = "card h-100 border-0 shadow-sm software-card rounded-4";
    return card;
  }

  // Body
  static createBody() {
    const body = document.createElement("div");
    body.className = "card-body p-4 d-flex flex-column";
    return body;
  }

  // Cabeçalho (Ícone + Título + Status)
  static createHeader(software) {
    const header = document.createElement("div");
    header.className = "d-flex align-items-start gap-3 mb-3";

    header.append(
      this.createIconContainer(software),
      this.createInfo(software),
    );

    return header;
  }

  static createIconContainer(software) {
    const iconContainer = document.createElement("div");
    // Visual do ícone mais premium com borda sutil e arredondamento
    iconContainer.className =
      "bg-white border shadow-sm rounded-4 d-flex align-items-center justify-content-center flex-shrink-0";
    iconContainer.style.width = "64px";
    iconContainer.style.height = "64px";

    iconContainer.append(this.createIcon(software));
    return iconContainer;
  }

  static createIcon(software) {
    const icon = document.createElement("img");

    const cleanPath = software.icone.replace(/^(\.\.\/|\/)+/, "");
    const isInsidePagesDir = window.location.pathname.includes("/pages/");
    const relativePrefix = isInsidePagesDir ? "../../" : "";

    icon.src = relativePrefix + cleanPath;
    icon.alt = software.nome;
    icon.width = 36;
    icon.height = 36;

    icon.onerror = () => {
      icon.src = relativePrefix + "src/assets/iconError.png";
    };
    return icon;
  }

  static createInfo(software) {
    const info = document.createElement("div");
    info.className = "d-flex flex-column justify-content-center h-100 pt-1";
    info.append(this.createTitle(software), this.createSubtitle(software));
    return info;
  }

  static createTitle(software) {
    const title = document.createElement("h5");
    title.className = "fw-bolder text-dark mb-1";
    title.textContent = software.nome;
    return title;
  }

  static createSubtitle(software) {
    const subtitleContainer = document.createElement("div");
    subtitleContainer.appendChild(this.createBadgeStatus(software.status));
    return subtitleContainer;
  }

  static createBadgeStatus(status) {
    const badge = document.createElement("span");
    // Badges mais elegantes (rounded-pill, espaçamento interno)
    const baseClass = "badge rounded-pill px-3 py-2 fw-medium border";

    switch (status) {
      case "installed":
        badge.className = `${baseClass} bg-success-subtle text-success border-success-subtle`;
        badge.innerHTML =
          '<i class="bi bi-check-circle-fill me-1"></i> Instalado';
        break;

      case "update":
        badge.className = `${baseClass} bg-warning-subtle text-warning-emphasis border-warning-subtle`;
        badge.innerHTML =
          '<i class="bi bi-arrow-clockwise me-1"></i> Atualização Disponível';
        break;

      case "installing":
      case "updating":
      case "unistalling":
        badge.className = `${baseClass} bg-info-subtle text-info-emphasis border-info-subtle`;
        badge.innerHTML =
          '<i class="bi bi-hourglass-split me-1"></i> Processando...';
        break;

      default:
        badge.className = `${baseClass} bg-secondary-subtle text-secondary border-secondary-subtle`;
        badge.innerHTML = '<i class="bi bi-circle me-1"></i> Não Instalado';
    }
    return badge;
  }

  // Descrição + Tabela de Versões
  static createDescription(software) {
    const container = document.createElement("div");
    container.className = "mb-4 mt-2 flex-grow-1 d-flex flex-column";

    const description = document.createElement("p");
    description.className = "text-muted small mb-3";
    description.textContent = software.descricao;

    container.appendChild(description);
    container.appendChild(this.createSoftwareInfo(software));
    return container;
  }

  static createSoftwareInfo(software) {
    const container = document.createElement("div");
    // Box de versões mais limpo e arredondado
    container.className = "rounded-4 p-3 bg-light mt-auto";
    container.append(
      this.createInfoRow("Status Atual", this.getStatusText(software.status)),
      this.createInfoRow("Versão Local", software.versaoInstalada ?? "---"),
      this.createInfoRow("Winget Repo", software.ultimaVersao ?? "---"),
    );
    return container;
  }

  static createInfoRow(label, value) {
    const row = document.createElement("div");
    row.className = "d-flex justify-content-between align-items-center py-1";

    const left = document.createElement("span");
    left.className = "text-secondary small fw-medium";
    left.textContent = label;

    const right = document.createElement("span");
    right.className = "text-dark small fw-bold text-truncate ms-2";
    right.style.maxWidth = "120px";
    right.title = value; // Mostra tooltip se o texto cortar
    right.textContent = value;

    row.append(left, right);
    return row;
  }

  static getStatusText(status) {
    switch (status) {
      case "installed":
        return "Atualizado";
      case "update":
        return "Desatualizado";
      case "installing":
        return "Baixando...";
      default:
        return "Pendente";
    }
  }

  // Rodapé (Botões e Progress Bar)
  static createFooter(software) {
    const footer = document.createElement("div");
    footer.className = "mt-auto pt-2";

    switch (software.status) {
      case "not-installed":
        footer.appendChild(this.createInstallButton(software));
        break;
      case "installed":
        footer.appendChild(this.createRemoveButton(software));
        break;
      case "update":
        footer.appendChild(this.createUpdateButton(software));
        break;
      case "installing":
      case "unistalling":
      case "updating":
        footer.appendChild(this.createProgressBar(software));
        break;
    }
    return footer;
  }

  // --- BOTÕES --- //
  static createInstallButton(software) {
    const button = document.createElement("button");
    button.className =
      "btn btn-primary w-100 rounded-3 py-2 fw-semibold shadow-sm transition-all";
    button.innerHTML = '<i class="bi bi-download me-2"></i> Instalar App';

    button.onclick = async () => {
      software.status = "installing";
      this.updateCardOnScreen(software);
      try {
        await window.api.software.install(software.wingetId);
        software.status = "installed";
        this.updateCardOnScreen(software);
      } catch (error) {
        console.error(error);
        software.status = "not-installed";
        this.updateCardOnScreen(software);
      }
    };
    return button;
  }

  static createRemoveButton(software) {
    const button = document.createElement("button");
    button.className =
      "btn btn-outline-danger w-100 rounded-3 py-2 fw-semibold transition-all";
    button.innerHTML = '<i class="bi bi-trash3 me-2"></i> Desinstalar';

    button.onclick = async () => {
      software.status = "unistalling";
      this.updateCardOnScreen(software);
      try {
        await window.api.software.uninstall(software.wingetId);
        software.status = "not-installed";
        this.updateCardOnScreen(software);
      } catch (error) {
        console.error(error);
        software.status = "installed";
        this.updateCardOnScreen(software);
      }
    };
    return button;
  }

  static createUpdateButton(software) {
    const button = document.createElement("button");
    button.className =
      "btn btn-warning w-100 rounded-3 py-2 fw-bold shadow-sm transition-all text-dark";
    button.innerHTML =
      '<i class="bi bi-cloud-arrow-down-fill me-2"></i> Atualizar Agora';

    button.onclick = async () => {
      software.status = "updating";
      this.updateCardOnScreen(software);
      try {
        await window.api.software.update(software.wingetId);
        software.status = "installed";
        this.updateCardOnScreen(software);
      } catch (error) {
        console.error(error);
        software.status = "update";
        this.updateCardOnScreen(software);
      }
    };
    return button;
  }

  static updateCardOnScreen(software) {
    const cardId = `card-${software.wingetId.replace(/\./g, "-")}`;
    const oldCardElement = document.getElementById(cardId);
    if (oldCardElement) {
      const newCardCol = this.render(software);
      const newCardElement = newCardCol.querySelector(".software-card");
      oldCardElement.replaceWith(newCardElement);
    }
  }

  static createProgressBar(software) {
    const progressContainer = document.createElement("div");
    progressContainer.className = "progress rounded-3 shadow-sm";
    progressContainer.style.height = "42px"; // Altura idêntica a dos botões

    const progressBar = document.createElement("div");
    const baseClass =
      "progress-bar progress-bar-striped progress-bar-animated w-100 fw-bold d-flex align-items-center justify-content-center text-white";

    if (software.status === "unistalling") {
      progressBar.className = `${baseClass} bg-danger`;
      progressBar.innerHTML = '<i class="bi bi-trash me-2"></i> Removendo...';
    } else if (software.status === "updating") {
      progressBar.className = `${baseClass} bg-warning text-dark`;
      progressBar.innerHTML =
        '<i class="bi bi-arrow-repeat me-2"></i> Atualizando...';
    } else if (software.status === "installing") {
      progressBar.className = `${baseClass} bg-primary`;
      progressBar.innerHTML =
        '<i class="bi bi-download me-2"></i> Instalando...';
    }

    progressContainer.appendChild(progressBar);
    return progressContainer;
  }
}

export default CardRenderer;
