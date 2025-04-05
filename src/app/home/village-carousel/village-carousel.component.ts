import { CommonModule, JsonPipe } from '@angular/common';
import { Component, OnInit, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { getDynamicClass,initializeOwlCarousel,destroyOwlInstance,getProfileImage, getDistrictClass } from '../../utils/utils'; 
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { paginatedEndpoints } from '../../globalEnums.enum';

@Component({
  selector: 'app-village-carousel',
  templateUrl: './village-carousel.component.html',
  styleUrls: ['./village-carousel.component.css'],
  imports:[CommonModule,RouterLink]
})
export class VillageCarouselComponent implements OnInit, AfterViewInit, OnDestroy {
  private apiService=inject(ApiService)
  constructor(){
  }

  villages: any[] = [];

  ngOnInit(): void {
    this.getVillages();
  }

  ngAfterViewInit() {
   
  }

 ngOnDestroy() {
    destroyOwlInstance('.village-carousel')
  }

  // Updated to use district-specific colors
  getClass(region: string): string {
    return getDistrictClass(region);
  }

  getVillages(): void {
    this.apiService.getPaginatedData(paginatedEndpoints.villages,1,30).subscribe({
      next: (data: any) => {
        // Assign the data to the districts property
          // Add a placeholder image to each committee
          if (data && data.data && data.data.length > 0) {
            this.villages = data.data
          }

      if (this.villages.length > 0) {
        setTimeout(() => {
          initializeOwlCarousel('.village-carousel', true, true, 5, false, [1, 3, 5])
        }, 0)
      }

      },
      error: (error:any) => {
        console.error('Error fetching Committies:', error);
        // Optionally, set a default value or handle the error
        this.villages = []; // Fallback to an empty array
      },
      complete: () => {
        // Optional: Handle completion logic if needed
        console.log('Committies fetch completed.');
      
      }
    });
  }

   // Utility function is now accessible
   getProfileImage(imageArray: any[]): string {
    return getProfileImage(imageArray);
  }

}
