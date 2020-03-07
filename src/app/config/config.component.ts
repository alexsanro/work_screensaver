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

    if (this.checkEmptyValuesConfigForm()) {

      var configFormValues = this.itemsConfig.getRawValue();
      
      Object.entries(configFormValues).forEach(([key, element]) => {
        if (fs.existsSync(configFormValues[key].inputFileControl) && fs.lstatSync(configFormValues[key].inputFileControl).isFile()) {
          configFormValues[key].file = path.basename(element.inputFileControl);
          this.copyFileToAssets(element.inputFileControl);
        } else {
          configFormValues[key].file = element.file;
        }
        delete configFormValues[key].inputFileControl;
      });

      fs.writeFileSync(path.join(__dirname, '/assets/data/data_config.json'), JSON.stringify(configFormValues), 'utf-8');
      ipcRenderer.send('refreshMenuIcon');
    }

  }

  convertPathFileToBasename(file): string {
    return path.basename(file);
  }

  get itemsConfig(): FormArray {
    return this.configForm.get('itemsConfig') as FormArray;
  }

  removeFields(position: any) {
    this.itemsConfig.removeAt(position)
  }

  minimizeWindow() {
    this.electronService.remote.getCurrentWindow().minimize();
  }

  closeWindow() {
    ipcRenderer.send('enableShortcuts');
    this.electronService.remote.getCurrentWindow().close();
  }

  checkEmptyValuesConfigForm() {
    var configFormValues = this.itemsConfig.value;

    try {
      configFormValues.forEach(element => {
        if (element.label == "" || element.shortcut == "" || (element.file == "" && element.inputFileControl == "")) {
          throw new Error();
        }
      });
    } catch (error) {
      this.electronService.remote.dialog.showErrorBox('Error 202', "There are empty values!!");
      return false;
    }

    return true;
  }

  copyFileToAssets(filePath: string) {
    try{
      fs.copyFileSync(filePath, path.join(__dirname,'/assets/screensave_files/' + this.convertPathFileToBasename(filePath)));
    }catch(e){
      this.electronService.remote.dialog.showErrorBox('Error', e.message)
    }
  }

  fileOnChange(event: any, i: number) {
    this.itemsConfig.at(i).get('inputFileControl').patchValue(event.target.files[0].path);
  }

}
