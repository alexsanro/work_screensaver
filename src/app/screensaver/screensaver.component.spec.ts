import { async, ComponentFixture, TestBed, inject, tick, fakeAsync } from '@angular/core/testing';
import { ScreensaverComponent } from './screensaver.component';
import { ActivatedRoute } from '@angular/router';
import { ElectronService } from '../core/services';
import * as path from 'path';
import * as url from 'url';
import { ipcRenderer } from 'electron';

describe('ScreensaverComponent', () => {
  let component: ScreensaverComponent;
  let fixture: ComponentFixture<ScreensaverComponent>;
  let mockActivatedRoute: Object = {
    snapshot: {
      paramMap: {
        get: () => 'coffee_cup.gif'
      }
    }
  }
  let windowSaver = [];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScreensaverComponent],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreensaverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  //MAIN.JS MOCKUP NEW WINDOW
  beforeEach(() => {
    var electronService = new ElectronService();
    var displays = electronService.remote.screen.getAllDisplays();
    console.log("Displays = " + displays.length)
    displays.forEach((value, key) => {
      windowSaver[key] = new electronService.remote.BrowserWindow({})

      windowSaver[key].loadURL(url.format({
        pathname: path.join(__dirname, 'dist/index.html'),
        protocol: 'file:',
        slashes: true,
        hash: '/screensaver/coffee_cup.gif'
      }));
    })
  })

  afterEach(() => {
    windowSaver = [];
  })

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/


  it('Close windows with keydown', function () {
    var arrayWindows = windowSaver;
    console.log("KEYDOWN: " + new ElectronService().remote.BrowserWindow.getAllWindows().length)
    spyOn(ipcRenderer, 'send').and.callFake(function () {
      arrayWindows.forEach((element, key) => {
        arrayWindows.splice(key, 1);
        element.destroy();
      });
    });

    document.dispatchEvent(new Event('keydown'));
    expect(arrayWindows.length).toEqual(0);
  });

  it('Close windows with mousedown', function () {
    console.log("MOUSEDOWN: " + new ElectronService().remote.BrowserWindow.getAllWindows().length)
    var arrayWindows = windowSaver;
    spyOn(ipcRenderer, 'send').and.callFake(function () {
      arrayWindows.forEach((element, key) => {
        arrayWindows.splice(key, 1);
        element.destroy();
      });
    });
    document.dispatchEvent(new Event('mousedown'));
    
    expect(arrayWindows.length).toEqual(0);
  });

  it('Close windows with mousemove', (done) => {
    console.log("MOUSEMOVE: " + new ElectronService().remote.BrowserWindow.getAllWindows().length)
    var arrayWindows = windowSaver;
    spyOn(ipcRenderer, 'send').and.callFake(function () {
      arrayWindows.forEach((element, key) => {
        arrayWindows.splice(key, 1);
        element.destroy();
      });
    });

    setTimeout(() => {
      document.dispatchEvent(new MouseEvent("mousemove", <MouseEventInit>{ movementX: 10, movementY: 10 }));
      expect(arrayWindows.length).toEqual(0)
      done();
    }, 2100);
  });

  /*it('should be created', inject([SomeService], (service: SomeService) => {
    expect(service).toBeTruthy();
  }));*/

});
