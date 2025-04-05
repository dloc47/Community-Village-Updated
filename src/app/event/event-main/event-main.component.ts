import { Component, OnInit } from '@angular/core';
import { EventsCarouselComponent } from '../../village-profile/events-carousel/events-carousel.component';
import { EventProfileComponent } from '../event-profile/event-profile.component';

@Component({
  selector: 'app-event-main',
  templateUrl: './event-main.component.html',
  styleUrls: ['./event-main.component.css'],
  imports:[EventsCarouselComponent,EventProfileComponent]
})
export class EventMainComponent implements OnInit {

  constructor() { }

  ngOnInit() {
      // Smooth scroll to top
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
  }

}
