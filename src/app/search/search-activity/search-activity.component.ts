import { Component, inject, OnInit } from '@angular/core';
import { paginatedEndpoints, search } from '../../globalEnums.enum';
import { getDynamicClass, getProfileImage } from '../../utils/utils';
import { SearchService } from '../../../services/search.service';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-activity',
  templateUrl: './search-activity.component.html',
  styleUrls: ['./search-activity.component.css'],
  imports:[CommonModule,RouterLink,NgxPaginationModule]
})
export class SearchActivityComponent implements OnInit {

 private searchService = inject(SearchService)

 itemPerPage=search.itemPerPage;
 pageNo:number=1
 activityData:any[]=[]
 totalRecords:number=0
 isDataFound=false;


  constructor() { }

  ngOnInit() {
    this.searchService.queryState$.subscribe(({ type, query }) => {
      this.loadData(type, query);
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


  getClass(input:number){
    return getDynamicClass(input);
  }
  
  getProfileImage(images:any[])
  {
    return getProfileImage(images);
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
