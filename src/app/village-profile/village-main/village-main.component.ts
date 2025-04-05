import { Component, OnInit } from '@angular/core';
import { ProfileComponent } from '../profile/profile.component';
import { HomestaysCarouselComponent } from '../../home/homestays-carousel/homestays-carousel.component';
import { ProductsCarouselComponent } from '../../home/products-carousel/products-carousel.component';
import { AdventuresComponent } from '../../home/adventures/adventures.component';
import { EventsCarouselComponent } from '../events-carousel/events-carousel.component';

@Component({
  selector: 'app-village-main',
  templateUrl: './village-main.component.html',
  styleUrls: ['./village-main.component.css'],
  imports:[ProfileComponent,HomestaysCarouselComponent,ProductsCarouselComponent,AdventuresComponent
    ,EventsCarouselComponent
   ]
})
export class VillageMainComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  
    // Smooth scroll to top
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }

}
