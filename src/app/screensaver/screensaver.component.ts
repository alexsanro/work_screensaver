import { Component, OnInit, HostListener } from '@angular/core';
import { BrowserWindow, screen, ipcRenderer } from 'electron';
import { ActivatedRoute } from '@angular/router';
import * as path from 'path';
import * as url from 'url';
import { ElectronService } from '../core/services';
const fs = require('fs');

@Component({
  selector: 'app-screensaver',
  templateUrl: './screensaver.component.html',
  styleUrls: ['./screensaver.component.scss']
})

export class ScreensaverComponent implements OnInit {

  windows = null;
  config_json: JSON = null;
  urlFile = null;

  constructor(private route?: ActivatedRoute, private electronService?: ElectronService) {
    this.config_json = this.getFileDataConfigJson();
  }

  ngOnInit() {
    this.urlFile = this.route.snapshot.paramMap.get("file");
    this.closeWindowEvents();
  }

  closeWindowEvents() {
    document.addEventListener('keydown', () => {
      ipcRenderer.send('sendCloseAllWindows');
    });

    document.addEventListener('mousedown', () => {
      ipcRenderer.send('sendCloseAllWindows');
    });

    setTimeout(() => {
      var treshold = 5;
      document.addEventListener('mousemove', (e) => {
        if (treshold * treshold < e.movementX * e.movementX
          + e.movementY * e.movementY) {
          ipcRenderer.send('sendCloseAllWindows');
        }
      });
    }, 3000);
  }

  createWindowScreenSaver(file: any) {
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
        pathname: path.join('dist/index.html'),
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

  getFileDataConfigJson(): JSON {
    let rawdata = fs.readFileSync(path.join('dist/assets/data/data_config.json'));
    return JSON.parse(rawdata);
  }

}
