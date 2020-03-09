import { app, Menu, screen, Tray, globalShortcut, ipcMain, BrowserWindow } from 'electron';
import * as url from 'url';
import * as path from 'path';
const fs = require('fs');
const ioHook = require('iohook');

let tray: Tray = null;

function loadJsonSettings() {
  let rawdata = fs.readFileSync(path.join(process.cwd(), 'resources/data/data_settings.json'));
  return JSON.parse(rawdata);
}

function generateMenu(): Menu {

  var arrayMenu = [];
  var jsonSettings: JSON = loadJsonSettings();
  Object.entries(jsonSettings).forEach(([key, value]) => {
    var json = {
      label: value.label,
      click: function () {
        generateBrowsersScreens(value.file);
      }
    }

    arrayMenu.push(json);
  });

  arrayMenu.push(
    {
      label: 'Settings',
      click: function(){
        newWindowSettings();
      }
    },
    {
    label: 'Close',
    click: function () {
      app.quit();
    }
  })

  var contextMenu = Menu.buildFromTemplate(arrayMenu);

  return contextMenu;
}

function newWindowSettings(): BrowserWindow {
  var settingsWindow = new BrowserWindow({
    height: 700,
    width: 500,
    minHeight: 700,
    minWidth: 500,
    maxHeight: 900,
    maxWidth: 700,
    show: true,
    title: 'Settings',
    focusable: true,
    frame: false,
    backgroundColor: '#FFF',
    movable: true,
    webPreferences: {
      nodeIntegration: true
    }
  })

  settingsWindow.loadURL(url.format({
    pathname: path.join(__dirname,'dist/index.html'),
    protocol: 'file:',
    slashes: true,
    hash: '/settings'
  }));

  globalShortcut.unregisterAll();
  
  return settingsWindow
}

ipcMain.on('refreshMenuIcon', (event) => {
  tray.setContextMenu(generateMenu());
});

ipcMain.on('enableShortcuts', (event) => {
  generateShortcuts();
})

function generateBrowsersScreens(file: String) {
  var displays = screen.getAllDisplays();

  displays.forEach(element => {
    var windowSaver = new BrowserWindow({
      x: element.bounds.x,
      y: element.bounds.y,
      show: true,
      focusable: true,
      fullscreen: true,
      frame: false,
      kiosk: true,
      webPreferences: {
        nodeIntegration: true
      }
    })

    windowSaver.loadFile(path.join(process.cwd(), 'resources/screensave_files/' + file));
    windowSaver.setAlwaysOnTop(true, 'screen-saver');

    windowSaver.webContents.on("did-finish-load", function () {
      ioHookScripts();
    })
  })
}

function ioHookScripts() {
  setTimeout(() => {
    ioHook.on('keydown', event => {
      closeWindows();
    });

    ioHook.on('mousemove', event => {
      closeWindows();
    });

    ioHook.start();
  }, 1000);
}

function generateShortcuts() {
  var json_setting: JSON = loadJsonSettings();
  Object.entries(json_setting).forEach(([key, value]) => {
    globalShortcut.register(value.shortcut, () => {
      generateBrowsersScreens(value.file);
    })
  });
}

function closeWindows() {
  var windows = BrowserWindow.getAllWindows();
  windows.forEach(element => {
    element.destroy();
  });

  ioHook.stop();
}

try {

  app.on('ready', function () {
    tray = new Tray(__dirname + '/dist/favicon.ico');
    tray.setContextMenu(generateMenu());

    generateShortcuts();
  });

  app.on('window-all-closed', () => { })

} catch (e) {
  // Catch Error
  throw e;
}

