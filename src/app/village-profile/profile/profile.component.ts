import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { ApiService } from '../../../services/api.service';
import { getByIDEndpoints, GlobalEnums, placeholder } from '../../globalEnums.enum';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { SafeUrlPipe } from '../../pipes/SafeUrlPipe.pipe';
import { FormsModule } from '@angular/forms';
import { register } from 'swiper/element/bundle';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { json } from 'stream/consumers';
import { Console } from 'console';

// Register Swiper custom elements
register();

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule, NgxPaginationModule, SafeUrlPipe, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProfileComponent implements OnInit, AfterViewInit {
  
  private apiService = inject(ApiService)
  committeeInfo: any = []
  private _smallImages: any[] = []
  mainImage: any = null

  get smallImages(): any[] {
    return this._smallImages
  }

  loading: boolean = false
  noDataFound: boolean = false
  imgPlaceholder = placeholder.image

  latitude: string = '27.606001';  // default Sikkim
  longitude: string = '88.473167';

  get mapUrl(): string {
    return `https://maps.google.com/maps?q=${this.latitude},${this.longitude}&z=15&t=k&output=embed`;
  }

  constructor(private sanitizer: DomSanitizer,
    private router :ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getFirstSegment();
  }

  ngAfterViewInit(): void {
    // Initialize Swiper after view initialization
    setTimeout(() => {
      const swiperContainer = document.querySelector('swiper-container');
      if (swiperContainer) {
        const swiper = (swiperContainer as any).swiper;
        if (swiper) {
          swiper.update();
          swiper.updateSlides();
        }
      }
    }, 0);
  }

  getFirstSegment(): boolean {
    let segmentFound = false;
    this.router.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loadCommitteeData(parseInt(id));
        segmentFound = true;
      } else {
        console.log('No valid ID found in route.');
      }
    });
    return segmentFound;
  }

  isBoxVisible: boolean = true;
  toggleDivs(divType:string) {
    if(divType=='villageDetails') this.isBoxVisible=true;
    else if(divType=='leaderShip') this.isBoxVisible=false;
  }

  swapImage(clickedImage: any): void {
    if (this.mainImage) {
      // Add current main image to small images
      this._smallImages.push(this.mainImage);
    }
    // Set clicked image as main image
    this.mainImage = clickedImage;
    // Remove clicked image from small images
    this._smallImages = this._smallImages.filter(img => img !== clickedImage);
  }

  loadCommitteeData(id:number): void {
    this.loading = true;
    this.apiService
      .getDataById<any>(getByIDEndpoints.villages, id)
      .subscribe({
        next: (data: any) => {
          this.latitude = data.latitude;
          this.longitude = data.longitude;
          
          if (data) {
            this.committeeInfo = data;
            // Set first image as main image
            this.mainImage = data.images?.[0] || null;
            // Store remaining images as small images
            this._smallImages = data.images?.slice(1) || [];
         

          } else {
            this.handleNoDataFound();
          }
        },
        error: (error: any) => {
          console.error('Error fetching data:', error);
          this.handleNoDataFound();
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  handleNoDataFound() {
    this.noDataFound = true;
  }
}