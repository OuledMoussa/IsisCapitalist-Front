import { Component } from '@angular/core';
import { RestserviceService } from './restservice.service';
import { World, Product, Pallier } from './world';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  world: World = new World(); 
  server: string;
  qtmulti: string = "Buy X1";
  money: number;
  etat: number = 0;


  constructor(private service : RestserviceService) {
    this.server = service.getServer();
    service.getWorld().then(world => { this.world = world; });
  }

  onProductionDone(p: Product) {
    this.world.score += p.revenu;
    this.world.money += p.revenu;
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

}
