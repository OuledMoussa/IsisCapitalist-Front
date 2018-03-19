import { Component, OnInit } from '@angular/core';
import { Product, World } from '../world';
import { Input } from '@angular/core';
import { RestserviceService } from '../restservice.service';
import { ViewChild } from '@angular/core';
import { setInterval } from 'timers';

declare var require; 
const ProgressBar = require("progressbar.js");

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit {
  product: Product;
  server: string;
  progressbar: any;
  lastupdate: any;
  world: World;

  @ViewChild('bar') progressBarItem;

  @Input()
  set prod(value: Product) {
    this.product = value;
  }

  constructor(private service : RestserviceService) { 
    this.server = service.getServer();
  }

  ngOnInit() {
    this.progressbar = new ProgressBar.Line(this.progressBarItem.nativeElement, 
      { strokeWidth: 50, color: '#00ff00' });
    //this.progressbar.set(0.5);

    setInterval(() => { this.calcScore(); }, 100); 
    //setInterval(() => { alert('a'); }, 1000);
  }

  calcScore(){
    if (this.product.timeleft!=0){
      this.product.timeleft = Date.now()-this.lastupdate;
      //console.log(Date.now());
      if (this.product.timeleft <= 0) {
        this.world.score += this.product.revenu;
        this.progressbar.set(0);
        this.product.timeleft=0;
      }
    }
  }

  startFabrication(){
    if (this.product.quantite!=0) {
      this.product.timeleft=this.product.vitesse;
      this.progressbar.animate(1, { duration: this.product.vitesse });
      this.lastupdate=Date.now;
    }
    //alert(this.product.vitesse);
    
  }


  
}
