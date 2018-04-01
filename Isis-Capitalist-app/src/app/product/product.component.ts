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
  _money: number; // n'est pas connu ici 
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
    console.log(this._money); // est undefined car pas connu
    switch(this._qtmulti) {
      case "Buy X1":
        this.prix=this.product.cout;
        this.nbAchat=1;
        break;
      case "Buy X10":
        this.prix=this.product.cout*((1-Math.pow(this.product.croissance, 11) )/ (1-this.product.croissance));
        this.nbAchat=10;
        break;
      case "Buy X100":
        this.prix=this.product.cout*((1-Math.pow(this.product.croissance, 101) )/ (1-this.product.croissance));
        this.nbAchat=100;
        break;
      case "Buy MAX":
        // ne marche pas sûrement à cause de this._money
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
      { strokeWidth: 50, color: 'grey' });
    setInterval(() => { this.calcScore(); this.calcMaxCanBuy();
    }, 100);
  }

  calcScore(){
    if (this.product.timeleft!=0){
      this.product.timeleft -= Date.now()-this.lastupdate ;
      this.lastupdate=Date.now();
      //console.log(this.product.timeleft);
      if (this.product.timeleft <= 0 && this.product.managerUnlocked==false) { // si le manager n'est pas acheté
        this.progressbar.set(0);
        this.notifyProduction.emit(this.product);
        this.product.timeleft=0;
      }
      if (this.product.timeleft <= 0 && this.product.managerUnlocked==true) { // si le manager est activé
        //this.progressbar.set();
        this.notifyProduction.emit(this.product);
        this.product.timeleft=0;
      }
    }
  }

  startFabrication(){
    if (this.product.quantite!=0) {
      this.product.timeleft=this.product.vitesse;
      this.progressbar.animate(1, { duration: this.product.vitesse });
      this.lastupdate=Date.now();
    }
  }

  buyProduct(){
    /*if(this.prix<=this._money){ // vérifier qu'il y a assez d'argent pour acheter le produit
      alert("Vous n'avez pas assez pour acheter ce produit");
    }*/
    //this._money -= this.prix //enlever la somme des produits à this.world.money
    alert("Bravo vous avez acheté "+ this.nbAchat +"death(s)");
    this.product.quantite += this.nbAchat; // augmente le nombre de produits
    /*this.prix = this.prix *this.nbAchat; */ //augmente le revenu d'un click 
  }
  
}
