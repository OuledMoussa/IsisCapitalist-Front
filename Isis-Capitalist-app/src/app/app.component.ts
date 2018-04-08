import { Component, EventEmitter, Output } from '@angular/core';
import { RestserviceService } from './restservice.service';
import { World, Product, Pallier } from './world';
import { ToasterModule, ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ToasterModule]
})

export class AppComponent {
  world: World = new World(); 
  server: string; 
  qtmulti: string = "Buy X1";
  etat: number = 0;
  manager: Pallier;
  toasterService: ToasterService;
  manAv: boolean = false;


  constructor(private service : RestserviceService, toasterService: ToasterService){
    this.server = service.getServer();
    this.toasterService = toasterService;
    service.getWorld().then(world => { this.world = world; });
  }

  ngOnInit() {
    setInterval(() => { this.managerAvailable();
    }, 100);
  }

  onProductionDone(p: Product) {
    this.world.score += p.revenu;
    this.world.money += p.revenu;
  }

  onBuyDone(n: Number) {
    console.log(n);
    this.world.money -= n.valueOf();
  }
  

  choseQtt() {
    this.etat+=1;
    if (this.etat>3) this.etat=0;
    switch(this.etat) {
      case 0:
        this.qtmulti = "Buy X1";
        break;
      case 1:
        this.qtmulti = "Buy X10";
        break;
      case 2:
        this.qtmulti = "Buy X100";
        break;
      case 3:
        this.qtmulti = "Buy MAX";
        break;
    }
  }
  
  managerAvailable(): boolean {
    this.world.managers.pallier.forEach(element => {
      if(element.seuil < this.world.money && element.unlocked == false) {
        this.manAv = true;
      }
    });
    return this.manAv;
  }

  hireManager(m: Pallier){
    console.log(m.seuil);
    //m.seuil
    
    //console.log(this.manager.seuil);
    
    if (this.world.money <= m.seuil){
     this.toasterService.pop('error', 'Deaths insufisantes ! ', m.name);
    }else {
     this.toasterService.pop('success', 'Manager hired ! ', m.name);
     this.world.money -= m.seuil;
     m.unlocked=true;
     this.manAv = false;
    }
    //alert(this.manager.seuil);
     /*if(this.world.money<=){ // vérifier qu'il y a assez d'argent pour acheter le manager
       
     }*/
     //enlever le prix du manager à this.world.money
     
     //cacher le manager de la liste 
     // passer managers.unlocked = true
   }
}
