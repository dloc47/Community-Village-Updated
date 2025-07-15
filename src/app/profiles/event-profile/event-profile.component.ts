import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getByIDEndpoints } from '../../utils/globalEnums.enum';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  MapPin,
  User,
  Award,
  Phone,
  Tag,
  Check,
  Layers,
  Users,
} from 'lucide-angular';
import { handleImageError, getDistrictClass } from '../../utils/utils';
import { EventsCarouselComponent } from '../../carousels/events-carousel/events-carousel.component';

@Component({
  selector: 'app-event-profile',
  templateUrl: './event-profile.component.html',
  styleUrls: ['./event-profile.component.css'],
  imports: [CommonModule, LucideAngularModule, EventsCarouselComponent],
})
export class EventProfileComponent implements OnInit {
  loading: boolean = false;
  noDataFound: boolean = false;
  eventInfo: any = [];
  public handleImageError = handleImageError;
  public getDistrictClasses = getDistrictClass;
  relatedEvents: number = 0;

  icons = {
    MapPin: MapPin,
    User: User,
    Award: Award,
    Phone: Phone,
    Tag: Tag,
    Check: Check,
    Layers: Layers,
    Users: Users,
  };

  private apiService = inject(ApiService);

  constructor(private router: ActivatedRoute) {}

  ngOnInit() {
    this.getFirstSegment();
  }

  getFirstSegment(): boolean {
    let segmentFound = false;
    this.router.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loadEventData(id);
        segmentFound = true;
      } else {
        console.log('No valid ID found in route.');
      }
    });
    return segmentFound;
  }

  loadEventData(id: string): void {
    this.loading = true;
    this.apiService.getDataById<any>(getByIDEndpoints.events, id).subscribe({
      next: (data: any) => {
        console.log(data);

        if (data) {
          this.eventInfo = data;
        } else {
          this.handleNoDataFound();
        }
      },
      error: (error: any) => {
        console.error('Error fetching data:', error);
        this.handleNoDataFound();
      },
      complete: () => {
        this.loading = false;
        console.log('Data fetch completed:', this.eventInfo);
      },
    });
  }

  handleNoDataFound() {
    this.noDataFound = true;
    this.loading = false;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
