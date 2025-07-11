import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  inject,
  Input,
  Output,
  EventEmitter,
  Signal,
} from '@angular/core';
import {
  getProfileImage,
  getDistrictClass,
  handleImageError,
} from '../../utils/utils';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { paginatedEndpoints } from '../../utils/globalEnums.enum';
import { register } from 'swiper/element/bundle';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { placeholder } from '../../utils/globalEnums.enum';
import {
  LucideAngularModule,
  MapPin,
  Users,
  ChevronRight,
  Tag,
  Binoculars,
  Award,
} from 'lucide-angular';

// Register Swiper custom elements
register();

@Component({
  selector: 'app-activities-carousel',
  templateUrl: './activities-carousel.component.html',
  styleUrls: ['./activities-carousel.component.css'],
  imports: [CommonModule, RouterLink, LucideAngularModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ActivitiesCarouselComponent
  implements OnInit, OnDestroy, OnChanges
{
  @Input() committeeId?: number;
  @Input() districtId?: number;
  @Input() homestayId?: number;
  @Input() type: 'nearby' | 'related' | 'random' = 'random';
  @Output() totalResults = new EventEmitter<number>();
  @Input() notIncludeId?: number;
  public getDistrictClass = getDistrictClass;
  public getProfileImage = getProfileImage;
  public handleImageError = handleImageError;
  placeholder: placeholder = placeholder.image;
  private apiService = inject(ApiService);
  activities: any[] = [];
  icons = {
    ArrowIcon: ChevronRight,
    DistrictIcon: MapPin,
    CommitteeIcon: Users,
    TagIcon: Tag,
    ActivityIcon: Binoculars,
    Award: Award,
  };

  ngOnInit() {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadData();
  }

  private loadData(): void {
    switch (this.type) {
      case 'random':
        this.getActivitiesRandom();
        break;
      case 'related':
        if (this.committeeId || this.homestayId) {
          this.getActivitiesRelated(this.committeeId, this.homestayId);
        }
        break;
      case 'nearby':
        if (this.districtId) {
          this.getActivitiesNearby(this.districtId);
        }
        break;
    }
  }

  getActivitiesRandom(): void {
    this.apiService
      .getPaginatedData(paginatedEndpoints.activities, 1, 5)
      .subscribe({
        next: (data: any) => {
          if (
            data &&
            data.data &&
            Array.isArray(data.data) &&
            data.data.length > 0
          ) {
            this.activities = data.data;
            this.totalResults.emit(this.activities.length);
          }
        },
        error: (error: any) => {
          console.error('Error fetching Activities:', error);
          this.activities = [];
        },
        complete: () => {
          console.log('Activities fetch completed.');
        },
      });
  }

  getActivitiesRelated(committeeId?: number, homestayId?: number): void {
    let param: string;
    if (committeeId != null) {
      param = `committeeId=${committeeId}`;
    } else if (homestayId != null) {
      param = `homestayId=${homestayId}`;
    } else {
      throw new Error('Both committeeId and homestayId are undefined');
    }

    this.apiService.getData(paginatedEndpoints.related, param).subscribe({
      next: (data: any) => {
        if (data && data.data) {
          let activities = data.data.activities;
          if (this.notIncludeId != null) {
            activities = activities.filter(
              (activity: any) => activity.activityId !== this.notIncludeId
            );
          }
          this.activities = activities;
          this.totalResults.emit(this.activities.length);
        }
      },
      error: (error: any) => {
        console.error('Error fetching related activities:', error);
        this.activities = [];
        this.totalResults.emit(0);
      },
      complete: () => {
        console.log('Related activities fetch completed.');
      },
    });
  }

  getActivitiesNearby(districtId: any): void {
    this.apiService
      .getData(paginatedEndpoints.nearby, `districtId=${districtId}`)
      .subscribe({
        next: (data: any) => {
          if (data && data.data) {
            this.activities = data.data.activities;
            this.totalResults.emit(this.activities.length);
          }
        },
        error: (error: any) => {
          console.error('Error fetching nearby activities:', error);
          this.activities = [];
        },
        complete: () => {
          console.log('Nearby activities fetch completed.');
        },
      });
  }

  ngOnDestroy() {
    // No need to destroy Swiper instance as it's handled automatically
  }
}
