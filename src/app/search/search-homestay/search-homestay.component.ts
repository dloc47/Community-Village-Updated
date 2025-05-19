import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchService } from '../../../services/search.service';
import { paginatedEndpoints, search } from '../../globalEnums.enum';
import { getDynamicClass, getProfileImage } from '../../utils/utils';

@Component({
  selector: 'app-search-homestay',
  templateUrl: './search-homestay.component.html',
  styleUrls: ['./search-homestay.component.css'],
  imports:[CommonModule,RouterLink,NgxPaginationModule]
})
export class SearchHomestayComponent implements OnInit {

 private searchService = inject(SearchService)

 itemPerPage=search.itemPerPage;
 pageNo:number=1
 homestayData:any[]=[]
 totalRecords:number=0
 isDataFound=false;
 isLoading:boolean=false;

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
  this.homestayData=[];

  this.searchService.getData(type, query).subscribe((result: any) => {
    if (result.isDataAvailable) {
      this.homestayData = result.items;
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
  this.getPaginatedData(paginatedEndpoints.homestays,this.pageNo,search.itemPerPage)
  
}

   // ✅ Handle paginated data request
   getPaginatedData(endpoint:paginatedEndpoints,pageNo: number, itemPerPage: number): void {
    this.searchService.updateQueryState('paginated', { endpoint,pageNo, itemPerPage });
  }

}
