import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  getDynamicClass,
  getProfileImage,
  getDistrictClass,
} from '../../utils/utils';
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchService } from '../../../services/search.service';
import {
  LucideAngularModule,
  MapPin,
  Users,
  Tag,
  ChevronRight,
  Award,
} from 'lucide-angular';
import { ApiService } from '../../../services/api.service';
import { LoaderService } from '../../../services/loader.service';
import { finalize, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-event',
  templateUrl: './search-event.component.html',
  styleUrls: ['./search-event.component.css'],
  imports: [CommonModule, RouterLink, NgxPaginationModule, LucideAngularModule],
})
export class SearchEventComponent implements OnInit {
  private searchService = inject(SearchService);
  private apiService = inject(ApiService);
  private loader = inject(LoaderService);
  public getProfileImage = getProfileImage;
  public getDistrictClass = getDistrictClass;
  public getClass = getDynamicClass;

  eventData: any[] = [];
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
    TagIcon: Tag,
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
        this.getEvents();
      });
  }

  getEvents() {
    this.loader.showLoader();
    this.eventData = [];
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
            this.eventData = res.data;
            this.pagination.totalRecords = res.totalRecords;
            this.searchService.isDataFound.next(
              !!(this.eventData && this.eventData.length)
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

  getDaysLeft(eventDate: string): string {
    const event = new Date(eventDate);
    const today = new Date(); // Use a fresh instance to avoid stale values
    const diffTime = event.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    return daysLeft <= 0 ? 'Ended' : `${daysLeft} days left`;
  }
}
