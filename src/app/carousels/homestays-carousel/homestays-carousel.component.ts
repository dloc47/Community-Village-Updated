import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, Input, CUSTOM_ELEMENTS_SCHEMA,OnChanges, SimpleChanges} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { paginatedEndpoints } from '../../utils/globalEnums.enum';
import { register } from 'swiper/element/bundle';
import { getProfileImage, getDistrictClass,handleImageError } from '../../utils/utils';
import { LucideAngularModule, MapPin, Users, ChevronRight, Tag, HousePlus } from 'lucide-angular';

// Register Swiper custom elements
register();

@Component({
  selector: 'app-homestays-carousel',
  templateUrl: './homestays-carousel.component.html',
  styleUrls: ['./homestays-carousel.component.css'],
  imports: [CommonModule, RouterLink, LucideAngularModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomestaysCarouselComponent implements OnInit ,OnChanges {
  @Input() committeeId: number = 0;
  @Input() districtId: number = 0;
  @Input() type: 'nearby' | 'related' | 'random' = 'random';
  public getDistrictClass = getDistrictClass
  public getProfileImage =getProfileImage
  public handleImageError =handleImageError

  private apiService = inject(ApiService);
  homestays: any = [];
  icons = {
    ArrowIcon: ChevronRight,
    DistrictIcon: MapPin,
    CommitteeIcon: Users,
    TagIcon: Tag,
    HomestayIcon:HousePlus,
  }

  ngOnInit() {
    this.loadData();
  }


  ngOnChanges(changes: SimpleChanges): void {
    this.loadData();
  }

  private loadData(): void {
    switch (this.type) {
      case 'random':
        this.getHomestayRandom();
        break;
      case 'related':
        if (this.committeeId) {
          this.getHomestaysRelated(this.committeeId);
        }
        break;
      case 'nearby':
        if (this.districtId) {
          this.getHomestaysNearby(this.districtId);
        }
        break;
    }
  }

  getHomestayRandom(): void {
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

  getHomestaysRelated(committeeId: number): void {
    this.apiService.getData(paginatedEndpoints.related,`committeeId=${committeeId}`).subscribe({
      next: (data: any) => {
        if (data && data.data ) {
          this.homestays = data.data.homestays;
        }
      },
      error: (error: any) => {
        console.error('Error fetching related homestays:', error);
        this.homestays = [];
      },
      complete: () => {
        console.log('Related homestays fetch completed.');
      }
    });
  }

  getHomestaysNearby(districtiId:any): void {
    this.apiService.getData(paginatedEndpoints.nearby, `districtId=${districtiId}`).subscribe({
      next: (data: any) => {
        if (data && data.data ) {
          this.homestays = data.data.homestays;
        }
      },
      error: (error: any) => {
        console.error('Error fetching Villages:', error);
        this.homestays = [];
      },
      complete: () => {
        console.log('Homestays fetch completed.');
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