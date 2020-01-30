import { app, Menu, screen, Tray, globalShortcut, ipcMain, BrowserWindow } from 'electron';
const fs = require('fs');
import * as path from 'path';
import * as url from 'url';

function loadJsonConfig() {
  let rawdata = fs.readFileSync(path.join(__dirname, 'dist/assets/data/data_config.json'));
  return JSON.parse(rawdata);
}

function generateMenu(): Menu {

  var arrayMenu = [];
  var jsonConfig: JSON = loadJsonConfig();
  Object.entries(jsonConfig).forEach(([key, value]) => {
    var json = {
      label: value.label,
      click: function () {
        generateBrowsersScreens(value.file);
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

function generateBrowsersScreens(file: String) {
  var displays = screen.getAllDisplays();

  displays.forEach(element => {
    var windowSaver = new BrowserWindow({
      height: 450,
      width: 450,
      x: element.bounds.x,
      y: element.bounds.y,
      show: false,
      focusable: true,
      alwaysOnTop: true,
      fullscreen: true,
      frame: false,
      webPreferences: {
        nodeIntegration: true
      }
    })

    windowSaver.loadURL(url.format({
      pathname: path.join(__dirname,'dist/index.html'),
      protocol: 'file:',
      slashes: true,
      hash: '/screensaver/' + file
    }));

    windowSaver.once('ready-to-show', () => {
      windowSaver.show();
      windowSaver.setAlwaysOnTop(true, 'screen-saver');
    })
  })
}

function generateShortcuts() {
  var json_config: JSON = loadJsonConfig();
  Object.entries(json_config).forEach(([key, value]) => {
    globalShortcut.register(value.shortcut, () => {
      generateBrowsersScreens(value.file);
    })
  });
}

try {

  let tray: Tray = null;
  app.on('ready', function () {
    tray = new Tray(__dirname+'/dist/favicon.ico');
    tray.setContextMenu(generateMenu());

    generateShortcuts();
  });

  ipcMain.on('sendCloseAllWindows', function (event) {
    var windows = BrowserWindow.getAllWindows();
    windows.forEach(element => {
      element.destroy();
    });
  });

  app.on('window-all-closed', () => { })

} catch (e) {
  // Catch Error
   throw e;
}

