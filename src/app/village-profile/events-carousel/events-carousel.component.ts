import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule, RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { paginatedEndpoints } from '../../globalEnums.enum';
import { getDynamicClass, getDistrictClass } from '../../utils/utils';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';

// Register Swiper custom elements
register();

@Component({
  selector: 'app-events-carousel',
  templateUrl: './events-carousel.component.html',
  styleUrls: ['./events-carousel.component.css'],
  imports: [CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EventsCarouselComponent implements OnInit {
  private apiService = inject(ApiService);
  paginatedEvent: any[] = [];

  ngOnInit() {
    this.getEvents();
  }

  getClass(input: number) {
    return getDynamicClass(input);
  }

  getDistrictClass(region: string): string {
    return getDistrictClass(region);
  }

  getEvents(): void {
    this.apiService.getPaginatedData(paginatedEndpoints.events, 1, 5).subscribe({
      next: (data: any) => {
        if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
          this.paginatedEvent = data.data;
        }
      },
      error: (error: any) => {
        console.error('Error fetching Events:', error);
        this.paginatedEvent = [];
      },
      complete: () => {
        console.log('Event fetch completed.');
      }
    });
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
