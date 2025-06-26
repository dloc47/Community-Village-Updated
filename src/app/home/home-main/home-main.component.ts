import { Component, OnInit } from '@angular/core';
import { HeroSectionComponent } from '../hero-section/hero-section.component';
import { HomestaysCarouselComponent } from '../../carousels/homestays-carousel/homestays-carousel.component';
import { ProductsCarouselComponent } from '../../carousels/products-carousel/products-carousel.component';
import { UpcomingEventsComponent } from '../upcoming-events/upcoming-events.component';
import { RouterLink, RouterModule } from '@angular/router';
import { ActivitiesCarouselComponent } from '../../carousels/activities-carousel/activities-carousel.component';
import { CommitteeCarouselComponent } from '../../carousels/committee-carousel/committee-carousel.component';

@Component({
  selector: 'app-home-main',
  templateUrl: './home-main.component.html',
  styleUrls: ['./home-main.component.css'],
  imports:[HeroSectionComponent,HomestaysCarouselComponent,ActivitiesCarouselComponent,
    ProductsCarouselComponent,UpcomingEventsComponent,CommitteeCarouselComponent,RouterModule]
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
