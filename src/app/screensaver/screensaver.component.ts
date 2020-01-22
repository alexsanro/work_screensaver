import { Component, OnInit } from '@angular/core';
import { BrowserWindow } from 'electron';
import { ActivatedRoute } from '@angular/router';
import * as path from 'path';
import * as url from 'url';
const fs = require('fs');

@Component({
  selector: 'app-screensaver',
  templateUrl: './screensaver.component.html',
  styleUrls: ['./screensaver.component.scss']
})

export class ScreensaverComponent implements OnInit {

  windowSaver: BrowserWindow = null;
  config_json: JSON = null;
  urlFile = null;

  constructor(private route?: ActivatedRoute) { 
    this.config_json = this.getFileDataConfigJson();
  }

  ngOnInit() {
    this.urlFile = this.route.snapshot.paramMap.get("file");
  }

  createWindowScreenSaver(file: any) {

    this.windowSaver = new BrowserWindow({
      x: 0,
      y: 0,
      show: false,
      focusable: true,
      fullscreen: true,
      frame: false,
      webPreferences: {
        nodeIntegration: true
      }
    })

    this.windowSaver.loadURL(url.format({
      pathname: path.join('dist/index.html'),
      protocol: 'file:',
      slashes: true,
      hash: '/screensaver/'+file
    }));

    this.windowSaver.once('ready-to-show', () => {
      this.windowSaver.show();
    })
  }

  getFileDataConfigJson(): JSON{
    let rawdata = fs.readFileSync(path.join('dist/assets/data/data_config.json'));
    return JSON.parse(rawdata);
  }
}
