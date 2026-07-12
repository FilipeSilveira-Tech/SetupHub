# 🚀 SetupHub

An elegant and ultra-fast desktop automation tool built with **Electron** and **Vanilla JS** to simplify software management on Windows using **Winget**.

Status do Projeto: `🚀 Em Desenvolvimento`

---

## 🔍 Sobre o Projeto

O **SetupHub** foi criado para resolver a demora e a complexidade de configurar novas máquinas de desenvolvimento ou gerenciais. Ele fornece uma interface gráfica (GUI) fluida, bonita e intuitiva sobre o **Windows Package Manager (Winget)**, permitindo que usuários instalem, atualizem ou removam programas com apenas um clique.

---

## ✨ Funcionalidades

- **Sincronização com o Sistema:** Detecta automaticamente quais softwares já estão instalados no Windows, suas versões atuais e se há atualizações disponíveis.
- **Cache Inteligente em Background:** Carrega os dados pesados do terminal (`winget list`) uma única vez na inicialização do app. A navegação por categorias é instantânea (zero delay).
- **Interface Componentizada:** Cards gerados dinamicamente via Vanilla JS refletindo o estado real de cada software em tempo real (Instalado, Atualização Disponível, Não Instalado).
- **Design Responsivo:** Construído com Bootstrap 5 utilizando paleta de cores moderna e sombras suaves para uma experiência nativa.

---

## 🏗️ Arquitetura e Performance

Para garantir que o aplicativo não sofra com a lentidão natural de comandos síncronos de terminal, o projeto utiliza uma arquitetura baseada em **Camada de Cache na Memória (Singletons)**:
[Main Process] ──> Executa 'winget list' em background ao iniciar e salva em cache
│
IPC (window.api)
│
▼
[SoftwareService] ─> Enriquece os dados uma única vez (evita gargalos no IPC)
│
├─> getByCategory() ─> Retorna dados da RAM instantaneamente
▼
[CardRenderer] ────> Renderiza e atualiza dinamicamente os elementos do DOM (Vanilla JS)


---

## 🛠️ Tecnologias Utilizadas

O projeto preza pelo minimalismo técnico e alta performance na renderização:

- **[Electron](https://www.electronjs.org/):** Framework para construção de aplicativos desktop cross-platform com tecnologias web.
- **Vanilla JavaScript (ES6+):** Manipulação nativa do DOM para o máximo de performance, sem overhead de frameworks pesados.
- **[Bootstrap 5](https://getbootstrap.com/):** Framework CSS para estilização ágil e design moderno.
- **[Bootstrap Icons](https://icons.getbootstrap.com/):** Pacote de ícones leve e elegante.

---

# 📄 Licença
Distribuído sob a licença MIT. Veja LICENSE para mais informações.