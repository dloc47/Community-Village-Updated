import { CommonModule } from '@angular/common';
import { Component, OnInit,inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { getDistrictClass,getProfileImage,handleImageError } from '../../utils/utils';
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchService } from '../../../services/search.service';
import { paginatedEndpoints, search } from '../../utils/globalEnums.enum';
import { LucideAngularModule, MapPin, ChevronRight, Milestone, Users, Tag } from 'lucide-angular';

@Component({
  selector: 'app-search-committee',
  templateUrl: './search-committee.component.html',
  styleUrls: ['./search-committee.component.css'],
  imports:[CommonModule,RouterLink,NgxPaginationModule,LucideAngularModule]
})
export class SearchCommitteeComponent implements OnInit {
  private searchService = inject(SearchService)
  public handleImageError =handleImageError
  public getDistrictClass =getDistrictClass
  public getProfileImage=getProfileImage

  itemPerPage=search.itemPerPage;
  pageNo:number=1
  villageData:any[]=[]
  totalRecords:number=0
  isDataFound=false;
  isLoading:boolean=false;

  // Define icons object
  icons = {
    ArrowIcon: ChevronRight,
    DistrictIcon: Milestone,
    CommitteeIcon: Users,
    TagIcon: Tag
  }

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
