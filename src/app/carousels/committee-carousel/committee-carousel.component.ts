import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { paginatedEndpoints } from '../../utils/globalEnums.enum';
import { getProfileImage, getDistrictClass, handleImageError } from '../../utils/utils';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LucideAngularModule, Milestone, Users, ChevronRight, Tag } from 'lucide-angular';

@Component({
  selector: 'app-committee-carousel',
  templateUrl: './committee-carousel.component.html',
  styleUrls: ['./committee-carousel.component.css'],
  imports: [CommonModule, RouterLink, LucideAngularModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CommitteeCarouselComponent implements OnInit, OnChanges   {

  @Input() type: string = '';
  @Input() id: string = '';

  public getDistrictClass = getDistrictClass;
  public getProfileImage = getProfileImage;
  public handleImageError = handleImageError;
  private apiService = inject(ApiService);
  villages: any[] = [];
  icons = {
    ArrowIcon: ChevronRight,
    DistrictIcon: Milestone,
    UserIcon: Users,
    TagIcon: Tag
  }

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
    this.apiService.getPaginatedData(paginatedEndpoints.villages, 1, 30).subscribe({
      next: (data: any) => {
        if (data && data.data && data.data.length > 0) {
          this.villages = data.data;
        }
      },
      error: (error: any) => {
        console.error('Error fetching Villages:', error);
        this.villages = [];
      },
      complete: () => {
        console.log('Villages fetch completed.');
      }
    });
  }
 
  getCommitteeNearby() {
    this.apiService.getData(paginatedEndpoints.nearby, 'districtId=' + this.id).subscribe({
      next: (data: any) => {
        if (data && data.committees) {
          this.villages = data.committees;
        } else {
          this.villages = [];
        }
      },
      error: (error: any) => {
        console.error('Error fetching nearby Villages:', error);
        this.villages = [];
      }
    });
  }

  getCommitteeRelated() {
    this.apiService.getData(paginatedEndpoints.related, 'committeeId=' + this.id).subscribe({
      next: (data: any) => {
        if (data && data.data && data.data.committees) {
          this.villages = data.data.committees;
        } else {
          this.villages = [];
        }
        console.log('Related committees:', this.villages);
      },
      error: (error: any) => {
        console.error('Error fetching related Villages:', error);
        this.villages = [];
      }
    });
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
