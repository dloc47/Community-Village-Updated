import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchService } from '../../../services/search.service';
import {
  getProfileImage,
  handleImageError,
  getDistrictClass,
} from '../../utils/utils';
import {
  LucideAngularModule,
  MapPin,
  ChevronRight,
  Users,
  Tag,
  HousePlus,
  Award,
} from 'lucide-angular';
import { ApiService } from '../../../services/api.service';
import { LoaderService } from '../../../services/loader.service';
import { finalize, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-homestay',
  templateUrl: './search-homestay.component.html',
  styleUrls: ['./search-homestay.component.css'],
  imports: [CommonModule, RouterLink, NgxPaginationModule, LucideAngularModule],
})
export class SearchHomestayComponent implements OnInit {
  private searchService = inject(SearchService);
  private apiService = inject(ApiService);
  private loader = inject(LoaderService);
  public getProfileImage = getProfileImage;
  public getDistrictClass = getDistrictClass;
  public handleImageError = handleImageError;

  homestayData: any[] = [];
  pagination = {
    pageNo: 1,
    pageSize: 0,
    totalRecords: 0,
  };

  // Define icons object
  icons = {
    ArrowIcon: ChevronRight,
    DistrictIcon: MapPin,
    CommitteeIcon: Users,
    TagIcon: Tag,
    HomestayIcon: HousePlus,
    Users: Users,
    MapPin: MapPin,
    Award: Award,
  };

  ngOnInit() {
    this.searchService.searchParams$
      .pipe(
        debounceTime(200),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
      .subscribe((params) => {
        this.pagination.pageSize = params.pageSize;
        this.pagination.pageNo = params.pageNumber;
        this.getHomestays();
      });
  }

  getHomestays() {
    this.loader.showLoader();
    this.homestayData = [];
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
            this.homestayData = res.data;
            this.pagination.totalRecords = res.totalRecords;
            this.searchService.isDataFound.next(
              !!(this.homestayData && this.homestayData.length)
            );
          }
        },
        error: (error: any) => {
          console.error(error);
          this.searchService.isDataFound.next(false);
        },
      });
  }

  onPageChange(pageNumber: number): void {
    this.searchService.updateParams({
      pageNumber: pageNumber,
    });
  }
}
