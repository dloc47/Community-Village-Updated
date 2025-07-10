import { Component, inject, OnInit } from '@angular/core';
import { paginatedEndpoints, search } from '../../utils/globalEnums.enum';
import { getDistrictClass, getProfileImage ,handleImageError} from '../../utils/utils';
import { SearchService } from '../../../services/search.service';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, MapPin, Users,Tag, Binoculars, ChevronRight,HousePlus, Award } from 'lucide-angular';


@Component({
  selector: 'app-search-activity',
  templateUrl: './search-activity.component.html',
  styleUrls: ['./search-activity.component.css'],
  imports:[CommonModule,RouterLink,NgxPaginationModule,LucideAngularModule]
})
export class SearchActivityComponent implements OnInit {

 private searchService = inject(SearchService)
 public getProfileImage = getProfileImage;
 public getDistrictClass =getDistrictClass
 public handleImageError=handleImageError

 itemPerPage=search.itemPerPage;
 pageNo:number=1
 activityData:any[]=[]
 totalRecords:number=0
 isDataFound=false;
 isLoading:boolean=false;

 // Define icons object
 icons = {
   ArrowIcon: ChevronRight,
   DistrictIcon: MapPin,
   CommitteeIcon: Users,
   TagIcon: Tag,
   Users: Users,
   HouseIcon: HousePlus,
   BinocularsIcon:Binoculars,
   Award: Award
 };



  constructor() { }

  ngOnInit() {
    this.searchService.queryState$.subscribe(({ type, query }) => {
      this.loadData(type, query);
    });

    this.searchService.loading$.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
  }


loadData(type: 'paginated' | 'filtered', query: any): void {
  this.activityData=[];
  this.totalRecords=0;

  this.searchService.getData(type, query).subscribe((result: any) => {
    if (result.isDataAvailable) {
      this.activityData = result.items;
      if(type=='paginated')
      {
        this.totalRecords = result.totalRecords;
      }
      else if(type=='filtered')
      {
        this.totalRecords = result.items.length;
      }
    } 
  });
}

  
  // ✅ Handle Page Change (ngx-pagination)
onPageChange(pageNumber: number): void {
  this.pageNo = pageNumber 
  this.getPaginatedData(paginatedEndpoints.activities,this.pageNo,search.itemPerPage)
  
}

   // ✅ Handle paginated data request
   getPaginatedData(endpoint:paginatedEndpoints,pageNo: number, itemPerPage: number): void {
    this.searchService.updateQueryState('paginated', { endpoint,pageNo, itemPerPage });
  }


}
