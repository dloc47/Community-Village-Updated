import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  getDistrictClass,
  getProfileImage,
  handleImageError,
} from '../../utils/utils';
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchService } from '../../../services/search.service';
import {
  LucideAngularModule,
  ChevronRight,
  Milestone,
  Users,
  Tag,
  Award,
} from 'lucide-angular';
import { ApiService } from '../../../services/api.service';
import { finalize, debounceTime, distinctUntilChanged } from 'rxjs';
import { LoaderService } from '../../../services/loader.service';

@Component({
  selector: 'app-search-committee',
  templateUrl: './search-committee.component.html',
  styleUrls: ['./search-committee.component.css'],
  imports: [CommonModule, RouterLink, NgxPaginationModule, LucideAngularModule],
})
export class SearchCommitteeComponent implements OnInit {
  private searchService = inject(SearchService);
  private apiService = inject(ApiService);
  private loader = inject(LoaderService);
  public handleImageError = handleImageError;
  public getDistrictClass = getDistrictClass;
  public getProfileImage = getProfileImage;

  entityData: any;
  pagination = {
    pageNo: 1,
    totalRecords: 0,
    pageSize: 0,
  };

  // Define icons object
  icons = {
    ArrowIcon: ChevronRight,
    DistrictIcon: Milestone,
    CommitteeIcon: Users,
    TagIcon: Tag,
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
        this.getCommittees();
      });
  }

  getCommittees() {
    this.loader.showLoader();
    this.entityData = [];
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
            this.entityData = res.data;
            this.pagination.totalRecords = res.totalRecords;
            this.searchService.isDataFound.next(
              this.entityData && this.entityData.length
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
