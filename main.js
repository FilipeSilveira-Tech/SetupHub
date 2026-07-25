import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "url";
import path from "path";
import fs from "node:fs";

// Recriando as variáveis que sumiram
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import SoftwareRepository from "./src/scripts/services/SoftwareRepository.js";
import WingetService from "./src/scripts/services/WingetService.js";

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1800,
    height: 870,
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
  const data = await SoftwareRepository.getAll();
  return data;
});
ipcMain.handle("software:getStatus", async () => {
  return await WingetService.listInstalled();
});
ipcMain.handle("software:install", async (event, wingetId) => {
  console.log(`[SetupHub] Iniciando a instalação do ${wingetId}`);
  return await WingetService.install(wingetId);
});
ipcMain.handle("software:upgrade", async (event, wingetId) => {
  console.log(`[IPC Main] Chamando atualização para: ${wingetId}`);
  return await WingetService.upgrade(wingetId);
});
ipcMain.handle("software:uninstall", async (event, wingetId) => {
  console.log(`[IPC Main] Chamando desinstalação para: ${wingetId}`);
  return await WingetService.uninstall(wingetId);
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
