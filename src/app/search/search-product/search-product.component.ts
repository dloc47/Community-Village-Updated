import { CommonModule } from '@angular/common';
import { Component, OnInit,inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { getDynamicClass,getProfileImage, getDistrictClass, handleImageError } from '../../utils/utils';
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchService } from '../../../services/search.service';
import { paginatedEndpoints, search } from '../../utils/globalEnums.enum';
import { LucideAngularModule, MapPin, Users, Tag, ChevronRight, ShoppingBag, HousePlus, Award } from 'lucide-angular';

@Component({
  selector: 'app-search-product',
  templateUrl: './search-product.component.html',
  styleUrls: ['./search-product.component.css'],
  imports:[CommonModule,RouterLink,NgxPaginationModule,LucideAngularModule]
})
export class SearchProductComponent implements OnInit {

  private searchService = inject(SearchService)
  public getProfileImage = getProfileImage;
  public getDistrictClass = getDistrictClass;
  public handleImageError = handleImageError;

  itemPerPage=search.itemPerPage;
  pageNo:number=1
  productData:any[]=[]
  totalRecords:number=0
  isDataFound=false;
  isLoading:boolean=false;
  
  // Define icons object
  icons = {
    ArrowIcon: ChevronRight,
    DistrictIcon: MapPin,
    CommitteeIcon: Users,
    TagIcon: Tag,
    ShoppingBagIcon: ShoppingBag,
    Users: Users,
    MapPin: MapPin,
    HouseIcon: HousePlus,
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
  this.productData=[];
  this.totalRecords=0;

  this.searchService.getData(type, query).subscribe((result: any) => {
    if (result.isDataAvailable) {
      this.productData = result.items;
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
  
  // ✅ Handle Page Change (ngx-pagination)
onPageChange(pageNumber: number): void {
  this.pageNo = pageNumber 
  this.getPaginatedData(paginatedEndpoints.products,this.pageNo,search.itemPerPage)
  
}

   // ✅ Handle paginated data request
   getPaginatedData(endpoint:paginatedEndpoints,pageNo: number, itemPerPage: number): void {
    this.searchService.updateQueryState('paginated', { endpoint,pageNo, itemPerPage });
  }




}
