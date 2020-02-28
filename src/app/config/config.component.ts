import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, FormControl } from '@angular/forms';
import * as path from 'path';
import { ElectronService } from '../core/services';
import { throwError } from 'rxjs';
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
      //element.fileConfig = element.file;
      //element.file = "";
      console.log(element)
      cred.push(this.builder.group({
        label: element.label,
        shortcut: element.shortcut,
        file: '',
        inputFileControl: element.file
      }));
    });
  }

  onKeyDownShortcut(event: any) {
    if (event.ctrlKey == true && event.altKey == true && /^\w{1}$/.test(event.key)) {
      this.shortCutKeyDown = event.key;
    }
    event.preventDefault();
  }

  onkeyUpShortcut(event: any, i) {
    
    if (this.shortCutKeyDown != null) {  
      event.target.value = "Alt+CommandOrControl+" + this.shortCutKeyDown;
      this.shortCutKeyDown = null;
      this.configForm.controls.itemsConfig.value[i].shortcut = "Alt+CommandOrControl+" + this.shortCutKeyDown;
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
      inputFileControl: ''
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

    console.log(this.configForm.controls.itemsConfig.value)
  
    /*Object.keys(this.configForm.value).forEach(key => {
      
    });*/

    this.checkEmptyValuesConfigForm();  

    var configFormValues = this.configForm.controls.itemsConfig.value;
    configFormValues.forEach((element, key) => {
      if(element.file == "" || element.file == undefined){
        configFormValues[key].file = element.inputFileControl;
        delete configFormValues[key].inputFileControl;
      }else{
        this.copyFileToAssets(configFormValues[key].file);
        configFormValues[key].file = path.basename(element.file);
      }
    });

    console.log(configFormValues);
  }

  minimizeWindow(){
    this.electronService.remote.BrowserWindow.getFocusedWindow().minimize();
  }

  closeWindow(){
    this.electronService.remote.BrowserWindow.getFocusedWindow().close();
  }

  checkEmptyValuesConfigForm(){
    
    this.configForm.value.itemsConfig.forEach(element => {
      console.log(element.shortcut)
      if(element.label == "" || element.shortcut == "" || (element.file == "" && element.inputFileControl == "")){
        this.electronService.remote.dialog.showErrorBox('Error 202', 'There are many fields empties');
        throw new Error("There are empty values!!");
      }
    });

    return true;
  }

  copyFileToAssets(positionInput: number){
    //console.log("ddd")
    //console.log(document.getElementsByTagName('input'))
    var file = document.querySelectorAll("input[type=file]")
    console.log(file[positionInput][0].files);
    
    /*fs.copyFile(file[0].name, 'destination.txt', (err) => {
      if (err) throw err;
      console.log('source.txt was copied to destination.txt');
    });*/
  }

}
