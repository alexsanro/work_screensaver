import { Component, OnInit, HostListener } from '@angular/core';
import { BrowserWindow, remote } from 'electron';
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

  windows: Object = null;
  windowSaver: BrowserWindow = null;
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
      //console.log("ddd");
      this.closeAllWindows();
    });
    //document.addEventListener('mousedown', sendQuitWindows);

    setTimeout(() => {
      document.addEventListener('mousemove', () => {
        this.closeAllWindows();
      });
    }, 3000);
  }

  closeAllWindows() {
    //console.log("close")
    //console.log(this.electronService.remote.BrowserWindow.getAllWindows());
    this.windows = this.electronService.remote.BrowserWindow.getAllWindows();
    console.log(typeof(this.windows));
    console.log(this.windows)
    Object.keys(this.windows).forEach(key => {
      console.log(this.windows[key].destroy())
      this.windows[key].destroy();
    });
  }

  createWindowScreenSaver(file: any) {

    this.windowSaver = new BrowserWindow({
      height: 650,
      width: 650,
      x: 0,
      y: 0,
      show: false,
      focusable: true,
      //alwaysOnTop: true,
      //fullscreen: true,
      //frame: false,
      webPreferences: {
        nodeIntegration: true
      }
    })

    this.windowSaver.loadURL(url.format({
      pathname: path.join('dist/index.html'),
      protocol: 'file:',
      slashes: true,
      hash: '/screensaver/' + file
    }));

    this.windowSaver.once('ready-to-show', () => {
      this.windowSaver.show();
      this.windowSaver.setAlwaysOnTop(true, 'screen-saver');
    })
  }

  getFileDataConfigJson(): JSON {
    let rawdata = fs.readFileSync(path.join('dist/assets/data/data_config.json'));
    return JSON.parse(rawdata);
  }

}
