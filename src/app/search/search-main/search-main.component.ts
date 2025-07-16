import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SearchService } from '../../../services/search.service';
import { SearchHomestayComponent } from '../search-homestay/search-homestay.component';
import { SearchActivityComponent } from '../search-activity/search-activity.component';
import { SearchProductComponent } from '../search-product/search-product.component';
import { SearchEventComponent } from '../search-event/search-event.component';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityType, DistrictCode } from '../../../services/search.service';
import {
  LucideAngularModule,
  ShoppingBag,
  Users,
  X,
  Search,
  ChevronDown,
  Milestone,
  Binoculars,
  HousePlus,
  CalendarDays,
  TextSearch,
  ListFilter,
} from 'lucide-angular';
import { SearchCommitteeComponent } from '../search-committee/search-committee.component';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-search-main',
  templateUrl: './search-main.component.html',
  styleUrls: ['./search-main.component.css'],
  imports: [
    CommonModule,
    SearchCommitteeComponent,
    SearchHomestayComponent,
    SearchActivityComponent,
    SearchProductComponent,
    SearchEventComponent,
    LucideAngularModule,
    FormsModule,
  ],
})
export class SearchMainComponent implements OnInit, OnDestroy {
  private searchService = inject(SearchService);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private platformId = inject(PLATFORM_ID);

  page: any;

  // Define icons object
  icons = {
    VillageIcon: Users,
    ActivityIcon: Binoculars,
    ProductIcon: ShoppingBag,
    EventIcon: CalendarDays,
    LocationIcon: Milestone,
    SearchIcon: Search,
    TextSearchIcon: TextSearch,
    ClearIcon: X,
    DropdownIcon: ChevronDown,
    HomestayIcon: HousePlus,
    FilterIcon: ListFilter,
  };

  entityType: EntityType = 'Committee';
  districtCode: DistrictCode = '';
  committeeId: string = '';
  searchText: string = '';

  appliedFilters: any;

  isData$ = this.searchService.isDataFound$;

  updateParams() {
    this.searchService.updateParams({
      entityType: this.entityType,
      districtCode: this.districtCode,
      committeeId: this.committeeId,
      searchText: this.searchText,
      pageNumber: 1, // Reset to page 1 when filters change
    });
  }

  resetFilters() {
    this.districtCode = '';
    this.committeeId = '';
    this.searchText = '';

    this.updateParams();
  }

  onCommitteeChange() {
    this.updateParams();
  }

  districts: any;
  committees: any = [];

  constructor() {}

  ngOnInit() {
    // Subscribe to route data to set entity type and update params ONCE per route change
    this.route.data.subscribe((data) => {
      this.entityType = this.toTitleCase(data['type'] || 'Committee');
      this.searchService.updateParams({
        entityType: this.entityType,
      });
    });

    // Subscribe to searchParams$ to update local state and scroll, but DO NOT call updateParams() here
    this.searchService.searchParams$.subscribe((params) => {
      this.appliedFilters = params;
      // Update local state for UI binding only; do not trigger updateParams() here
      this.districtCode = params.districtCode;
      this.searchText = params.searchText;
      this.committeeId = params.committeeId;

      // scroll to top whenever searchParameters changes
      if (isPlatformBrowser(this.platformId)) {
        const scrollTop =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          0;

        if (scrollTop > 10) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    });

    // load districts & committees initially
    this.loadDistricts();
    this.loadCommittees();
  }

  loadDistricts(): void {
    this.apiService.getData('website/districts').subscribe({
      next: (res: any) => {
        if (res) {
          this.districts = res;
        }
      },
      error(error: any) {
        console.error('Error Fetching Districts', error);
      },
    });
  }

  loadCommittees(): void {
    this.committees = [];
    this.committeeId = '';
    this.apiService.getData('website/committees').subscribe({
      next: (res: any) => {
        if (res) {
          this.committees = res.filter(
            (item: any) => String(item.districtId) === String(this.districtCode)
          );
          this.committeeId = this.searchService.getCurrentParams().committeeId;
          // Do NOT call updateParams() here
        }
      },
      error(error: any) {
        console.error('Error Fetching Committees', error);
      },
    });
  }

  typingTimeout: any;

  onUserInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    // Clear the previous timeout (if user is still typing)
    clearTimeout(this.typingTimeout);

    // Set a new timeout
    this.typingTimeout = setTimeout(() => {
      this.updateParams();
    }, 700);
  }

  navigateToType(type: string): void {
    this.router.navigate(['/', type]);
  }

  toTitleCase(text: string): any {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  ngOnDestroy(): void {
    this.searchService.resetParams();
  }
}
