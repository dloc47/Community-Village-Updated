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
import { Router } from '@angular/router';
import { LoaderService } from '../../../services/loader.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-event-profile',
  templateUrl: './event-profile.component.html',
  styleUrls: ['./event-profile.component.css'],
  imports: [CommonModule, LucideAngularModule, EventsCarouselComponent],
})
export class EventProfileComponent implements OnInit {
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
  private loader = inject(LoaderService);
  private routerNav: Router;

  constructor(private router: ActivatedRoute, routerNav: Router) {
    this.routerNav = routerNav;
  }

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
        this.handleNoDataFound();
      }
    });
    return segmentFound;
  }

  loadEventData(id: string): void {
    this.loader.showLoader();
    this.apiService
      .getDataById<any>(getByIDEndpoints.events, id)
      .pipe(
        finalize(() => {
          this.loader.hideLoader();
        })
      )
      .subscribe({
        next: (data: any) => {
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
      });
  }

  handleNoDataFound() {
    this.loader.hideLoader();
    this.routerNav.navigate(['/not-found']);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
