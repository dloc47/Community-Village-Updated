import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  getDynamicClass,
  getProfileImage,
  getDistrictClass,
  handleImageError,
} from '../../utils/utils';
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchService } from '../../../services/search.service';
import {
  LucideAngularModule,
  MapPin,
  Users,
  Tag,
  ChevronRight,
  ShoppingBag,
  HousePlus,
  Award,
} from 'lucide-angular';
import { ApiService } from '../../../services/api.service';
import { LoaderService } from '../../../services/loader.service';
import { finalize, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-product',
  templateUrl: './search-product.component.html',
  styleUrls: ['./search-product.component.css'],
  imports: [CommonModule, RouterLink, NgxPaginationModule, LucideAngularModule],
})
export class SearchProductComponent implements OnInit {
  private searchService = inject(SearchService);
  private apiService = inject(ApiService);
  private loader = inject(LoaderService);
  public getProfileImage = getProfileImage;
  public getDistrictClass = getDistrictClass;
  public handleImageError = handleImageError;

  productData: any[] = [];
  pagination = {
    pageNo: 1,
    pageSize: 0,
    totalRecords: 0,
  };

  // Observables for template
  isLoading$ = this.loader.isLoading$;
  isDataFound$ = this.searchService.isDataFound$;

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
    Award: Award,
  };

  constructor() {}

  ngOnInit() {
    this.searchService.searchParams$
      .pipe(
        debounceTime(200),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
      .subscribe((params) => {
        this.pagination.pageSize = params.pageSize;
        this.pagination.pageNo = params.pageNumber;
        this.getProducts();
      });
  }

  getProducts() {
    this.loader.showLoader();
    this.productData = [];
    const url = this.searchService.querySearchEndpoint();
    this.apiService
      .get(url)
      .pipe(
        finalize(() => {
          this.loader.hideLoader();
        })
      )
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.productData = res.data;
            this.pagination.totalRecords = res.totalRecords;
            this.searchService.isDataFound.next(
              !!(this.productData && this.productData.length)
            );
          }
        },
        error: (error: any) => {
          console.error(error);
          this.searchService.isDataFound.next(false);
        },
      });
  }

  getClass(input: number) {
    return getDynamicClass(input);
  }

  onPageChange(pageNumber: number): void {
    this.searchService.updateParams({
      pageNumber: pageNumber,
    });
  }
}
