import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { paginatedEndpoints } from '../../globalEnums.enum';
import { register } from 'swiper/element/bundle';
import { getProfileImage, getDistrictClass } from '../../utils/utils';
import { LucideAngularModule, MapPin, Users, ChevronRight, Tag, Home } from 'lucide-angular';

// Register Swiper custom elements
register();

@Component({
  selector: 'app-homestays-carousel',
  templateUrl: './homestays-carousel.component.html',
  styleUrls: ['./homestays-carousel.component.css'],
  imports: [CommonModule, RouterLink, LucideAngularModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomestaysCarouselComponent implements OnInit {
  @Input() villageId: number = 0;
  private apiService = inject(ApiService);
  homestays: any = [];
  icons = {
    ArrowIcon: ChevronRight,
    DistrictIcon: MapPin,
    CommitteeIcon: Users,
    TagIcon: Tag,
    HomeIcon: Home
  }

  ngOnInit() {
    this.getHomestays();
  }

  getClass(region: string): string {
    return getDistrictClass(region);
  }

  getHomestays(): void {
    this.apiService.getPaginatedData(paginatedEndpoints.homestays, 1, 5).subscribe({
      next: (data: any) => {
        if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
          this.homestays = data.data;
          console.log('Number of homestays loaded:', this.homestays.length);
        }
      },
      error: (error: any) => {
        console.error('Error fetching Homestays:', error);
        this.homestays = [];
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