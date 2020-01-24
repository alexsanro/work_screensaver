import { app, Menu, Tray, globalShortcut, ipcMain, BrowserWindow } from 'electron';
import { ScreensaverComponent } from './src/app/screensaver/screensaver.component';

let tray = null;
let screenSaverComponent = new ScreensaverComponent();

function prepareAplication() {
  tray = new Tray('src/favicon.ico');
  tray.setContextMenu(createMenu());
}

function createMenu(): Menu {
  
  var arrayMenu = [];
  Object.entries(screenSaverComponent.config_json).forEach(([key, value]) => {
    var json = {
      label: value.label,
      click: function () {
        screenSaverComponent.createWindowScreenSaver(value.file);
      }
    }

    arrayMenu.push(json);
  });

  arrayMenu.push({
    label: 'Close',
    click: function () {
      app.quit();
    }
  })

  var contextMenu = Menu.buildFromTemplate(arrayMenu);

  return contextMenu;
}

function generateShortcuts(){
  Object.entries(screenSaverComponent.config_json).forEach(([key, value]) => { 
    globalShortcut.register(value.shortcut, () => {
      screenSaverComponent.createWindowScreenSaver(value.file);
    })
  });
}

try {
  app.on('ready', function(){
    prepareAplication();
    generateShortcuts();
  });

  ipcMain.on('sendCloseAllWindows', function (event) {
    var windows = BrowserWindow.getAllWindows();
    windows.forEach(element => {
      element.destroy();
    });
  });

  app.on('window-all-closed', () => {})

} catch (e) {
  // Catch Error
  // throw e;
}
