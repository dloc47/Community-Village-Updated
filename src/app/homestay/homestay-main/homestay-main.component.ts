import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomestaysCarouselComponent } from '../../home/homestays-carousel/homestays-carousel.component';
import { HomestayProfileComponent } from '../homestay-profile/homestay-profile.component';

// Define the Homestay interface
interface Homestay {
  amenities: string[];
  // Add other properties as needed
}

@Component({
  selector: 'app-homestay-main',
  templateUrl: './homestay-main.component.html',
  styleUrls: ['./homestay-main.component.css'],
  imports: [CommonModule, HomestaysCarouselComponent, HomestayProfileComponent]
})
export class HomestayMainComponent implements OnInit {


  constructor() { }

  ngOnInit() {
       
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
   
  }
}
