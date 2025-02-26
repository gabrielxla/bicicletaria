const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('api',{
    clientWindow: () => ipcRenderer.send('client-window'),osWindow: () => ipcRenderer.send('os-window')
})