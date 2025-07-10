import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { GlobalEnums } from '../../utils/globalEnums.enum';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { LucideAngularModule, MapPin, Users, Tag, ChevronRight, ShoppingBag, HousePlus, 
  CalendarDays, TextSearch, ListFilter, Binoculars, Search } from 'lucide-angular';


@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, LucideAngularModule],
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
  committee: any[] = [];
  
  // Reference to GlobalEnums for type safety
  GlobalEnums = GlobalEnums;
  // Track the currently active tab
  activeTab = this.GlobalEnums.village;
  validSearchForm:boolean=true;

  icons = {
    CommitteeIcon: Users,
    DistrictIcon: MapPin,
    TagIcon: Tag,
    ArrowIcon: ChevronRight,
    HomestayIcon: HousePlus,
    ProductIcon: ShoppingBag,
    EventIcon: CalendarDays,
    ActivityIcon: Binoculars,
    TextSearchIcon: TextSearch,
    SearchIcon: Search,
    FilterIcon: ListFilter
  };

  // Initialize the search form using FormBuilder
  heroSearchForm: FormGroup = this.fb.group({
    region: ['',Validators.required],
    committee: [''],
    searchTerm: ['']
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
    this.heroSearchForm.reset({
      region:'',
      committee:'',
      searchTerm:'',
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
  getCommittees(districtId: number): void {
    this.apiService.getData('website/committees').subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          // Filter committees by districtId and map to required format
          this.committee = data
            .filter(item => item.districtId === districtId)
            .map(({ committeeId, committeeName, districtId }) => ({ 
              committeeId, 
              committeeName, 
              districtId 
            }));
        } else {
          console.warn('Unexpected data format:', data);
          this.committee = [];
        }
      },
      error: (error) => {
        console.error('Error fetching committees:', error);
        this.committee = [];
      },
      complete: () => {
        console.log('Committees fetch completed.');
      }
    });
  }

  // Handle district selection change
  onDistrictChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    const districtId = selectedValue && !isNaN(+selectedValue) ? +selectedValue : null;
    // Reset committee selection when district changes
    this.heroSearchForm.get('committee')?.setValue('');
    if (districtId !== null) {
      this.getCommittees(districtId);
    } else {
      this.committee = [];
    }
  }


  onHeroSearch() {
    const formData = this.heroSearchForm.getRawValue();
    if(!this.heroSearchForm.invalid){
      // Send form data with 'search/' before route params
      this.router.navigate([
        'search',
        this.activeTab,
        formData.region || '',   // type (region)
        formData.committee || '',    // committeeId
        formData.searchTerm || '' // keyword (searchTerm)
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
