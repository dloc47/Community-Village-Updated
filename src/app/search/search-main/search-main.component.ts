import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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
export class SearchMainComponent implements OnInit {
  private searchService = inject(SearchService);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

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

  districts: any;
  committees: any = [];

  constructor() {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.entityType = this.toTitleCase(data['type'] || 'Committee');
      this.updateParams();

      this.searchService.searchParams$.subscribe((params) => {
        this.appliedFilters = params;
      });

      //load districts
      this.loadDistricts();
    });
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
    this.apiService.getData('website/committees').subscribe({
      next: (res: any) => {
        if (res) {
          this.committees = res.filter(
            (item: any) => String(item.districtId) === String(this.districtCode)
          );
        }
      },
      error(error: any) {
        console.error('Error Fetching Committees', error);
      },
    });
  }

  navigateToType(type: string): void {
    this.router.navigate(['/', type]);
  }

  toTitleCase(text: string): any {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
}
