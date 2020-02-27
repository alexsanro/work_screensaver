import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, FormControl } from '@angular/forms';
import * as path from 'path';
import { ElectronService } from '../core/services';
const fs = require('fs');

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],

  encapsulation: ViewEncapsulation.None,
})
export class ConfigComponent implements OnInit {

  shortCutKeyDown: string = null;

  configForm: FormGroup = this.builder.group({
    itemsConfig: this.builder.array([])
  })

  constructor(protected builder: FormBuilder, protected electronService: ElectronService) { }

  ngOnInit() {
    let cred = this.configForm.controls.itemsConfig as FormArray;

    this.getConfigFile().forEach(element => {
      element.fileConfig = element.file;
      element.file = "";

      cred.push(this.builder.group(element));
    });
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
      this.shortCutKeyDown = null;
    }
  }

  getConfigFile() {
    var rawdata = fs.readFileSync(path.join(__dirname, '/assets/data/data_config.json'));
    return JSON.parse(rawdata);
  }

  addNewGroupFields() {
    this.shortCutKeyDown = null;

    var formArray = this.configForm.controls.itemsConfig as FormArray;
    formArray.push(this.builder.group({
      label: '',
      shortcut: '',
      file: '',
      fileConfig: ''
    }));
  }

  trackByFn(index, item) {
    return index;  
  }

  saveConfiguration() {
    /*var file: any = document.getElementsByName("fileScreenSaver[]")[0];
    
    fs.copyFile(file.files[0].name, 'destination.txt', (err) => {
      if (err) throw err;
      console.log('source.txt was copied to destination.txt');
    });*/

    console.log(this.configForm.value)
    //console.log(this.configForm)
    /*Object.keys(this.configForm.value).forEach(key => {
      
    });*/

    this.configForm.value.itemsConfig.forEach(element => {
      console.log(element)
    });
  }

  minimizeWindow(){
    this.electronService.remote.BrowserWindow.getFocusedWindow().minimize();
  }

  closeWindow(){
    this.electronService.remote.BrowserWindow.getFocusedWindow().close();
  }

}
