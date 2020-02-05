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

  afterEach(() => {
    windowSaver = [];
  })

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/


  it('Close windows with keydown', function () {
    var spy = false;
    spyOn(ipcRenderer, 'send').and.callFake(function () {
      spy = true;
    });

    document.dispatchEvent(new Event('keydown'));
    expect(spy).toEqual(true);
  });

  it('Close windows with mousedown', function () {
    var spy = false;
    spyOn(ipcRenderer, 'send').and.callFake(function () {
      spy = true;
    });
    document.dispatchEvent(new Event('mousedown'));
    
    expect(spy).toEqual(true);
  });

  it('Close windows with mousemove', (done) => {
    var spy = false;
    spyOn(ipcRenderer, 'send').and.callFake(function () {
      spy = true;
    });

    setTimeout(() => {
      document.dispatchEvent(new MouseEvent("mousemove", <MouseEventInit>{ movementX: 10, movementY: 10 }));
      expect(spy).toEqual(true)
      done();
    }, 2100);
  });

  /*it('should be created', inject([SomeService], (service: SomeService) => {
    expect(service).toBeTruthy();
  }));*/

});
