import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { getProfileImage, getDistrictClass } from '../../utils/utils';
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
export class AdventuresComponent implements OnInit, OnDestroy {
  private apiService = inject(ApiService);
  activities: any[] = [];
  placeholder: placeholder = placeholder.image;
  icons = {
    ArrowIcon: ChevronRight,
    DistrictIcon: MapPin,
    CommitteeIcon: Users,
    TagIcon: Tag,
    ActivityIcon:Binoculars
  }

  ngOnInit() {
    this.getActivities();
  }

  ngOnDestroy() {
    // No need to destroy Swiper instance as it's handled automatically
  }

  // Updated to use district-specific colors
  getClass(region: string): string {
    return getDistrictClass(region);
  }

  getActivities(): void {
    this.apiService.getPaginatedData(paginatedEndpoints.activities, 1, 5).subscribe({
      next: (data: any) => {
        if (data && data.data && data.data.length > 0) {
          this.activities = data.data;
        }
      },
      error: (error: any) => {
        console.error('Error fetching Activities:', error);
        this.activities = []; // Fallback to an empty array
      },
      complete: () => {
        console.log('Activities fetch completed.');
      }
    });
  }

  getProfileImage(images: any[]): string {
    return getProfileImage(images);
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
