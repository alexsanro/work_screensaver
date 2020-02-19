import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

  keysDown: string = null;
  
  constructor() { }

  ngOnInit() {
  }

  onKeydown(event: any){
    console.log(event)
    event.preventDefault();
  }
}
