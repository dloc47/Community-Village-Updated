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
  // Initialize the homestay property with sample data
  homestay: Homestay = {
    amenities: [
      'WiFi',
      'Parking',
      'Air Conditioning',
      'Kitchen',
      'Laundry',
      'TV'
    ]
  };

  constructor() { }

  ngOnInit() {
  }
}
