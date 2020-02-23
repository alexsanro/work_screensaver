import { Component, OnInit } from '@angular/core';
import * as path from 'path';
const fs = require('fs');

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

  shortCutKeyDown: string = null;
  config = null;
  
  constructor() { }

  ngOnInit() {
    this.config = this.getConfigFile();
    console.log(this.config)
  }

  onKeyDownShortcut(event: any){
    if(event.ctrlKey == true && event.altKey == true && /^\w{1}$/.test(event.key)){
      this.shortCutKeyDown = event.key;
    }
    event.preventDefault();
  }

  onkeyUpShortcut(event: any){
    if(this.shortCutKeyDown != null){
      event.target.value = "Alt+CommandOrControl+"+this.shortCutKeyDown;
    }
  }

  getConfigFile(){
    var rawdata = fs.readFileSync(path.join(__dirname, '/assets/data/data_config.json'));
    return JSON.parse(rawdata);
  }
}
