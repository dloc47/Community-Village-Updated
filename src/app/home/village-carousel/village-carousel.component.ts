import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { paginatedEndpoints } from '../../globalEnums.enum';
import { getProfileImage, getDistrictClass } from '../../utils/utils';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-village-carousel',
  templateUrl: './village-carousel.component.html',
  styleUrls: ['./village-carousel.component.css'],
  imports: [CommonModule, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VillageCarouselComponent implements OnInit {
  private apiService = inject(ApiService);
  villages: any[] = [];

  ngOnInit(): void {
    this.getVillages();
  }

  getClass(region: string): string {
    return getDistrictClass(region);
  }

  getVillages(): void {
    this.apiService.getPaginatedData(paginatedEndpoints.villages, 1, 30).subscribe({
      next: (data: any) => {
        if (data && data.data && data.data.length > 0) {
          this.villages = data.data;
        }
      },
      error: (error: any) => {
        console.error('Error fetching Villages:', error);
        this.villages = [];
      },
      complete: () => {
        console.log('Villages fetch completed.');
      }
    });
  }

  getProfileImage(imageArray: any[]): string {
    return getProfileImage(imageArray);
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
