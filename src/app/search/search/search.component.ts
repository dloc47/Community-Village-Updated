import { CommonModule } from '@angular/common';
import { Component, OnInit,inject } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { GlobalEnums, paginatedEndpoints } from '../../globalEnums.enum';
import { getDynamicClass, getProfileImage } from '../../utils/utils';
import { IsNumberPipe } from '../../pipes/isNumber.pipe';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute ,UrlSegment,RouterLink, RouterModule} from '@angular/router';
import { SearchService } from '../../../services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  imports:[CommonModule, NgxPaginationModule, IsNumberPipe, ReactiveFormsModule,RouterModule]
})
export class SearchComponent implements OnInit {
  private apiService = inject(ApiService)
  private searchService=inject(SearchService)
  private fb=inject( FormBuilder)
  private router=inject( ActivatedRoute)

constructor(
) { }


paginatedData: any[] = [];  //to store data from api 
totalItems: number = 0;  //total number of items in api initailly is 0
page: number = 1;    //page number currenty being displayed
itemPerPage: number = 5;  //number of items per page
loading : boolean = true;  //flag to check if data is being loaded
searching:boolean=false; //to determine if user is searching or not
isDataAvailable:boolean=true;  //show the user if data is available or not

GlobalEnums = GlobalEnums;  //enums which store tabs category to avoid type error
activeTab:GlobalEnums=GlobalEnums.village;  //current active tab or category to show data
today= new Date();   //today's date
endpoint:paginatedEndpoints=paginatedEndpoints.villages;  //endpoint of different category of data
searchPath: string = ''; // Store the dynamic part after /search

districts:any[]=[];   //to store districts data open in dropdown
villages:any[]=[];   //to store village filter after selecting district


userInputs: FormGroup = this.fb.group({
  region: [''],          // Default value as an empty string
  village: [''],         // Default value as an empty string
  searchTerm: ['']       // Default value as an empty string
});


ngOnInit() {
  // First, check for segment
  const hasValidSegment = this.getFirstSegment();

  // Drill down data regardless
  this.drillDownDistrict();

  // Only run loadPaginatedData() if no valid segment was found
  if (!hasValidSegment||hasValidSegment) {
    this.loadPaginatedData();
  }
}

getFirstSegment(): boolean {
  let segmentFound = false;

  this.router.data.subscribe((data) => {
    if (data['type']) {
      // If segment exists, set active tab and load data
      this.setActiveTabParam(data['type']);
      segmentFound = true;
    }
  });

  return segmentFound;
}

      setActiveTabParam(path:string){
        switch (path) {
          case 'village':
            this.setActiveTabs(GlobalEnums.village);
            break;    
            case 'homestay':
              this.setActiveTabs(GlobalEnums.homestays);        
            break;
            case 'product':
              this.setActiveTabs(GlobalEnums.product);         
              break;
              case 'activity':
              this.setActiveTabs(GlobalEnums.activities);            
            break;
            case 'event':
              this.setActiveTabs(GlobalEnums.events);
          break;      
          default:
            console.warn('Invalid tab selected!');
        }
      }

    

      drillDownDistrict(): void {
        this.apiService.getData('website/districts').subscribe({
          next: (data: any) => {
            // Assign the data to the  property
            this.districts=data;
          },
          error: (error) => {
            console.error('Error fetching districts drilldown:', error);
            this.districts=[];
          },
          complete: () => {
            // Optional: Handle completion logic if needed
            console.log('Drill down for  website/districts fetch completed.');
          }
        });
      }



      drillDownVillages(districtId: number): void {
        this.apiService.getData('website/committees').subscribe({
            next: (data: any) => {
                if (Array.isArray(data)) {
                    this.villages = data
                        .filter(item => item.districtId === districtId) // Filter by districtId
                        .map(({ committeeId, committeeName,districtId }) => ({ committeeId, committeeName ,districtId})); // Extract required fields
                        console.log(this.villages)
                } else {
                    console.warn('Unexpected data format:', data);
                    this.villages = [];
                }
            },
            error: (error: any) => {
                console.error('Error fetching villages drilldown:', error);
                this.villages = [];
            },
            complete: () => {
                console.log('Drill down for website/committee fetch completed.');
            }
        });
    }
    
    
    
      onDistrictChange(event: Event): void {
        const selectedValue = (event.target as HTMLSelectElement).value;
      
        // Ensure the value is a number and not empty
        const districtId = selectedValue && !isNaN(+selectedValue) ? +selectedValue : null;
       
        this.userInputs.get('village')?.setValue('');
      
        if (districtId !== null) {
          this.drillDownVillages(districtId)
        }
      }

      
      search() {
        let region = this.getValidInput(this.userInputs.get('region')?.value);
        let village = this.getValidInput(this.userInputs.get('village')?.value);
        let searchTerm = this.getValidInput(this.userInputs.get('searchTerm')?.value);
   
        if(region!==undefined||village!==undefined||searchTerm!==undefined){
          this.searching=true;  //enable searching 
          this.fetchFilteredData(region,village,searchTerm)
        }

      }


      // Function to check if the value is valid (not empty or just spaces)
      private getValidInput(value: any): string | undefined {
        return value && value.trim() !== '' ? value.trim() : undefined;
      }


      setActiveTabs(selectedTab: GlobalEnums) {
        this.activeTab = selectedTab;
      
        switch (this.activeTab) {
          case GlobalEnums.village:
            this.endpoint = paginatedEndpoints.villages;
            break;
      
          case GlobalEnums.homestays:
            this.endpoint = paginatedEndpoints.homestays;
            break;
      
          case GlobalEnums.product:
            this.endpoint = paginatedEndpoints.products;
            break;
      
          case GlobalEnums.activities:
            this.endpoint = paginatedEndpoints.activities;
            break;
      
          case GlobalEnums.events:
            this.endpoint = paginatedEndpoints.events;
            break;
      
          default:
            console.warn('Invalid tab selected!');
        }
      
        this.page = 1;  //set the page to 1 when tab is switched
        this.loadPaginatedData(); //call api again for selected tab
        this.clearFilters(); // Clear selected options or input after changing the tab
        this.searching=false; //set the option searching to false once tab is switched
      }
         

  
      fetchFilteredData(districtId: any, villageId: any, searchTerm: any): void {
        this.loading = true;
        this.apiService
          .getFilteredData(this.activeTab, districtId, villageId, searchTerm)
          .subscribe({
            next: (data: any) => {
              // Check if data is valid and non-empty
              if (data && Array.isArray(data) && data.length > 0) {
                // Map and enrich data
                this.paginatedData = data.map((item) => ({
                  ...item,
                  image: 'https://placehold.co/600x400', // Static placeholder image
                  description:
                    'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
                  price: '2500',
                  tags: [
                    'Mountain View',
                    'Beach View',
                    'City View',
                    'Traditional Kitchen',
                    'Private Bathroom',
                    'Garden',
                  ],
                  productCategory: 'Handicraft',
                  altitude: '48439',
                  includes: ['Expert Guide', 'Equipment', 'Refreshments', 'Transport'],
                }));
      
                // Set total number of items
                this.totalItems = this.paginatedData.length;
                this.isDataAvailable = true;
              } else {
                // No data found - handle gracefully
                this.handleNoDataFound();
              }
            },
            error: (error: any) => {
              console.error('Error fetching data:', error);
              this.handleNoDataFound(); // Handle error gracefully
            },
            complete: () => {
              this.loading = false;
              console.log('Data fetch completed for filtered data.', this.paginatedData);
            },
          });
      }
      
     


     
      

// ✅ Fetch paginated data without filters
loadPaginatedData(): void {
  this.loading = true;
  this.apiService
    .getPaginatedData<any>(this.endpoint, this.page, this.itemPerPage)
    .subscribe({
      next: (data: any) => {
        // Check if data is valid and contains items
        if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
          // Enrich the fetched data with additional properties
          this.paginatedData = data.data.map((item: any) => ({
            ...item,
            category: 'Handcraft', // Add category property
            price: 1000, // Add price property
          }));

          // Update page and total items
          this.page = data.pageNumber;
          this.totalItems = data.totalRecords;
          this.isDataAvailable = true;
        } else {
          // Handle no data scenario
          this.handleNoDataFound();
        }
      },
      error: (error: any) => {
        console.error('Error fetching paginated data:', error);
        this.handleNoDataFound(); // Handle error gracefully
      },
      complete: () => {
        this.loading = false;
        console.log('Data fetch completed for paginated data.', this.paginatedData);
      },
    });
}


// ✅ Handle Page Change (ngx-pagination)
onPageChange(pageNumber: number): void {
  this.page = pageNumber;

  if(!this.searching){  // Check if search is active
     this.loadPaginatedData(); // ✅ Fetch data for selected page
  }
}



      
      
      
      clearFilters(){
        this.userInputs.reset(
          {
            region: '',
            village: '',
            searchTerm: '',
          }
        );
        this.searching = false;
        this.loadPaginatedData();
       }
       
 
       // ✅ Handle no data scenario separately for clean code
       handleNoDataFound(): void {
        this.paginatedData = [];
        this.isDataAvailable = false;
        this.loading = false;
        console.warn('No data found');
      }
      
      
      getProfileImage(imageArray: any[]): string {
        return getProfileImage(imageArray);
      }

      getClass(input:number){
        return getDynamicClass(input);
      }
      
      getDaysLeft(eventDate: string): string {
        const event = new Date(eventDate);
        const today = new Date(); // Use a fresh instance to avoid stale values
        const diffTime = event.getTime() - today.getTime();
        const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
        return daysLeft <= 0 ? 'Ended' : `${daysLeft} days left`;
      } 
      

}
