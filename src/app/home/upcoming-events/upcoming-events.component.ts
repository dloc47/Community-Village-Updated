import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { paginatedEndpoints } from '../../globalEnums.enum';
import { RouterLink, Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { CalendarDays, LucideAngularModule, MapPin,Users,} from 'lucide-angular';

// Register Swiper custom elements
register();

@Component({
  selector: 'app-upcoming-events',
  templateUrl: './upcoming-events.component.html',
  styleUrls: ['./upcoming-events.component.css'],
  imports: [CommonModule, RouterLink,LucideAngularModule],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UpcomingEventsComponent implements OnInit, AfterViewInit {
  private apiService = inject(ApiService);
  private router = inject(Router);
  
  events: any[] = [];
  eventGroups: any[][] = [];
  icons={
    LocateIcon:MapPin,
    UserIcon: Users,
    EventIcon: CalendarDays,
  }
  ngOnInit() {
    this.getEvents();
  }

  ngAfterViewInit() {
    // Initialize Swiper after view initialization
    setTimeout(() => {
      const swiperContainer = document.querySelector('swiper-container');
      if (swiperContainer) {
        const swiper = (swiperContainer as any).swiper;
        if (swiper) {
          swiper.update();
          swiper.updateSlides();
        }
      }
    }, 0);
  }

  handleEventClick(eventId: string) {
    this.router.navigate(['/event', eventId]);
  }

  getEventGroups(): any[][] {
    return this.eventGroups;
  }

  getEvents(): void {
    this.apiService.getPaginatedData(paginatedEndpoints.events, 1, 15).subscribe({
      next: (data: any) => {
        this.events = data.data;
        // Group events into sets of 5
        this.eventGroups = [];
        for (let i = 0; i < this.events.length; i += 4) {
          this.eventGroups.push(this.events.slice(i, i + 4));
        }
        
        console.log(this.eventGroups);

      },
      error: (error: any) => {
        console.error('Error fetching Events:', error);
        this.events = [];
        this.eventGroups = [];
      }
    });
  }
}