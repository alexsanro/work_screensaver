import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, FormControl } from '@angular/forms';
import * as path from 'path';
import { ElectronService } from '../core/services';
import { throwError } from 'rxjs';
import { ipcRenderer } from 'electron';
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

    this.getConfigFile().forEach(element => {
      this.itemsConfig.push(this.builder.group({
        label: element.label || "",
        shortcut: element.shortcut || "",
        file: '',
        inputFileControl: element.file || ""
      }));
    });

  }

  onKeyDownShortcut(event: any) {
    if (event.ctrlKey == true && event.altKey == true && /^\w{1}$/.test(event.key)) {
      this.shortCutKeyDown = event.key;
    }
    event.preventDefault();
  }

  onkeyUpShortcut(event: any, i: number) {
    if (this.shortCutKeyDown != null) {
      this.itemsConfig.at(i).get('shortcut').patchValue("Alt+CommandOrControl+" + this.shortCutKeyDown);
      this.shortCutKeyDown = null;
    }
  }

  getConfigFile() {
    var rawdata = fs.readFileSync(path.join(__dirname, '/assets/data/data_config.json'));
    return JSON.parse(rawdata);
  }

  addNewGroupFields() {
    this.itemsConfig.push(this.builder.group({
      label: '',
      shortcut: '',
      file: '',
      inputFileControl: ''
    }));
  }

  saveConfiguration() {
    this.checkEmptyValuesConfigForm();  
    
    var configFormValues = this.itemsConfig.getRawValue();
    Object.entries(configFormValues).forEach(([key, element]) => {
      if(fs.existsSync(configFormValues[key].inputFileControl) && fs.lstatSync(configFormValues[key].inputFileControl).isFile()){
        this.copyFileToAssets(element.inputFileControl);
        configFormValues[key].file = path.basename(element.file);
      }else{
        configFormValues[key].file = element.file;
      }
      delete configFormValues[key].inputFileControl;
    });

    try { 
      fs.writeFileSync('dist/assets/data/data_config.json', JSON.stringify(configFormValues), 'utf-8'); 
      ipcRenderer.send('refreshMenuIcon');
    }
    catch(e) {
       alert('Failed to save the file !');
    }
  }

  convertPathFileToBasename(file): string{
    return path.basename(file);
  }

  get itemsConfig(): FormArray{
    return this.configForm.get('itemsConfig') as FormArray;
  }

  minimizeWindow(){
    this.electronService.remote.BrowserWindow.getFocusedWindow().minimize();
  }

  closeWindow(){
    ipcRenderer.send('enableShortcuts');
    this.electronService.remote.getCurrentWindow().close();
  }

  checkEmptyValuesConfigForm(){
    var configFormValues = this.itemsConfig.value;
    configFormValues.forEach(element => {
      if(element.label == "" || element.shortcut == "" || (element.file == "" && element.inputFileControl == "")){
        this.electronService.remote.dialog.showErrorBox('Error 202', 'There are many fields empties');
        throw new Error("There are empty values!!");
      }
    });

    return true;
  }

  copyFileToAssets(filePath: string){
    fs.copyFile(filePath, __dirname+ '/assets/screensave_files/' + this.convertPathFileToBasename(filePath), (err) => {
      if (err) throw err;
    });
  }

  fileOnChange(event: any, i: number){
    this.itemsConfig.at(i).get('inputFileControl').patchValue(event.target.files[0].path);
  }

  preubaSave(){
    fs.writeFileSync('dist/assets/data/data_config.json', 'prueba', 'utf-8'); 
  }


  pruebacopy(){
    fs.copyFile('/prueba-file/prueba.txt', '/prueba/prueba.txt', (err) => {
      if (err) throw err;
    });
  }

  pruebaElement(){
    console.log(document.querySelector("input[formControlName='label']"))
  }

}
