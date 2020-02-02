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
  prueba = null;
  constructor(private route?: ActivatedRoute) {

  }

  ngOnInit() {
    console.log("INIT")
    this.urlFile = this.route.snapshot.paramMap.get("file");
    this.closeWindowEvents();
  }

  closeWindowEvents() {
    console.log("LISTENER")
    document.addEventListener('keydown', () => {
      console.log("KEYDONW")
      alert("ddddd");
      ipcRenderer.send('sendCloseAllWindows');
    });

    document.addEventListener('mousedown', () => {
      ipcRenderer.send('sendCloseAllWindows');
    });

    document.addEventListener("click", () =>{
      this.prueba = "hola"
      alert("ddddddadfafd click");
    })

    setTimeout(() => {
      var treshold = 5;
      document.addEventListener('mousemove', (e) => {
        if (treshold * treshold < e.movementX * e.movementX
          + e.movementY * e.movementY) {
          ipcRenderer.send('sendCloseAllWindows');
        }
      });
    }, 2000);
  }

}
