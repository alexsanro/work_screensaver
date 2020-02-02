import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { ScreensaverComponent } from './screensaver.component';
import { ActivatedRoute } from '@angular/router';
import { ElectronService } from '../core/services';
import { BrowserWindow, ipcMain, ipcRenderer } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { By } from '@angular/platform-browser';

class MockUpMain{
  createWindows(){

  }
}


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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScreensaverComponent],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreensaverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*it('browser', () => {
    var preuba = new ElectronService();
    const screen = preuba.remote.screen;
    component.createWindowScreenSaver('gif.gif');
  });*/

  it('Create Multiple Windows Screen', () => {
    var electronService = new ElectronService();
    var displays = electronService.remote.screen.getAllDisplays();

    var windowSaver = [];
    displays.forEach((value, key) => {
      windowSaver[key] = new electronService.remote.BrowserWindow({})

      windowSaver[key].loadURL(url.format({
        pathname: path.join(__dirname, 'dist/index.html'),
        protocol: 'file:',
        slashes: true,
        hash: '/screensaver/coffee_cup.gif'
      }));
    })

    expect(displays.length).toEqual(windowSaver.length); 
  })

  it('Close windows with events DOM',async(() => {
    /*var electronService = new ElectronService();
    var displays = electronService.remote.screen.getAllDisplays();

    var windowSaver = [];
    displays.forEach((value, key) => {
      windowSaver[key] = new electronService.remote.BrowserWindow({})

      windowSaver[key].loadURL(url.format({
        pathname: path.join(__dirname, 'dist/index.html'),
        protocol: 'file:',
        slashes: true,
        hash: '/screensaver/coffee_cup.gif'
      }));
    })*/

    /*var electronService = new ElectronService();
    electronService.remote.ipcMain.on('sendCloseAllWindows', function (event) {
      console.log("ddddd");
    });

    const event = new KeyboardEvent('click', {
      key: 'Enter',
    });
  
    document.querySelector('.container').dispatchEvent(event);
    console.log(document.querySelector(".container"))


*/

    document.addEventListener('click',()=>{
      console.log("JHOLJFKAJDFL")
    })
    document.dispatchEvent(new Event('click'));
    //console.log(document.getElementsByClassName("container"))
    
    /*fixture.detectChanges();
    fixture.debugElement.triggerEventHandler('keydown', { code: 'Escape' });
    fixture.debugElement.triggerEventHandler('keydown', { code: 'KeyA' });
    var html = fixture.debugElement.query(By.all());
    
    html.triggerEventHandler('click', null);
    fixture.detectChanges();
    console.log(component.prueba)*/
    //console.log(html)
    //console.log(fixture.debugElement.query);
  }))

});
