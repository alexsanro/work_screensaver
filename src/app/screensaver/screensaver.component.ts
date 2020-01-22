import { Component, OnInit, HostListener } from '@angular/core';
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
    this.closeWindow();
  }

  closeWindow() {
    document.addEventListener('keydown', function () {
      alert("d")
    });
    //document.addEventListener('mousedown', sendQuitWindows);

    setTimeout(function () {
      document.addEventListener('mousemove', function (e) {
        alert("dddd")  
      });
    }, 3000);
  }

  createWindowScreenSaver(file: any) {

    this.windowSaver = new BrowserWindow({
      height: 250,
      width: 250,
      x: 0,
      y: 0,
      show: false,
      focusable: true,
      alwaysOnTop: true,
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

  @HostListener('mousemove') mousemove() {
    this.closeWindow();
  }

  @HostListener('document:keydown', ['$event']) onKeyDown(e) {
    this.closeWindow();
  }

  setTimer() {
    var hola = setInterval(() => {
      this.createWindowScreenSaver('coffee_cup.gif');
      clearInterval(hola);
    }, 5000);
  }
}
