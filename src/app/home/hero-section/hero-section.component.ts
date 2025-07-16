import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Validators, FormsModule } from '@angular/forms';
import { GlobalEnums } from '../../utils/globalEnums.enum';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  LucideAngularModule,
  MapPin,
  Users,
  Tag,
  ChevronRight,
  ShoppingBag,
  HousePlus,
  CalendarDays,
  TextSearch,
  ListFilter,
  Binoculars,
  Search,
  Milestone,
  ChevronDown,
  X,
  CodeSquare,
} from 'lucide-angular';
import {
  EntityType,
  DistrictCode,
  SearchService,
} from '../../../services/search.service';

interface SearchParams {
  entityType: EntityType;
  districtCode: DistrictCode;
  committeeId: string;
  searchText: string;
}

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, LucideAngularModule],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css',
})
export class HeroSectionComponent implements OnInit, AfterViewInit {
  private apiService = inject(ApiService);
  private router = inject(Router);
  private searchService = inject(SearchService);

  counts: any = {
    committees: '00',
    homestays: '00',
    activities: '00',
    products: '00',
    events: '00',
  };

  icons = {
    TagIcon: Tag,
    ArrowIcon: ChevronRight,
    TextSearchIcon: TextSearch,
    FilterIcon: ListFilter,
    VillageIcon: Users,
    ActivityIcon: Binoculars,
    ProductIcon: ShoppingBag,
    EventIcon: CalendarDays,
    LocationIcon: Milestone,
    SearchIcon: Search,
    DropdownIcon: ChevronDown,
    HomestayIcon: HousePlus,
  };

  committees: any;
  districts: any;

  SearchParams: SearchParams = {
    entityType: 'Committee',
    districtCode: '',
    committeeId: '',
    searchText: '',
  };

  validSearchForm: boolean = true;

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.fetchEntityCounts();
    this.loadDistricts();
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
    this.SearchParams.committeeId = '';

    this.apiService.getData('website/committees').subscribe({
      next: (res: any) => {
        if (res) {
          this.committees = res.filter(
            (item: any) =>
              String(item.districtId) === String(this.SearchParams.districtCode)
          );
        }
      },
      error(error: any) {
        console.error('Error Fetching Committees', error);
      },
    });
  }

  fetchEntityCounts(): void {
    this.apiService
      .getData('website/entity-counts')
      .pipe(
        catchError((error) => {
          console.error('Error fetching entity counts:', error);
          return of({});
        })
      )
      .subscribe({
        next: (data: any) => this.handleEntityData(data),
        error: (error) => {
          console.error('Subscription error:', error);
        },
        complete: () => {
          console.log('Entity count fetch completed.');
        },
      });
  }

  searchAndRedirect() {
    this.searchService.updateParams({
      searchText: this.SearchParams.searchText,
      committeeId: this.SearchParams.committeeId,
      districtCode: this.SearchParams.districtCode,
    });
    this.router.navigate([
      '/',
      this.SearchParams.entityType.toLocaleLowerCase(),
    ]);
  }

  handleEntityData(data: any): void {
    try {
      this.counts = this.formatCounts(data);
    } catch (error) {
      console.error('Error formatting entity counts:', error);
      this.counts = {};
    }
  }

  formatCounts(data: any): Record<string, string> {
    if (!data || typeof data !== 'object') {
      return {};
    }
    const formattedData: Record<string, string> = {};
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        formattedData[key] = this.formatNumber(data[key]);
      }
    }
    return formattedData;
  }

  formatNumber(value: number | string | null | undefined): string {
    if (value === null || value === undefined) {
      return '00';
    }
    let strValue = value.toString().trim();
    if (!/^\d+$/.test(strValue)) {
      return '00';
    }
    return strValue.length === 1 ? '0' + strValue : strValue;
  }
}
