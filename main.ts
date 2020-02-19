import { app, Menu, screen, Tray, globalShortcut, ipcMain, BrowserWindow } from 'electron';
const fs = require('fs');
import * as path from 'path';
const ioHook = require('iohook');
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

  arrayMenu.push(
    {
      label: 'Config',
      click: function(){
        newWindowConfig();
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

function newWindowConfig(): BrowserWindow {
  var configWindow = new BrowserWindow({
    height: 700,
    width: 500,
    show: true,
    title: 'Config',
    focusable: true,
    //frame: false,
    movable: true,
    webPreferences: {
      nodeIntegration: true
    }
  })

  configWindow.loadURL(url.format({
    pathname: path.join(__dirname,'dist/index.html'),
    protocol: 'file:',
    slashes: true,
    hash: '/config'
  }));
  
  return configWindow
}

function generateBrowsersScreens(file: String) {
  var displays = screen.getAllDisplays();

  displays.forEach(element => {
    var windowSaver = new BrowserWindow({
      show: true,
      focusable: true,
      fullscreen: true,
      frame: false,
      kiosk: true,
      webPreferences: {
        nodeIntegration: true
      }
    })

    windowSaver.loadFile(__dirname + '/dist/assets/' + file);
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
  var json_config: JSON = loadJsonConfig();
  Object.entries(json_config).forEach(([key, value]) => {
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

  let tray: Tray = null;
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

