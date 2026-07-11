const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs/promises");
const path = require("path");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile("index.html");
};

ipcMain.handle("software:getAll", async () => {
  const softwarePath = path.join(__dirname, "src", "data", "softwares");
  const files = await fs.readdir(softwarePath);
  const softwares = [];

  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    const filePath = path.join(softwarePath, file);
    const content = await fs.readFile(filePath, "utf-8");
    softwares.push(JSON.parse(content));
  }
  return softwares;
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quite();
  }
});

app.whenReady().then(() => {
  createWindow();
});
