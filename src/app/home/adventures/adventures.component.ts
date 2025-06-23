import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges, inject, Input } from '@angular/core';
import { getProfileImage, getDistrictClass,handleImageError } from '../../utils/utils';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { paginatedEndpoints } from '../../globalEnums.enum';
import { register } from 'swiper/element/bundle';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { placeholder } from '../../globalEnums.enum';
import { LucideAngularModule, MapPin, Users, ChevronRight, Tag, Binoculars } from 'lucide-angular';

// Register Swiper custom elements
register();

@Component({
  selector: 'app-adventures',
  templateUrl: './adventures.component.html',
  styleUrls: ['./adventures.component.css'],
  imports: [CommonModule, RouterLink, LucideAngularModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdventuresComponent implements OnInit, OnDestroy, OnChanges {
  @Input() committeeId: number = 0;
  @Input() districtId: number = 0;
  @Input() type: 'nearby' | 'related' | 'random' = 'random';
  public getDistrictClass = getDistrictClass;
  public getProfileImage = getProfileImage;
  public handleImageError =handleImageError;
  placeholder: placeholder = placeholder.image;
  private apiService = inject(ApiService);
  activities: any[] = [];
  icons = {
    ArrowIcon: ChevronRight,
    DistrictIcon: MapPin,
    CommitteeIcon: Users,
    TagIcon: Tag,
    ActivityIcon: Binoculars
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
        if (this.committeeId) {
          this.getActivitiesRelated(this.committeeId);
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
    this.apiService.getPaginatedData(paginatedEndpoints.activities, 1, 5).subscribe({
      next: (data: any) => {
        if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
          this.activities = data.data;
        }
      },
      error: (error: any) => {
        console.error('Error fetching Activities:', error);
        this.activities = [];
      },
      complete: () => {
        console.log('Activities fetch completed.');
      }
    });
  }

  getActivitiesRelated(committeeId: number): void {
    this.apiService.getData(paginatedEndpoints.related, `committeeId=${committeeId}`).subscribe({
      next: (data: any) => {
        if (data && data.data) {
          this.activities = data.data.activities;
          console.log(this.activities);
          console.log(data);
        }
      },
      error: (error: any) => {
        console.error('Error fetching related activities:', error);
        this.activities = [];
      },
      complete: () => {
        console.log('Related activities fetch completed.');
      }
    });
  }

  getActivitiesNearby(districtId: any): void {
    this.apiService.getData(paginatedEndpoints.nearby, `districtId=${districtId}`).subscribe({
      next: (data: any) => {
        if (data && data.data) {
          this.activities = data.data.activities;
        }
      },
      error: (error: any) => {
        console.error('Error fetching nearby activities:', error);
        this.activities = [];
      },
      complete: () => {
        console.log('Nearby activities fetch completed.');
      }
    });
  }

  ngOnDestroy() {
    // No need to destroy Swiper instance as it's handled automatically
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
