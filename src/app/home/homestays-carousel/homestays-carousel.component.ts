import { CommonModule } from '@angular/common';
import { Component, OnInit ,AfterViewInit,OnDestroy, inject} from '@angular/core';
import { getDynamicClass,initializeOwlCarousel,destroyOwlInstance, getProfileImage, getDistrictClass } from '../../utils/utils';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { paginatedEndpoints } from '../../globalEnums.enum';

@Component({
  selector: 'app-homestays-carousel',
  templateUrl: './homestays-carousel.component.html',
  styleUrls: ['./homestays-carousel.component.css'],
  imports:[CommonModule,RouterLink]
})
export class HomestaysCarouselComponent implements OnInit ,AfterViewInit,OnDestroy{

  private apiService = inject(ApiService)

  homestays:any=[];
  
  ngOnInit() {
    this.getHomestays();
  }

  ngAfterViewInit(): void {
    
  }

  ngOnDestroy() {
    destroyOwlInstance('.homestays-carousel')
  }

  // Updated to use district-specific colors
  getClass(region: string): string {
    return getDistrictClass(region);
  }

  getHomestays(): void {
    this.apiService.getPaginatedData(paginatedEndpoints.homestays, 1, 5).subscribe({
      next: (data: any) => {
        console.log('Raw Homestays API Response:', data);
        console.log('Total Records:', data?.totalRecords);
        console.log('Current Page:', data?.pageNumber);
        console.log('Page Size:', data?.pageSize);
        
        if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
          console.log('Number of Homestays Loaded:', data.data.length);
          console.log('Homestays Data:', data.data);
          this.homestays = data.data;

          setTimeout(() => {
            initializeOwlCarousel('.homestays-carousel', true, true, 5, false, [2, 3, 4])
          }, 300);
        }
      },
      error: (error: any) => {
        console.error('Error fetching Homestays:', error);
        this.homestays = [];
      },
      complete: () => {
        console.log('Homestays API call completed');
      }
    });
  }

  getProfileImage(images:any[]):string
  {
    return getProfileImage(images);
  }
}
