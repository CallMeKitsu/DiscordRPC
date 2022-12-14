const { app, BrowserWindow} = require('electron')
const path = require('path')

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 1050,
    height: 600,
    minWidth: 1050,
    webPreferences: {
      preload: path.join(__dirname, './public/preload.js')
    },
    autoHideMenuBar: true
  })

  mainWindow.loadFile('./public/index.html')

  mainWindow.webContents.setWindowOpenHandler()
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('refresh', () => {
  mainWindow.reload()
})