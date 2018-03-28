import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { Product, World } from '../world';
import { RestserviceService } from '../restservice.service';
import { AppComponent } from '../app.component';


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
  _qtmulti: string;
  _money: number;
  _etat: number;
  nbAchat: number = 1;
  prix: number;
  

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

  calcMaxCanBuy() {
    console.log(this._etat);
    switch(this._qtmulti) {
      case "X1":
        this.prix=this.product.cout;
        this.nbAchat=1;
        break;
      case "X10":
        this.prix=this.product.cout*((1-Math.pow(this.product.croissance, 11) )/ (1-this.product.croissance));
        this.nbAchat=10;
        break;
      case "X100":
        this.prix=this.product.cout*((1-Math.pow(this.product.croissance, 101) )/ (1-this.product.croissance));
        this.nbAchat=100;
        break;
      case "MAX":
        this.nbAchat = Math.log(1-(this._money/this.product.cout)*(1-this.product.croissance))/Math.log(this.product.croissance);
        this.prix=this.product.cout*((1-Math.pow(this.product.croissance, this.nbAchat+1) )/ (1-this.product.croissance));
        break;
    }
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
    this.calcMaxCanBuy();
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
  }


  
}
