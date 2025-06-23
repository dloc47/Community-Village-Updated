import { CommonModule } from '@angular/common';
import { Component, OnInit,inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { getDynamicClass,getProfileImage, getDistrictClass } from '../../utils/utils';
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchService } from '../../../services/search.service';
import { paginatedEndpoints, search } from '../../globalEnums.enum';
import { IsNumberPipe } from "../../pipes/isNumber.pipe";
import { LucideAngularModule, MapPin, Users, Tag, ChevronRight } from 'lucide-angular';

@Component({
  selector: 'app-search-event',
  templateUrl: './search-event.component.html',
  styleUrls: ['./search-event.component.css'],
  imports: [CommonModule, RouterLink, NgxPaginationModule, LucideAngularModule]
})
export class SearchEventComponent implements OnInit {

 private searchService = inject(SearchService)
 public getProfileImage = getProfileImage;
 public getDistrictClass = getDistrictClass;
 public getClass = getDynamicClass;

 itemPerPage=search.itemPerPage;
 pageNo:number=1
 eventData:any[]=[]
 totalRecords:number=0
 isDataFound=false;
 isLoading:boolean=false;

 // Define icons object
 icons = {
   ArrowIcon: ChevronRight,
   DistrictIcon: MapPin,
   TagIcon: Tag,
   Users: Users,
   MapPin: MapPin
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
  this.eventData=[];

  this.searchService.getData(type, query).subscribe((result: any) => {
    if (result.isDataAvailable) {
      this.eventData = result.items;
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
  this.getPaginatedData(paginatedEndpoints.events,this.pageNo,search.itemPerPage)
  
}

   // ✅ Handle paginated data request
   getPaginatedData(endpoint:paginatedEndpoints,pageNo: number, itemPerPage: number): void {
    this.searchService.updateQueryState('paginated', { endpoint,pageNo, itemPerPage });
  }


  getDaysLeft(eventDate: string): string {
    const event = new Date(eventDate);
    const today = new Date(); // Use a fresh instance to avoid stale values
    const diffTime = event.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    return daysLeft <= 0 ? 'Ended' : `${daysLeft} days left`;
  } 
  
  


}
