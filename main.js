const { app, BrowserWindow } = require("electron");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  win.loadFile("index.html");
};

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quite();
  }
});

app.whenReady().then(() => {
  createWindow();
});
