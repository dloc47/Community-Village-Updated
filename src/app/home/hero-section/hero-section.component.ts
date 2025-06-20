import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { GlobalEnums } from '../../globalEnums.enum';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';


@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css',
})
export class HeroSectionComponent implements OnInit, AfterViewInit {
  // Inject the API service for making HTTP requests
  private apiService = inject(ApiService);
  private fb= inject(FormBuilder);
  private router= inject(Router)

  // Object to store various entity counts
  counts: any = {
    committees: '00',
    homestays: '00',
    activities: '00',
    products: '00',
    events: '00'
  };

  // Arrays to store district and village data
  districts: any[] = [];
  villages: any[] = [];
  
  // Reference to GlobalEnums for type safety
  GlobalEnums = GlobalEnums;
  // Track the currently active tab
  activeTab = this.GlobalEnums.village;
  validSearchForm:boolean=true;


  // Initialize the search form using FormBuilder
  searchForm: FormGroup = this.fb.group({
    location: ['',Validators.required],
    village: [''],
    searchKeyword: ['']
  });


constructor() {}


  ngOnInit(): void {
   
  }

  ngAfterViewInit(){
  // Initialize component by fetching required data
    this.fetchEntityCounts();
    this.getDistricts();
  } 

  // Method to set the active tab
  setActiveTab(category: GlobalEnums) {
    this.activeTab = category;
    this.searchForm.reset({
      location:'',
      village:'',
      searchKeyword:'',
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


search() {
  const formData = this.searchForm.getRawValue();
  if(!this.searchForm.invalid){
  
  // Send form data with 'search/' before route params
  this.router.navigate([
    'search',
    this.activeTab,
    formData.location || '',   // type (location)
    formData.village || '',    // districtId (village)                           // villageId (static or dynamic if needed)
    formData.searchKeyword || '' // keyword (searchKeyword)
  ]);
}
  else{
  this.validSearchForm=false;
  }
}


// Fetch entity counts from the API
fetchEntityCounts(): void {
  this.apiService.getData('website/entity-counts').pipe(
    catchError((error) => {
      console.error('Error fetching entity counts:', error);
      return of({}); // Return an empty object on error
    })
  ).subscribe({
    next: (data: any) => this.handleEntityData(data), // Pass data to handler
    error: (error) => {
      console.error('Subscription error:', error);
    },
    complete: () => {
      console.log('Entity count fetch completed.');
    }
  });
}


// Handle and format entity count data
handleEntityData(data: any): void {
  try {
    this.counts = this.formatCounts(data);
  } catch (error) {
    console.error('Error formatting entity counts:', error);
    this.counts = {}; // Return empty object if formatting fails
  }
}


// Format the counts data
formatCounts(data: any): Record<string, string> {
  if (!data || typeof data !== 'object') {
    return {};
  }

  const formattedData: Record<string, string> = {};
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
