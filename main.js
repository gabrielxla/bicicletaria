const { app, BrowserWindow, nativeTheme, Menu,ipcMain} = require('electron')

const path = require('node:path')
let win

const createWindow = () => {
   nativeTheme.themeSource ='dark'
   win = new BrowserWindow({
    width: 1010,
    height: 720,
   // minimizable: false,
    //resizable:false,
    webPreferences: {
      preload: path.join(__dirname,'preload.js')
    }
   
  })
// menu personalizado
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
  
  win.loadFile('./src/views/index.html')
  // recebimento dos pedido do renderizador
  ipcMain.on('client-window', () => {
    clientWindow ()
  })
   // recebimento dos pedido do renderizador
   ipcMain.on('os-window', () => {
    osWindow ()
  })
}
// Janela Sobre
function aboutWindow(){
  nativeTheme.themeSource = 'dark'
  const main = BrowserWindow.getFocusedWindow()
  let about
  if (main) {
    about =  new BrowserWindow({
      width: 360,
      height:200,
      autoHideMenuBar: true,
      resizable: false,
      minimizable:false,
      modal: true,
      parent:main
    })
  }
  about.loadFile('./src/views/sobre.html')
}
//fim da janela sobre
//janela cliente
let client
function clientWindow() {
  nativeTheme.themeSource = 'dark'
  const main = BrowserWindow.getFocusedWindow()
  if (main) {
    client =  new BrowserWindow({
      width: 1010,
      height:720,
      resizable: false,
      modal:true,
      minimizable:false,
      parent:main
    })

}
client.loadFile('./src/views/cliente.html')
client.center()
}
// janela OS
let os
function osWindow() {
  nativeTheme.themeSource = 'dark'
  const main = BrowserWindow.getFocusedWindow()
  if (main) {
    os =  new BrowserWindow({
      width: 1010,
      height:720,
      resizable: false,
      modal:true,
      minimizable:false,
      parent:main
    })

}
os.loadFile('./src/views/os.html')
os.center()
}
// inicia a aplicação
app.whenReady().then(() => {
    createWindow()
  
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
      }
    })
  })
  
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  //reduzir logs nao criticos
  app.commandLine.appendSwitch('log-level','3')

  // template do menu
const  template = [
  {
     label: 'Cadastro',
     submenu: [{label: 'Clientes', click: () => clientWindow ()},{label:'OS', click: () => osWindow ()},{type:'separator'},{label:'Sair', click: () => app.quit(), accelerator:'Alt+F4'}]
  },
  {
      label: 'Relatorios',
      submenu: [{label: 'Clientes'},{type: 'separator'},{label:'OS abertas'},{label:'OS concluidas'}]
  },
  {
      label: 'Ferramentas',
      submenu: [{label: 'Aplicar Zoom', role: 'zoomIn'},{label: 'Reduzir', role: 'zoomOut'},{ label: 'Restaurar o Zoom', role: 'resetZoom'},{ type: 'separator'},{label: 'Reiniciar', role: 'reload'},{ label: 'Ferramenta do desenvolvedor', role:'toggleDevTools'}]
  },
  {
      label: 'Ajuda',
      submenu: [{label:'Sobre',click: () => aboutWindow()}]
  }
]

