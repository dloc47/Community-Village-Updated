import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  inject,
  Input,
  Output,
} from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { paginatedEndpoints } from '../../utils/globalEnums.enum';
import { getDistrictClass } from '../../utils/utils';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';
import { register } from 'swiper/element/bundle';
import {
  CalendarDays,
  ChevronRight,
  LucideAngularModule,
  MapPin,
  Milestone,
  Award,
} from 'lucide-angular';

// Register Swiper custom elements
register();

@Component({
  selector: 'app-events-carousel',
  templateUrl: './events-carousel.component.html',
  styleUrls: ['./events-carousel.component.css'],
  imports: [CommonModule, RouterModule, LucideAngularModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EventsCarouselComponent implements OnInit, OnChanges {
  @Input() committeeId: number = 0;
  @Input() districtId: number = 0;
  @Input() type: 'nearby' | 'related' | 'random' = 'random';
  @Output() totalResults = new EventEmitter<number>();

  public getDistrictClass = getDistrictClass;
  private apiService = inject(ApiService);
  notInclude: any; // allow undefined

  paginatedEvent: any[] = [];
  icons = {
    EventIcon: CalendarDays,
    DistrictIcon: Milestone,
    LocationIcon: MapPin,
    ArrowLeftIcon: ChevronRight,
    AwardIcon: Award,
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      this.notInclude = idParam ? Number(idParam) : null;
    });
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadData();
  }

  private loadData(): void {
    switch (this.type) {
      case 'random':
        this.getEventsRandom();
        break;
      case 'related':
        if (this.committeeId) {
          this.getEventsRelated(this.committeeId);
        }
        break;
      case 'nearby':
        if (this.districtId) {
          this.getEventsNearby(this.districtId);
        }
        break;
    }
  }

  getEventsRandom(): void {
    this.apiService
      .getPaginatedData(paginatedEndpoints.events, 1, 5)
      .subscribe({
        next: (data: any) => {
          if (
            data &&
            data.data &&
            Array.isArray(data.data) &&
            data.data.length > 0
          ) {
            this.paginatedEvent = data.data;
            this.totalResults.emit(this.paginatedEvent.length);
          }
        },
        error: (error: any) => {
          console.error('Error fetching Events:', error);
          this.paginatedEvent = [];
        },
        complete: () => {
          console.log('Event fetch completed.');
        },
      });
  }

  getEventsRelated(committeeId: number): void {
    this.apiService
      .getData(paginatedEndpoints.related, `committeeId=${committeeId}`)
      .subscribe({
        next: (data: any) => {
          if (data && data.data) {
            const events = data.data.events || [];
            this.paginatedEvent =
              this.notInclude != null
                ? events.filter(
                    (event: any) => event.eventId !== this.notInclude
                  )
                : events;
            this.totalResults.emit(this.paginatedEvent.length);
          }
        },
        error: (error: any) => {
          console.error('Error fetching related events:', error);
          this.paginatedEvent = [];
        },
        complete: () => {
          console.log('Related events fetch completed.');
        },
      });
  }

  getEventsNearby(districtId: any): void {
    this.apiService
      .getData(paginatedEndpoints.nearby, `districtId=${districtId}`)
      .subscribe({
        next: (data: any) => {
          if (data && data.data) {
            this.paginatedEvent = data.data.events;
            this.totalResults.emit(this.paginatedEvent.length);
          }
        },
        error: (error: any) => {
          console.error('Error fetching nearby events:', error);
          this.paginatedEvent = [];
        },
        complete: () => {
          console.log('Nearby events fetch completed.');
        },
      });
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
