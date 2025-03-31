import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { GlobalEnums } from '../../globalEnums.enum';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-hero-section',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css',
})
export class HeroSectionComponent implements OnInit {
  // Inject the API service for making HTTP requests
  private apiService = inject(ApiService);

  // Object to store various entity counts
  counts: any = {
    villageCommunities: '00',
    homeStays: '00',
    thingsToDo: '00',
    localProducts: '00',
    events: '00'
  };

  // Arrays to store district and village data
  districts: any[] = [];
  villages: any[] = [];
  
  // Reference to GlobalEnums for type safety
  GlobalEnums = GlobalEnums;
  // Track the currently active tab
  activeTab = this.GlobalEnums.homestays;

  // Initialize the search form with reactive form controls
  searchForm = new FormGroup({
    location: new FormControl(''),
    village: new FormControl(''),
    searchKeyboard: new FormControl(''),
  });

  constructor() {}

  ngOnInit(): void {
    // Initialize component by fetching required data
    this.entityCount();
    this.getDistricts();
  }
   
  // Method to set the active tab
  setActiveTab(category: GlobalEnums) {
    this.activeTab = category;
  }

  // Fetch and format entity counts from the API
  entityCount(): void {
    this.apiService.getData('website/entity-counts').pipe(
      catchError((error) => {
        console.error('Error fetching entity counts:', error);
        return of({}); // Return empty object on error
      })
    ).subscribe({
      next: (data: any) => {
        try {
          this.counts = this.formatCounts(data);
        } catch (error) {
          console.error('Error formatting entity counts:', error);
          this.counts = {};
        }
      },
      error: (error) => {
        console.error('Subscription error:', error);
      },
      complete: () => {
        console.log('Entity count fetch completed.');
      }
    });
  }

  // Fetch all districts from the API
  getDistricts(): void {
    this.apiService.getData('website/districts').subscribe({
      next: (data: any) => {
        this.districts = data;
      },
      error: (error) => {
        console.error('Error fetching districts:', error);
        this.districts = [];
      },
      complete: () => {
        console.log('Districts fetch completed.');
      }
    });
  }

  // Fetch villages based on selected district
  getVillages(districtId: number): void {
    this.apiService.getData('website/committees').subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          // Filter villages by districtId and map to required format
          this.villages = data
            .filter(item => item.districtId === districtId)
            .map(({ committeeId, committeeName, districtId }) => ({ 
              committeeId, 
              committeeName, 
              districtId 
            }));
        } else {
          console.warn('Unexpected data format:', data);
          this.villages = [];
        }
      },
      error: (error) => {
        console.error('Error fetching villages:', error);
        this.villages = [];
      },
      complete: () => {
        console.log('Villages fetch completed.');
      }
    });
  }

  // Handle district selection change
  onDistrictChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    const districtId = selectedValue && !isNaN(+selectedValue) ? +selectedValue : null;
    
    // Reset village selection when district changes
    this.searchForm.get('village')?.setValue('');
    
    if (districtId !== null) {
      this.getVillages(districtId);
    } else {
      this.villages = [];
    }
  }

  // Format the counts data
  formatCounts(data: any): Record<string, string> {
    if (!data || typeof data !== 'object') {
      return {};
    }

    const formattedData: any = {};
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        formattedData[key] = this.formatNumber(data[key]);
      }
    }
    return formattedData;
  }

  // Format numbers to ensure two-digit display
  formatNumber(value: number | string | null | undefined): string {
    if (value === null || value === undefined) {
      return '00';
    }

    let strValue = value.toString().trim();

    if (!/^\d+$/.test(strValue)) {
      return '00';
    }

    return strValue.length === 1 ? '0' + strValue : strValue;
  }
}
