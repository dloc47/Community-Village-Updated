import { Component, OnInit, inject } from '@angular/core';
import {
  getDistrictClass,
  getProfileImage,
  handleImageError,
} from '../../utils/utils';
import { SearchService } from '../../../services/search.service';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  MapPin,
  Users,
  Tag,
  Binoculars,
  ChevronRight,
  HousePlus,
  Award,
} from 'lucide-angular';
import { ApiService } from '../../../services/api.service';
import { LoaderService } from '../../../services/loader.service';
import { finalize, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-activity',
  templateUrl: './search-activity.component.html',
  styleUrls: ['./search-activity.component.css'],
  imports: [CommonModule, RouterLink, NgxPaginationModule, LucideAngularModule],
})
export class SearchActivityComponent implements OnInit {
  private searchService = inject(SearchService);
  private apiService = inject(ApiService);
  private loader = inject(LoaderService);
  public getProfileImage = getProfileImage;
  public getDistrictClass = getDistrictClass;
  public handleImageError = handleImageError;

  activityData: any[] = [];
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
    Users: Users,
    HouseIcon: HousePlus,
    BinocularsIcon: Binoculars,
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
        this.getActivities();
      });
  }

  getActivities() {
    this.loader.showLoader();
    this.activityData = [];
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
            this.activityData = res.data;
            this.pagination.totalRecords = res.totalRecords;
            this.searchService.isDataFound.next(
              !!(this.activityData && this.activityData.length)
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
