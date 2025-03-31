import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { paginatedEndpoints } from '../../globalEnums.enum';
import { RouterLink, Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';

// Register Swiper custom elements
register();

@Component({
  selector: 'app-upcoming-events',
  templateUrl: './upcoming-events.component.html',
  styleUrls: ['./upcoming-events.component.css'],
  imports: [CommonModule, RouterLink],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UpcomingEventsComponent implements OnInit, AfterViewInit {
  private apiService = inject(ApiService);
  private router = inject(Router);
  
  events: any[] = [];

  ngOnInit() {
    this.getEvents();
  }

  ngAfterViewInit() {
    // Force Swiper to update after view initialization
    setTimeout(() => {
      const swiperContainer = document.querySelector('swiper-container');
      if (swiperContainer) {
        (swiperContainer as any).swiper?.update();
      }
    }, 0);
  }

  handleEventClick(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    const target = event.target as HTMLElement;
    const link = target.closest('a');
    if (link) {
      const href = link.getAttribute('href');
      if (href) {
        this.router.navigate([href]);
      }
    }
  }

  getEventGroups(): any[][] {
    const groups: any[][] = [];
    for (let i = 0; i < this.events.length; i += 5) {
      groups.push(this.events.slice(i, i + 5));
    }
    return groups;
  }

  getEvents(): void {
    this.apiService.getPaginatedData(paginatedEndpoints.events, 1, 15).subscribe({
      next: (data: any) => {
        this.events = data.data;
        console.log(this.events);
      },
      error: (error: any) => {
        console.error('Error fetching Events:', error);
        this.events = [];
      },
      complete: () => {
        console.log('Events fetch completed.');
      }
    });
  }
}