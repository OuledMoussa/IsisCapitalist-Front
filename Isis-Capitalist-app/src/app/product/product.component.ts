import { Component, OnInit } from '@angular/core';
import { Product, World } from '../world';
import { Input } from '@angular/core';
import { RestserviceService } from '../restservice.service';
import { ViewChild } from '@angular/core';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';


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
  _qtmulti:string;

  @ViewChild('bar') progressBarItem;

  @Input()
  set prod(value: Product) {
    this.product = value;
  }

  @Input()
  set qtmulti(value: string) {
    this._qtmulti = value;
    if (this._qtmulti && this.product)
      this.calcMaxCanBuy();
  }

  @Output() 
  notifyProduction: EventEmitter<Product> = new EventEmitter<Product>();
  
  
  constructor(private service : RestserviceService) { 
    this.server = service.getServer();
  }

  ngOnInit() {
    this.progressbar = new ProgressBar.Line(this.progressBarItem.nativeElement, 
      { strokeWidth: 50, color: 'black' });
    setInterval(() => { this.calcScore(); }, 100);
  }

  calcScore(){
    if (this.product.timeleft!=0){
      this.product.timeleft -= Date.now()-this.lastupdate ;
      this.lastupdate=Date.now();
      console.log(this.product.timeleft);
      if (this.product.timeleft <= 0) {
        this.progressbar.set(0);
        this.notifyProduction.emit(this.product);
        this.product.timeleft=0;
      }
    }
  }

  startFabrication(){
    if (this.product.quantite!=0) {
      this.product.timeleft=this.product.vitesse;
      console.log(this.product.timeleft);
      this.progressbar.animate(1, { duration: this.product.vitesse });
      this.lastupdate=Date.now();
    }
    //alert(this.product.vitesse);
    
  }


  
}
