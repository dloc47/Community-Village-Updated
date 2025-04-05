import { Component, OnInit } from '@angular/core';
import { HeroSectionComponent } from '../hero-section/hero-section.component';
import { AdventuresComponent } from '../adventures/adventures.component';
import { HomestaysCarouselComponent } from '../homestays-carousel/homestays-carousel.component';
import { ProductsCarouselComponent } from '../products-carousel/products-carousel.component';
import { UpcomingEventsComponent } from '../upcoming-events/upcoming-events.component';
import { VillageCarouselComponent } from '../village-carousel/village-carousel.component';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-main',
  templateUrl: './home-main.component.html',
  styleUrls: ['./home-main.component.css'],
  imports:[HeroSectionComponent,AdventuresComponent,HomestaysCarouselComponent,
    ProductsCarouselComponent,UpcomingEventsComponent,VillageCarouselComponent,RouterModule]
})
export class HomeMainComponent implements OnInit {

  constructor() { }

  ngOnInit() {
        window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

}
