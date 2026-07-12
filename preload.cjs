const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  software: {
    getAll: () => ipcRenderer.invoke("software:getAll"),
    getStatus: () => ipcRenderer.invoke("software:getStatus"),
  },
});
