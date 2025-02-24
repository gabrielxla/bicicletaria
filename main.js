const { app, BrowserWindow, nativeTheme, Menu} = require('electron')

let win

const createWindow = () => {
   nativeTheme.themeSource ='dark'
   win = new BrowserWindow({
    width: 1024,
    height: 768,
   // minimizable: false,
    //resizable:false,
    
   
  })
// menu personalizado
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
  
  win.loadFile('./src/views/index.html')
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
     submenu: [{label: 'Clientes'},{label:'OS'},{type:'separator'},{label:'Sair', click: () => app.quit(), accelerator:'Alt+F4'}]
  },
  {
      label: 'Relatorios',
      submenu: [{label: 'Clientes'},{label:'OS abertas'},{label:'OS concluidas'}]
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