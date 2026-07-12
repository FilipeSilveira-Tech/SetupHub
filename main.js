import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "url";
import path from "path";

// Recriando as variáveis que sumiram
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import SoftwareRepository from "./src/scripts/services/SoftwareRepository.js";
import WingetService from "./src/scripts/services/WingetService.js";
import SoftwareService from "./src/scripts/services/SoftwareService.js";

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    icon: "./src/assets/icon.ico",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  win.loadFile("index.html");
};

ipcMain.handle("software:getAll", async () => {
  return await SoftwareRepository.getAll();
});

ipcMain.handle("software:getStatus", async () => {
  return await WingetService.listInstalled();
});

app.on("window-all-closed", () => {
  app.quit();
});

app.whenReady().then(async () => {
  await createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  WingetService.initializeCache().catch((err) => {
    console.error("Falha ao carregar programas na inicialização", err);
  });
});
