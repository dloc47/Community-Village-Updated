import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  inject,
  Output,
  EventEmitter,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { paginatedEndpoints } from '../../utils/globalEnums.enum';
import {
  getProfileImage,
  getDistrictClass,
  handleImageError,
} from '../../utils/utils';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  LucideAngularModule,
  Milestone,
  Users,
  ChevronRight,
  Tag,
  Award,
} from 'lucide-angular';

@Component({
  selector: 'app-committee-carousel',
  templateUrl: './committee-carousel.component.html',
  styleUrls: ['./committee-carousel.component.css'],
  imports: [CommonModule, RouterLink, LucideAngularModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CommitteeCarouselComponent implements OnInit, OnChanges {
  @Input() type: string = '';
  @Input() id: string = '';
  @Output() totalResults = new EventEmitter<number>();
  @Input() notIncludeId?: number;

  public getDistrictClass = getDistrictClass;
  public getProfileImage = getProfileImage;
  public handleImageError = handleImageError;
  private apiService = inject(ApiService);
  villages: any[] = [];
  icons = {
    ArrowIcon: ChevronRight,
    DistrictIcon: Milestone,
    UserIcon: Users,
    TagIcon: Tag,
    Award: Award,
  };

  ngOnInit(): void {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id'] && !changes['id'].firstChange) {
      this.loadData();
    }
  }

  private loadData(): void {
    if (this.type === 'random') {
      this.getCommitteesRandom();
    } else if (this.type === 'nearby') {
      this.getCommitteeNearby();
    } else if (this.type === 'related') {
      this.getCommitteeRelated();
    }
  }

  getCommitteesRandom(): void {
    this.apiService
      .getPaginatedData(paginatedEndpoints.villages, 1, 30)
      .subscribe({
        next: (data: any) => {
          if (data && data.data && data.data.length > 0) {
            let villages = data.data;
            if (this.notIncludeId != null) {
              villages = villages.filter(
                (village: any) => village.villageId !== this.notIncludeId
              );
            }
            this.villages = villages;
            this.totalResults.emit(this.villages.length);
          }
        },
        error: (error: any) => {
          console.error('Error fetching Villages:', error);
          this.villages = [];
          this.totalResults.emit(0);
        },
        complete: () => {
          console.log('Villages fetch completed.');
        },
      });
  }

  getCommitteeNearby() {
    this.apiService
      .getData(paginatedEndpoints.nearby, 'districtId=' + this.id)
      .subscribe({
        next: (data: any) => {
          if (data && data.committees) {
            let villages = data.committees;
            if (this.notIncludeId) {
              villages = villages.filter(
                (village: any) => village.villageId !== this.notIncludeId
              );
            }
            this.villages = villages;
            this.totalResults.emit(this.villages.length);
          } else {
            this.villages = [];
            this.totalResults.emit(0);
          }
        },
        error: (error: any) => {
          console.error('Error fetching nearby Villages:', error);
          this.villages = [];
          this.totalResults.emit(0);
        },
      });
  }

  getCommitteeRelated() {
    this.apiService
      .getData(paginatedEndpoints.related, 'committeeId=' + this.id)
      .subscribe({
        next: (data: any) => {
          if (data && data.data && data.data.committees) {
            let villages = data.data.committees;
            if (this.notIncludeId) {
              villages = villages.filter(
                (village: any) => village.villageId !== this.notIncludeId
              );
            }
            this.villages = villages;
            this.totalResults.emit(this.villages.length);
          } else {
            this.villages = [];
            this.totalResults.emit(0);
          }
          console.log('Related committees:', this.villages);
        },
        error: (error: any) => {
          console.error('Error fetching related Villages:', error);
          this.villages = [];
          this.totalResults.emit(0);
        },
      });
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
