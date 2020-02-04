import { Component, OnInit } from '@angular/core';
import { ipcRenderer } from 'electron';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-screensaver',
  templateUrl: './screensaver.component.html',
  styleUrls: ['./screensaver.component.scss']
})

export class ScreensaverComponent implements OnInit {

  urlFile = null;
  constructor(private route?: ActivatedRoute) {}

  ngOnInit() {
    this.urlFile = this.route.snapshot.paramMap.get("file");
    this.closeWindowEvents();
  }

  closeWindowEvents() {
    console.log("events")
    document.addEventListener('keydown', () => {
      console.log("keydown")
      ipcRenderer.send('sendCloseAllWindows');
    });

    document.addEventListener('mousedown', () => {
      console.log("mousevent")
      ipcRenderer.send('sendCloseAllWindows');
    });
    
    setTimeout(() => {
      console.log("time")
      var treshold = 5;
      document.addEventListener('mousemove', (e) => {
        if (treshold * treshold < e.movementX * e.movementX
          + e.movementY * e.movementY) {
        console.log("mouse")
          ipcRenderer.send('sendCloseAllWindows');
        }
      });
    }, 2000);
  }

}
