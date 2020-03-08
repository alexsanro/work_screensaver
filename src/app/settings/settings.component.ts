import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, FormControl } from '@angular/forms';
import * as path from 'path';
import { ElectronService } from '../core/services';
import { throwError } from 'rxjs';
import { ipcRenderer } from 'electron';
const fs = require('fs');

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],

  encapsulation: ViewEncapsulation.None,
})
export class SettingsComponent implements OnInit {

  shortCutKeyDown: string = null;

  settingsForm: FormGroup = this.builder.group({
    itemsSettings: this.builder.array([])
  })

  constructor(protected builder: FormBuilder, protected electronService: ElectronService) { }

  ngOnInit() {

    this.getSettingsFile().forEach(element => {
      this.itemsSettings.push(this.builder.group({
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
      this.itemsSettings.at(i).get('shortcut').patchValue("Alt+CommandOrControl+" + this.shortCutKeyDown);
      this.shortCutKeyDown = null;
    }
  }

  getSettingsFile() {
    var rawdata = fs.readFileSync(path.join(__dirname, '/assets/data/data_settings.json'));
    return JSON.parse(rawdata);
  }

  addNewGroupFields() {
    this.itemsSettings.push(this.builder.group({
      label: '',
      shortcut: '',
      file: '',
      inputFileControl: ''
    }));
  }

  saveSettings() {

    if (this.checkEmptyValuesSettingsForm()) {

      var settingsFormValues = this.itemsSettings.getRawValue();
      
      Object.entries(settingsFormValues).forEach(([key, element]) => {
        if (fs.existsSync(settingsFormValues[key].inputFileControl) && fs.lstatSync(settingsFormValues[key].inputFileControl).isFile()) {
          settingsFormValues[key].file = path.basename(element.inputFileControl);
          this.copyFileToAssets(element.inputFileControl);
        } else {
          settingsFormValues[key].file = element.file;
        }
        delete settingsFormValues[key].inputFileControl;
      });

      fs.writeFileSync(path.join(__dirname, '/assets/data/data_settings.json'), JSON.stringify(settingsFormValues), 'utf-8');
      ipcRenderer.send('refreshMenuIcon');
    }

  }

  convertPathFileToBasename(file): string {
    return path.basename(file);
  }

  get itemsSettings(): FormArray {
    return this.settingsForm.get('itemsSettings') as FormArray;
  }

  removeFields(position: any) {
    this.itemsSettings.removeAt(position)
  }

  minimizeWindow() {
    this.electronService.remote.getCurrentWindow().minimize();
  }

  closeWindow() {
    ipcRenderer.send('enableShortcuts');
    this.electronService.remote.getCurrentWindow().close();
  }

  checkEmptyValuesSettingsForm() {
    var settingsFormValues = this.itemsSettings.value;

    try {
      settingsFormValues.forEach(element => {
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
    this.itemsSettings.at(i).get('inputFileControl').patchValue(event.target.files[0].path);
  }

}
