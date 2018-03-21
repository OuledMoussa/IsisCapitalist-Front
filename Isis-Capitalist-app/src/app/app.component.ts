import { Component } from '@angular/core';
import { RestserviceService } from './restservice.service';
import { World, Product, Pallier } from './world';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  world: World = new World(); 
  server: string;
  qtmulti: string;


  constructor(private service : RestserviceService) {
    this.server = service.getServer();
    service.getWorld().then(world => { this.world = world; });
  }

  onProductionDone(p: Product) {
    this.world.score += p.revenu;
    this.world.money += p.revenu;
  }
}
