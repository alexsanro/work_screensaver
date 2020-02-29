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
    this.getConfigFile().forEach(element => {
      this.itemsConfig.push(this.builder.group({
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

  onkeyUpShortcut(event: any, i: number) {
    if (this.shortCutKeyDown != null) {
      //var itemsConfig = (this.configForm.get('itemsConfig') as FormArray).at(i) as FormGroup;
      //itemsConfig.get('shortcut').patchValue("Alt+CommandOrControl+" + this.shortCutKeyDown);
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
      if(element.file == "" || element.file == undefined){
        configFormValues[key].file = element.inputFileControl;
        delete configFormValues[key].inputFileControl;
      }else{
        this.copyFileToAssets(key);
        configFormValues[key].file = path.basename(element.file);
      }
    });

    console.log(configFormValues)
  }

  convertPathFileToBasename(file): string{
    return path.basename(file);
  }

  get itemsConfig(): FormArray{
    return this.configForm.get('itemsConfig') as FormArray;
  }

  removeFields(position: any){
    this.itemsConfig.removeAt(position)
  }

  minimizeWindow(){
    this.electronService.remote.BrowserWindow.getFocusedWindow().minimize();
  }

  closeWindow(){
    this.electronService.remote.BrowserWindow.getFocusedWindow().close();
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

  copyFileToAssets(inputPosition: any){
    var file: any = document.querySelectorAll("input[type=file]")
    
    fs.copyFile(file[inputPosition].files[0].path, 'destination.txt', (err) => {
      if (err) throw err;
      console.log('source.txt was copied to destination.txt');
    });
  }

}
