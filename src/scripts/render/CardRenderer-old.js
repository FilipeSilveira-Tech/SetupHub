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
    col.className = "col-12 col-md-6 col-lg-4";
    return col;
  }
  // Card
  static createCard(software) {
    const card = document.createElement("div");
    card.id = `card-${software.wingetId.replace(/\./g, "-")}`;
    card.className = "card h-100 border-0 shadow-sm browser-card";
    return card;
  }
  // Body
  static createBody() {
    const body = document.createElement("div");
    body.className = "card-body p-4 d-flex flex-column";
    return body;
  }
  // Cabeçalho
  static createHeader(software) {
    const header = document.createElement("div");
    header.className = "d-flex align-items-center gap-3 mb-3";

    header.append(
      this.createIconContainer(software),
      this.createInfo(software),
    );

    return header;
  }

  static createIconContainer(software) {
    // Container do ícone
    const iconContainer = document.createElement("div");
    iconContainer.className =
      "bg-light rounded p-2 d-flex align-items-center justify-content-center";
    iconContainer.style.width = "48px";
    iconContainer.style.height = "48px";

    iconContainer.append(this.createIcon(software));

    return iconContainer;
  }

  static createIcon(software) {
    // Ícone
    const icon = document.createElement("img");
    icon.src = software.icone;
    icon.alt = software.nome;
    icon.width = 32;
    icon.height = 32;
    return icon;
  }

  static createInfo(software) {
    const info = document.createElement("div");
    info.append(this.createTitle(software), this.createSubtitle(software));
    return info;
  }
  static createTitle(software) {
    const title = document.createElement("h5");
    title.className = "fw-bold mb-0";
    title.textContent = software.nome;
    return title;
  }
  static createSubtitle(software) {
    const subtitle = this.createBadgeStatus(software.status);
    return subtitle;
  }
  static createBadgeStatus(status) {
    const badge = document.createElement("span");
    switch (status) {
      case "installed":
        badge.className = "badge text-bg-success";
        badge.textContent = "Instalado";
        break;

      case "update":
        badge.className = "badge text-bg-warning";
        badge.textContent = "Atualização Disponível";
        break;

      case "installing":
        badge.className = "badge text-bg-info";
        badge.textContent = "Instalando...";
        break;

      default:
        badge.className = "badge text-bg-secondary";
        badge.textContent = "Não Instalado";
    }
    return badge;
  }

  static createDescription(software) {
    const container = document.createElement("div");
    container.className = "mb-3";

    const description = document.createElement("p");
    description.className = "text-muted small mb-2";
    description.textContent = software.descricao;

    container.appendChild(description);
    container.appendChild(this.createSoftwareInfo(software));
    return container;
  }
  static createSoftwareInfo(software) {
    const container = document.createElement("div");
    container.className = "border rounded-3 p-3 bg-light-subtle mt-3";
    container.append(
      this.createInfoRow("Status", this.getStatusLabel(software.status)),
      this.createInfoRow("Versão", software.versaoInstalada ?? "--"),
      this.createInfoRow("Última", software.ultimaVersao ?? "--"),
    );
    return container;
  }
  static createInfoRow(label, value) {
    const row = document.createElement("div");
    row.className = "d-flex justify-content-between align-items-center py-1";

    const left = document.createElement("span");
    left.className = "text-secondary small";
    left.textContent = label;

    const right = document.createElement("span");
    right.className = "fw-semibold small";
    right.textContent = value;

    row.append(left, right);
    return row;
  }
  static getStatusLabel(status) {
    switch (status) {
      case "installed":
        return "🟢 Instalado";

      case "update":
        return "🟡 Atualização disponível";

      case "installing":
        return "🔵 Instalando";

      default:
        return "⚪ Não instalado";
    }
  }

  static createFooter(software) {
    const footer = document.createElement("div");
    footer.className = "mt-auto";

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
  static createInstallButton(software) {
    const button = document.createElement("button");
    button.className = "btn btn-primary w-100";
    button.innerHTML = '<i class="bi bi-download"></i> Instalar';

    button.onclick = async () => {
      console.log("[RENDERER] Iniciando instalação de:", software.nome);

      // 1. Mudamos o status na memória para atualizar a UI imediatamente
      software.status = "installing";

      // 2. Atualiza apenas este Card específico na tela para mostrar a barra de progresso
      this.updateCardOnScreen(software);

      try {
        let wingetId = software.wingetId;
        console.log("ID DO APLICATIVO: ", wingetId);

        await window.api.software.install(wingetId);
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
    button.className = "btn btn-danger w-100";
    button.innerHTML = '<i class="bi bi-trash3"></i> Remover';

    button.onclick = async () => {
      console.log("Iniciando a remoção de: ", software.nome);
      software.status = "unistalling";
      this.updateCardOnScreen(software);

      try {
        let wingetId = software.wingetId;
        console.log("ID DO APLICATIVO: ", wingetId);

        await window.api.software.uninstall(wingetId);
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
    button.className = "btn btn-warning w-100";
    button.innerHTML = '<i class="bi bi-arrow-clockwise"></i> Update';
    button.onclick = async () => {
      console.log("Iniciando a atualização de: ", software.nome);
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
      // Gera um novo card completo com os novos status/botões
      const newCardCol = this.render(software);
      const newCardElement = newCardCol.querySelector(".browser-card");

      // Substitui o elemento antigo dentro da coluna pelo novo estruturado
      oldCardElement.replaceWith(newCardElement);
    }
  }

  static createProgressBar(software) {
    const progressContainer = document.createElement("div");
    progressContainer.className = "progress";
    progressContainer.style.height = "35px";

    const progressBar = document.createElement("div");

    if (software.status === "unistalling") {
      progressBar.className =
        "progress-bar progress-bar-striped progress-bar-animated bg-danger w-100 text-white fw-bold d-flex align-items-center justify-content-center shadow-sm rounded";
      progressBar.textContent = "Removendo Software...";
    } else if (software.status === "updating") {
      progressBar.className =
        "progress-bar progress-bar-striped progress-bar-animated bg-warning w-100 text-dark fw-bold d-flex align-items-center justify-content-center shadow-sm rounded";
      progressBar.textContent = "Atualizando Software...";
    } else if (software.status === "installing") {
      progressBar.className =
        "progress-bar progress-bar-striped progress-bar-animated bg-info w-100 text-white fw-bold d-flex align-items-center justify-content-center shadow-sm rounded";
      progressBar.textContent = "Baixando e Instalando...";
    }

    progressContainer.appendChild(progressBar);
    return progressContainer;
  }
}

export default CardRenderer;
