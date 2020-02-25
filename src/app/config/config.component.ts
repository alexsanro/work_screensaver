import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as path from 'path';
import { FormBuilder, FormArray, FormGroup, FormControl } from '@angular/forms';
const fs = require('fs');

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],

  encapsulation: ViewEncapsulation.None,
})
export class ConfigComponent implements OnInit {

  shortCutKeyDown: string = null;
  configFile: Array<any>;

  /*signUpForm = this.builder.group({
    name: [''],
    email: [''],
    password: ['']
  })*/

  configForm : FormGroup = new FormGroup({
    nameLabel: new FormControl([]),
    shortcutInput: new FormControl([]),
    fileScreenSaver: new FormControl([])
  })

  constructor(protected builder: FormBuilder) { }

  ngOnInit() {
    this.configFile = this.getConfigFile();
  }

  onKeyDownShortcut(event: any) {
    if (event.ctrlKey == true && event.altKey == true && /^\w{1}$/.test(event.key)) {
      this.shortCutKeyDown = event.key;
    }
    event.preventDefault();
  }

  onkeyUpShortcut(event: any) {
    if (this.shortCutKeyDown != null) {
      event.target.value = "Alt+CommandOrControl+" + this.shortCutKeyDown;
    }
  }

  getConfigFile() {
    var rawdata = fs.readFileSync(path.join(__dirname, '/assets/data/data_config.json'));
    return JSON.parse(rawdata);
  }

  newFields() {
    this.shortCutKeyDown = null;
    this.configFile.push({});
  }

  saveConfig() {
    /*var file: any = document.getElementsByName("fileScreenSaver[]")[0];
    
    fs.copyFile(file.files[0].name, 'destination.txt', (err) => {
      if (err) throw err;
      console.log('source.txt was copied to destination.txt');
    });*/

    console.log(this.configForm.value)
    //console.log(this.configForm)
    /*Object.keys(this.configForm.value).forEach(key => {
      
    });*/
  }
  
}
