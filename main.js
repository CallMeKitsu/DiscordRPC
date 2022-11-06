const { app, BrowserWindow} = require('electron')
const path = require('path')

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 600,
    minWidth: 1200,
    webPreferences: {
      preload: path.join(__dirname, './public/preload.js')
    }
  })

  mainWindow.loadFile('./public/index.html')
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