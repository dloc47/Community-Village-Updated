import { CommonModule } from '@angular/common';
import { Component, OnInit,inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { getDynamicClass,getProfileImage } from '../../utils/utils';
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchService } from '../../../services/search.service';
import { paginatedEndpoints, search } from '../../globalEnums.enum';

@Component({
  selector: 'app-search-village',
  templateUrl: './search-village.component.html',
  styleUrls: ['./search-village.component.css'],
  imports:[CommonModule,RouterLink,NgxPaginationModule]
})
export class SearchVillageComponent implements OnInit {
 private searchService = inject(SearchService)

 itemPerPage=search.itemPerPage;
 pageNo:number=1
 villageData:any[]=[]
 totalRecords:number=0
 isDataFound=false;


  constructor() { }

  ngOnInit() {
    this.searchService.queryState$.subscribe(({ type, query }) => {
      this.loadData(type, query);
    });
  }


loadData(type: 'paginated' | 'filtered', query: any): void {
  this.villageData=[];
  this.searchService.getData(type, query).subscribe((result: any) => {
    if (result.isDataAvailable) {
      this.villageData = result.items;
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
  this.getPaginatedData(paginatedEndpoints.villages,this.pageNo,search.itemPerPage)
  
}

   // ✅ Handle paginated data request
   getPaginatedData(endpoint:paginatedEndpoints,pageNo: number, itemPerPage: number): void {
    this.searchService.updateQueryState('paginated', { endpoint,pageNo, itemPerPage });
  }



}
