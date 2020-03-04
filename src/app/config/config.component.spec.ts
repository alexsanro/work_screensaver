import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as url from 'url';
import { ConfigComponent } from './config.component';
import { ReactiveFormsModule, FormArray } from '@angular/forms';
import { ElectronService } from '../core/services';
const fs = require('fs');
var jsonConfigFile = require('../../assets/data/data_config.json')
const mock = require('mock-fs');
import * as path from 'path';
import { ipcRenderer } from 'electron';

describe('ConfigComponent', () => {

  let component: ConfigComponent;
  let fixture: ComponentFixture<ConfigComponent>;
  let electronService = new ElectronService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigComponent],
      imports: [ReactiveFormsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    mock({
      '/assets/data/data_config.json': '[{"label": "mock","file": "mock.gif","shortcut": "Alt+CommandOrControl+B"}]'
    });

    fixture = TestBed.createComponent(ConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(mock.restore);

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  /*
    
  
    it('prueba guardado', () => {
      mock({
        'dist/assets/data/data_config.txt': 'hola'
      });
      //component.preubaSave();
      var rawdata = fs.readFileSync('dist/assets/data/data_config.txt');
      console.log(rawdata)
      expect(component).toBeTruthy();
    });*/

  /*it('prueba copiad', () => {
    mock({
      '/prueba-file/prueba.txt': 'hola',
      '/prueba': mock.directory({
        mode: 755
      })
    });
    component.pruebacopy();
    var rawdata = fs.readFileSync('/prueba/prueba.txt');
    console.log(rawdata)
    expect(component).toBeTruthy();
  });*/

  /*it('prueba console', () => {
    console.log(document.querySelectorAll("input[formControlName='label']"))
  });*/

  it('Config file with JSON init correct', () => {
    var configFileJsonMock: JSON = JSON.parse('[{"label": "Coffee","file": "coffee_cup.gif","shortcut": "Alt+CommandOrControl+C"}]');
    expect(jsonConfigFile).toEqual(configFileJsonMock);
  })

  it('Config file is empty on INIT', () => {
    fixture.detectChanges();

    var formArraItems = component.itemsConfig.value;
    expect(formArraItems[0].label).toEqual('mock');
    expect(formArraItems[0].shortcut).toEqual('Alt+CommandOrControl+B');
    expect(formArraItems[0].file).toEqual('');
    expect(formArraItems[0].inputFileControl).toEqual('mock.gif');
  })

  it('Add new group of element form array', () => {
    document.getElementById("add-button").click();
    var numItems = component.itemsConfig.value.length;
    expect(numItems).toEqual(2);
  })

  it('Click button close', () => {
    var fakeClose = false;
    spyOn(electronService.remote.getCurrentWindow(), 'close').and.callFake(() => {
      fakeClose = true;
    })

    var fakeIpc = null;
    spyOn(ipcRenderer, 'send').and.callFake((e) => {
      fakeIpc = e;
    })

    document.getElementById("close-button").click();

    expect(fakeClose).toBeTruthy();
    expect(fakeIpc).toEqual('enableShortcuts');
  })

  it('Throw ERROR when save empty fields', () => {
    spyOn(electronService.remote.dialog, 'showErrorBox').and.callFake(function (title, content) {
      expect(title).toEqual("Error 202");
      expect(content).toEqual("There are many fields empties");
    })

    expect(spyOn(component, 'checkEmptyValuesConfigForm').and.throwError).toThrowError()

    component.addNewGroupFields();

    document.getElementById("save-button").click();

  })

  it('Save correctly', () => {
    
    spyOn(ipcRenderer, 'send').and.callFake(function(name){
      expect(name).toEqual("refreshMenuIcon");
    })

    //console.log(component.itemsConfig.value)

    console.log("ddd")
    //document.getElementById("save-button").click();
    //console.log(component.itemsConfig.value)
  })

});

describe('ConfigComponent Empty mock file', () => {

  let component: ConfigComponent;
  let fixture: ComponentFixture<ConfigComponent>;
  let electronService = new ElectronService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigComponent],
      imports: [ReactiveFormsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    mock({
      '/assets/data/data_config.json': '[{}]'
    });

    fixture = TestBed.createComponent(ConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(mock.restore);

  it('Config file is empty on INIT', () => {
    var formArraItems = component.itemsConfig.value;
    expect(formArraItems[0].label).toEqual('');
    expect(formArraItems[0].shortcut).toEqual('');
    expect(formArraItems[0].file).toEqual('');
    expect(formArraItems[0].inputFileControl).toEqual('');
  })

  it('Throw ERROR when save empty fields', () => {

    spyOn(electronService.remote.dialog, 'showErrorBox').and.callFake(function (title, content) {
      expect(title).toEqual("Error 202");
      expect(content).toEqual("There are many fields empties");
    })

    expect(spyOn(component, 'checkEmptyValuesConfigForm').and.throwError).toThrowError()

    document.getElementById("save-button").click();
  })
});