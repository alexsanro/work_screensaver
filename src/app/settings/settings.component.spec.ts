import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as url from 'url';
import { ReactiveFormsModule, FormArray } from '@angular/forms';
import { ElectronService } from '../core/services';
const fs = require('fs');
var jsonSettingsFile = require('../../assets/data/data_config.json')
const mock = require('mock-fs');
import * as path from 'path';
import { ipcRenderer } from 'electron';
import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {

  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let electronService = new ElectronService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      imports: [ReactiveFormsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    mock({
      '/assets/data/data_config.json': '[{"label": "mock","file": "mock.gif","shortcut": "Alt+CommandOrControl+B"}]',
      '/assets/screensave_files': mock.directory({
        mode: 755
      }),
      '/mock/mockito.gif': "Mockito Gif"
    });

    fixture = TestBed.createComponent(ConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(mock.restore);

  it('should create', () => {
    expect(component).toBeTruthy();
  });

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

  it('Throw ERROR when save empty fields click button', () => {
    var titleDialog = null;
    var contentDialgo = null;
    spyOn(electronService.remote.dialog, 'showErrorBox').and.callFake((title, content) => {
      titleDialog = title;
      contentDialgo = content;
    })

    component.addNewGroupFields();
    document.getElementById("save-button").click();

    expect(titleDialog).toEqual("Error 202");
    expect(contentDialgo).toEqual("There are empty values!!");
  })
  

  it('Save configuration and copy files correctly', () => {
    var configFileJsonMock: JSON = JSON.parse('[{"label": "mock","file": "mockito.gif","shortcut": "Alt+CommandOrControl+B"}]');
    var mockitoEvent = {
      'target': {
        'files':
          [{
            'path': '/mock/mockito.gif'
          }]
      }
    }

    component.fileOnChange(mockitoEvent, 0);
    component.saveConfiguration();

    expect(configFileJsonMock).toEqual(component.getConfigFile());

  })

  
  it('Copy failed', () => {

    var throwDialog = false;
    spyOn(fs, 'copyFile').and.throwError('New Error nn Copys');
    spyOn(electronService.remote.dialog, 'showErrorBox').and.callFake((title, content) => {
      throwDialog = true;
    })

    component.copyFileToAssets('/mockito/mockito.gif');

    expect(throwDialog).toBeTruthy();

  })

  it('Save correctly click button', () => {

    var ipcRenderSendMock = null;
    spyOn(ipcRenderer, 'send').and.callFake((name) => {
      ipcRenderSendMock = name;
    })

    document.getElementById("save-button").click();
    expect(ipcRenderSendMock).toEqual("refreshMenuIcon");
  })

  it('Minimize window click button', () => {

    var fakeMinimize = false;
    spyOn(electronService.remote.getCurrentWindow(), 'minimize').and.callFake(() => {
      fakeMinimize = true;
    })
    
    document.getElementById("min-button").click()

    expect(fakeMinimize).toBeTruthy();

  })

  it('Keydown shortcut input value seted', () => {
    var input = document.querySelectorAll("input[formControlName='shortcut']")[0]
    var event = new KeyboardEvent("keydown", {
      "key": "b",
      'ctrlKey': true,
      'altKey': true
    });
    input.dispatchEvent(event);
    expect('b').toEqual(component.shortCutKeyDown)
  })

  it('Keydown shortcut input value seted', () => {
    var input = document.querySelectorAll("input[formControlName='shortcut']")[0]
    var event = new KeyboardEvent("keydown", {
      "key": "b",
      'ctrlKey': false,
      'altKey': false
    });
    input.dispatchEvent(event);
    expect(null).toEqual(component.shortCutKeyDown)
  })

  it('Keyup shortcut input', () => {
    var input = document.querySelectorAll("input[formControlName='shortcut']")[0]
    var event = new KeyboardEvent("keyup");

    component.shortCutKeyDown = "z";
    input.dispatchEvent(event);

    expect('Alt+CommandOrControl+z').toEqual(component.itemsConfig.value[0].shortcut)
  })

  it('Keyup shortcut input', () => {
    var input = document.querySelectorAll("input[formControlName='shortcut']")[0]
    var event = new KeyboardEvent("keyup");

    input.dispatchEvent(event);

    expect('Alt+CommandOrControl+B').toEqual(component.itemsConfig.value[0].shortcut)
  })

  it('Function change input file', () => {
    var mockitoEvent = {
      'target': {
        'files':
          [{
            'path': 'mockito/mockito.gif'
          }]
      }
    }

    component.fileOnChange(mockitoEvent, 0);
    expect('mockito/mockito.gif').toEqual(component.itemsConfig.value[0].inputFileControl)
  })

  it('Basename path', () => {
    var file = component.convertPathFileToBasename('/mock/mock.gif');
    expect('mock.gif').toEqual(file)
  })

  it('Remove field group with click', () => {
    var buttonDelete = fixture.debugElement.nativeElement.querySelector('button');
    buttonDelete.click();
    expect(component.itemsConfig.value.length).toEqual(0)
  })

});

describe('SettingsComponent Empty mock file', () => {

  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let electronService = new ElectronService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      imports: [ReactiveFormsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    mock({
      '/assets/data/data_config.json': '[{}]'
    });

    fixture = TestBed.createComponent(SettingsComponent);
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

  it('Throw ERROR when save empty fields click button', () => {
    var titleDialog = null;
    var contentDialgo = null;
    spyOn(electronService.remote.dialog, 'showErrorBox').and.callFake((title, content) => {
      titleDialog = title;
      contentDialgo = content;
    })

    document.getElementById("save-button").click();

    expect(titleDialog).toEqual("Error 202");
    expect(contentDialgo).toEqual("There are empty values!!");
  })
});