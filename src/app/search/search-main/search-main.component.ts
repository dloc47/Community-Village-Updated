import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GlobalEnums, paginatedEndpoints, search } from '../../globalEnums.enum';
import { SearchVillageComponent } from "../search-village/search-village.component";
import { SearchService } from '../../../services/search.service';
import { SearchHomestayComponent } from "../search-homestay/search-homestay.component";
import { SearchActivityComponent } from "../search-activity/search-activity.component";
import { SearchProductComponent } from "../search-product/search-product.component";
import { SearchEventComponent } from "../search-event/search-event.component";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-main',
  templateUrl: './search-main.component.html',
  styleUrls: ['./search-main.component.css'],
  imports: [
    CommonModule, ReactiveFormsModule,
    SearchVillageComponent, SearchHomestayComponent,
    SearchActivityComponent,
    SearchProductComponent,
    SearchEventComponent
]
})
export class SearchMainComponent implements OnInit {
  private fb=inject( FormBuilder)
  private searchService=inject( SearchService)
  private router=inject( ActivatedRoute)

  GlobalEnums = GlobalEnums;  //enums which store tabs category to avoid type error
  activeTab:GlobalEnums=GlobalEnums.village;  //current active tab or category to show data
  
  isLoading:boolean=false;
  noDataFound:boolean=false;
  errorMessage:any
  pageNo:number=1
  itemPerPage:number=search.itemPerPage
  category:GlobalEnums=GlobalEnums.village
  paginateCategory:paginatedEndpoints=paginatedEndpoints.villages


  districts:any=[]
  villages:any=[]

  userInputs: FormGroup = this.fb.group({
    region: [''],          // Default value as an empty string
    village: [''],         // Default value as an empty string
    searchTerm: ['']       // Default value as an empty string
  });
  
  
  constructor() { }

  ngOnInit() {

    //load districts
        this.loadDistricts();

    //loading
     this.searchService.loading$.subscribe((isLoading) => {
       this.isLoading = isLoading;
    });

    //no data found
   this.searchService.noDataFound$.subscribe((noData) => {
      this.noDataFound = noData;
    });

    //error message
    this.searchService.errorMessage$.subscribe((error) => {
      this.errorMessage = error;
    });
       
    //get first parameter
      this.getFirstParameter();
  }

  
 getFirstParameter() {
let firstSegment:any;
this.router.parent?.url.subscribe((segments) => {
   firstSegment = segments[0]?.path || '';
   if(firstSegment!='search'){
   this.setActiveTabParam(firstSegment);
   }
});

  // Subscribe to route params

  this.router.params.subscribe((params) => {
    const type = params['type'] || undefined;
    const districtId = params['districtId'] || undefined;
    const villageId = params['villageId'] || undefined;
    const keyword = params['keyword'] || undefined;
    // If 'type' exists, set the active tab
    if (firstSegment=='search'&&type !== undefined) {
      this.setActiveTabParam(type);
    }

    // If 'districtId' is valid, call search() else paginated
    if (districtId !== undefined && districtId!=='undefined' && districtId!=='') {
      this.redirectedFilters(type,districtId,villageId,keyword);
    }
    else{
      this.getPaginatedData(this.paginateCategory,this.pageNo,this.itemPerPage);
    }


  });


}

redirectedFilters(type:any, districtId:any, villageId:any, keyword:any) {
    // Normalize parameters: if undefined, 'undefined', or '', set to undefined
    type = (type === undefined || type === 'undefined' || type === '') ? undefined : type;
    districtId = (districtId === undefined || districtId === 'undefined' || districtId === '') ? undefined : districtId;
    villageId = (villageId === undefined || villageId === 'undefined' || villageId === '') ? undefined : villageId;
    keyword = (keyword === undefined || keyword === 'undefined' || keyword === '') ? undefined : keyword;

   this.loadVillages(districtId);  //drill down vilages from district

    this.userInputs.patchValue({
      region: districtId,          // Default value as an empty string
      village:villageId,
      searchTerm:keyword         // Default value as an empty string
    });

    this.search();  //call this method after setting all the values
    
}



setActiveTabParam(path: string) {
    switch (path.toLowerCase()) { // Convert path to lowercase for case-insensitive comparison
        case 'village':
        case 'villages':
            this.setActiveTabs(GlobalEnums.village);
            break;
        case 'homestay':
        case 'homestays':
            this.setActiveTabs(GlobalEnums.homestays);
            break;
        case 'product':
        case 'products':
            this.setActiveTabs(GlobalEnums.product);
            break;
        case 'activity':
        case 'activities':
            this.setActiveTabs(GlobalEnums.activities);
            break;
        case 'event':
        case 'events':
            this.setActiveTabs(GlobalEnums.events);
            break;
        default:
            console.warn('Invalid tab selected!');
    }
}



   // ✅ Handle paginated data request
   getPaginatedData(endpoint:paginatedEndpoints,pageNo: number, itemPerPage: number): void {
    this.searchService.updateQueryState('paginated', { endpoint,pageNo, itemPerPage });
  }

  
  // ✅ Handle filtered data request
  getFilteredData(category: string, districtId?: number, villageId?: number, searchTerm?: string): void {
    this.searchService.updateQueryState('filtered', {
      category,
      districtId,
      villageId,
      searchTerm,
    });

  }

  loadDistricts(): void {
    this.searchService.drillDownDistrict().subscribe((result) => {
      this.districts = result;
    });
  }

  loadVillages(id:any): void {
    this.searchService.drillDownVillage(id).subscribe((result) => {
      this.villages = result;
    });
  }

  onDistrictChange(){
    const input=this.userInputs.get('region')?.value
    this.loadVillages(input)
  }

  clearFilters(){
    this.userInputs.reset(
      {
        region: '',
        village: '',
        searchTerm: '',
      }
    );
    this.getPaginatedData(this.paginateCategory,this.pageNo,this.itemPerPage);
   }

   search() {
    let regionStr = this.getValidInput(this.userInputs.get('region')?.value);
    let villageStr = this.getValidInput(this.userInputs.get('village')?.value);
    let searchTerm = this.getValidInput(this.userInputs.get('searchTerm')?.value);
  
    // Convert to number if valid and not NaN
    let region = regionStr !== undefined && !isNaN(Number(regionStr)) ? Number(regionStr) : undefined;
    let village = villageStr !== undefined && !isNaN(Number(villageStr)) ? Number(villageStr) : undefined;
  
    this.getFilteredData(this.category, region, village, searchTerm);
  }
  
     // Function to check if the value is valid (not empty or just spaces)
     private getValidInput(value: any): string | undefined {
      return value && value.trim() !== '' ? value.trim() : undefined;
    }
  

   setActiveTabs(selectedTab: GlobalEnums) {
           this.activeTab = selectedTab;
           switch(selectedTab)
           {
            case GlobalEnums.village:
              this.category=GlobalEnums.village;
              this.paginateCategory = paginatedEndpoints.villages;
              break;
              case GlobalEnums.activities:
                this.category=GlobalEnums.activities;
                this.paginateCategory = paginatedEndpoints.activities;
                break;
                case GlobalEnums.events:
                  this.category=GlobalEnums.events;
                  this.paginateCategory = paginatedEndpoints.events;
                  break;
                  case GlobalEnums.product:
                    this.category=GlobalEnums.product;
                    this.paginateCategory = paginatedEndpoints.products;
                    break;
                    case GlobalEnums.homestays:
                      this.category=GlobalEnums.homestays;
                      this.paginateCategory = paginatedEndpoints.homestays;
           }

           this.clearFilters(); // Clear selected options or input after changing the tab
    }
           


}
