import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { getDynamicClass,initializeOwlCarousel,destroyOwlInstance, getProfileImage, getDistrictClass } from '../../utils/utils';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { paginatedEndpoints } from '../../globalEnums.enum';

@Component({
  selector: 'app-adventures',
  templateUrl: './adventures.component.html',
  styleUrls: ['./adventures.component.css'],
  imports:[CommonModule,RouterLink]
})
export class AdventuresComponent implements OnInit ,OnDestroy{

  private apiService = inject(ApiService)

  activities:any[]=[];

  ngOnInit() {
    this.getActivities()
  }

  ngOnDestroy() {
    destroyOwlInstance('.adventure-carousel')
  }

  // Updated to use district-specific colors
  getClass(region: string): string {
    return getDistrictClass(region);
  }

  getActivities(): void {
    this.apiService.getPaginatedData(paginatedEndpoints.activities,1,5).subscribe({
      next: (data: any) => {
     
        if (data && data.data && data.data.length > 0) {
          this.activities = data.data;
        }

        // Ensure carousel initializes after DOM updates
        if (this.activities.length > 0) {
          setTimeout(() => {
            initializeOwlCarousel('.adventure-carousel', true, true, 5, false, [1, 3, 5]);
          }, 300); // Small delay to ensure DOM is updated
        }    
      },
      error: (error:any) => {
        console.error('Error fetching Activities:', error);
        // Optionally, set a default value or handle the error
        this.activities = []; // Fallback to an empty array
      },
      complete: () => {
        // Optional: Handle completion logic if needed
        console.log('Activities fetch completed.');
      }
    });
  }

  getProfileImage(images:any[]):string{
    return getProfileImage(images);
  }
}
