import { app, Menu as MenuItem, globalShortcut } from 'electron';
import { ScreensaverComponent } from './src/app/screensaver/screensaver.component';
const { Tray, Menu } = require('electron')


let tray = null;
let screenSaverComponent = new ScreensaverComponent();
let win = null;

function prepareAplication() {
  tray = new Tray('src/favicon.ico');
  tray.setContextMenu(createMenu());
}

function createMenu(): MenuItem {
  
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

  app.on('window-all-closed', () => {
    win = null;
  })

} catch (e) {
  // Catch Error
  // throw e;
}
