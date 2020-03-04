import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as url from 'url';
import { ConfigComponent } from './config.component';
import { ReactiveFormsModule, FormArray } from '@angular/forms';
import { ElectronService } from '../core/services';
const fs = require('fs');
var jsonConfigFile = require('../../assets/data/data_config.json')
const mock = require('mock-fs');
import * as path from 'path';

describe('ConfigComponent', () => {

  mock({
    '/assets/data/data_config.json': '[{}]'
  });

  let component: ConfigComponent;
  let fixture: ComponentFixture<ConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigComponent ],
      imports: [ReactiveFormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    console.log(json);
    console.log(__dirname)
    expect(component).toBeTruthy();
  });

  

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
    
    mock({
      '/assets/data/data_config.json': '[{}]'
    });

    fixture.detectChanges();
    var formArraItems = component.itemsConfig.value;
    expect(formArraItems[0].label).toEqual(null);
    expect(formArraItems[0].shortcut).toEqual(null);
    expect(formArraItems[0].file).toEqual('');
    expect(formArraItems[0].inputFileControl).toEqual(null);
  })
  
  it('Config file is empty on INIT', () => {
    mock({
      '/assets/data/data_config.json': '[{}]'
    });

    document.getElementById("add-button").click();
    var numItems = component.itemsConfig.value.length;
    expect(numItems).toEqual(2);
  })

  it('Config file is empty on INIT 2', () => {
    mock({
      '/assets/data/data_config.json': '[{}]'
    });
    
    document.getElementById("close-button").click()
    expect(component.closeWindow()).toHaveBeenCalled();
    

    console.log("hola")
    //console.log(document.getElementById("close-button"));


  })

});