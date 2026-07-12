const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  software: {
    getAll: () => ipcRenderer.invoke("software:getAll"),
    getStatus: () => ipcRenderer.invoke("software:getStatus"),
    install: (wingetId) => ipcRenderer.invoke("software:install", wingetId),
    update: (wingetId) => ipcRenderer.invoke("software:upgrade", wingetId),
    uninstall: (wingetId) => ipcRenderer.invoke("software:uninstall", wingetId),
  },
});
