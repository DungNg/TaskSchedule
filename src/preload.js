// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("bridge", {
  calculateTimeToMinutes: () => ipcRenderer.invoke("calculateTimeToMinutes"),
  scheduleTask: () => ipcRenderer.invoke("scheduleTask"),
  isScheduledTask: () => ipcRenderer.invoke("isScheduledTask"),
  stopScheduledTask: () => ipcRenderer.invoke("stopScheduledTask"),
  isAlertRingging: () => ipcRenderer.invoke("isAlertRingging"),
  stopAudio: () => ipcRenderer.invoke("stopAudio"),
  getInputFromUser: (title, body) => ipcRenderer.invoke("getInputFromUser", title, body),
});
