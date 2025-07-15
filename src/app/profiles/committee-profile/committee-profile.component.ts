import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { ApiService } from '../../../services/api.service';
import { getByIDEndpoints, placeholder } from '../../utils/globalEnums.enum';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { register } from 'swiper/element/bundle';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { handleImageError, getDistrictClass } from '../../utils/utils';
import {
  LucideAngularModule,
  ArrowLeft,
  ArrowRight,
  MapPin,
  Dot,
  Star,
  User,
  Award,
  Globe,
  Compass,
  X,
  Phone,
  Mail,
  Tag,
  Landmark,
  Contact,
  Tags,
} from 'lucide-angular';
import { HomestaysCarouselComponent } from '../../carousels/homestays-carousel/homestays-carousel.component';
import { ProductsCarouselComponent } from '../../carousels/products-carousel/products-carousel.component';
import { EventsCarouselComponent } from '../../carousels/events-carousel/events-carousel.component';
import { ActivitiesCarouselComponent } from '../../carousels/activities-carousel/activities-carousel.component';
import { CommitteeCarouselComponent } from '../../carousels/committee-carousel/committee-carousel.component';

// Register Swiper custom elements
register();
@Component({
  selector: 'app-committee-profile',
  templateUrl: './committee-profile.component.html',
  styleUrls: ['./committee-profile.component.css'],
  imports: [
    CommonModule,
    NgxPaginationModule,
    FormsModule,
    LucideAngularModule,
    CommitteeCarouselComponent,
    HomestaysCarouselComponent,
    ProductsCarouselComponent,
    ActivitiesCarouselComponent,
    EventsCarouselComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CommitteeProfileComponent implements OnInit {
  districtId: any;

  private apiService = inject(ApiService);
  public handleImageError = handleImageError;
  committeeInfo: any = [];
  private _smallImages: any[] = [];
  mainImage: any = null;
  Math = Math;

  get smallImages(): any[] {
    return this._smallImages;
  }

  get galleryImages(): any[] {
    return [this.mainImage, ...this._smallImages].filter((img) => img !== null);
  }

  loading: boolean = false;
  noDataFound: boolean = false;
  imgPlaceholder = placeholder.image;

  // Default coordinates for Sikkim state center
  latitude: string = '27.543024123517547';
  longitude: string = '88.41507197403864';
  zoom: number = 8; // Reduced zoom to show more of the state
  mapType: string = 'k'; // Default to satellite view

  get mapUrl(): string {
    return `https://maps.google.com/maps?q=${this.latitude},${this.longitude}&z=${this.zoom}&t=${this.mapType}&output=embed`;
  }

  get safeMapUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.mapUrl);
  }

  isMapModalOpen: boolean = false;

  icons = {
    ArrowLeft: ArrowLeft,
    ArrowRight: ArrowRight,
    MapPin: MapPin,
    Dot: Dot,
    Star: Star,
    User: User,
    Award: Award,
    Globe: Globe,
    Compass: Compass,
    X: X,
    Phone: Phone,
    Mail: Mail,
    Tag: Tag,
    Landmark: Landmark,
    Contact: Contact,
    Tags: Tags,
  };

  constructor(
    private sanitizer: DomSanitizer,
    private router: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getFirstSegment();
  }

  getFirstSegment(): boolean {
    let segmentFound = false;
    this.router.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loadCommitteeData(id);
        segmentFound = true;
      } else {
        console.log('No valid ID found in route.');
      }
    });
    return segmentFound;
  }

  isBoxVisible: boolean = true;
  toggleDivs(divType: string) {
    if (divType == 'villageDetails') this.isBoxVisible = true;
    else if (divType == 'leaderShip') this.isBoxVisible = false;
  }

  swapImage(image: any): void {
    if (image && this._smallImages.includes(image)) {
      const currentIndex = this._smallImages.indexOf(image);
      if (currentIndex !== -1) {
        // Add fade-in animation class
        const mainImageElement = document.querySelector(
          '.main-image-container img'
        );
        if (mainImageElement) {
          mainImageElement.classList.add('fade-in');
          setTimeout(() => {
            mainImageElement.classList.remove('fade-in');
          }, 500);
        }

        // Swap the main image with the selected image
        const temp = this.mainImage;
        this.mainImage = image;
        this._smallImages[currentIndex] = temp;
      }
    }
  }

  nextImage(event: Event): void {
    event.stopPropagation();
    if (this._smallImages.length > 0) {
      // Add fade-in animation class
      const mainImageElement = document.querySelector(
        '.main-image-container img'
      );
      if (mainImageElement) {
        mainImageElement.classList.add('fade-in');
        setTimeout(() => {
          mainImageElement.classList.remove('fade-in');
        }, 500);
      }

      const firstImage = this._smallImages[0];
      this._smallImages.shift();
      this._smallImages.push(this.mainImage);
      this.mainImage = firstImage;
    }
  }

  previousImage(event: Event): void {
    event.stopPropagation();
    if (this._smallImages.length > 0) {
      // Add fade-in animation class
      const mainImageElement = document.querySelector(
        '.main-image-container img'
      );
      if (mainImageElement) {
        mainImageElement.classList.add('fade-in');
        setTimeout(() => {
          mainImageElement.classList.remove('fade-in');
        }, 500);
      }

      const lastImage = this._smallImages[this._smallImages.length - 1];
      this._smallImages.pop();
      this._smallImages.unshift(this.mainImage);
      this.mainImage = lastImage;
    }
  }

  loadCommitteeData(id: string): void {
    this.loading = true;
    this.apiService
      .getDataById<any>(getByIDEndpoints.villages, id)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.committeeInfo = data;
            this.districtId = data.districtId;
            // Set first image as main image
            this.mainImage = data.images?.[0] || null;
            // Store remaining images as small images
            this._smallImages = data.images?.slice(1) || [];

            // Update map coordinates if available, but keep zoom level for state view
            if (data.latitude && data.longitude) {
              this.latitude = data.latitude ? data.latitude : this.latitude;
              this.longitude = data.longitude ? data.longitude : this.longitude;
              // Keep zoom level at 8 to show state context
              this.zoom = 8;
            }
          } else {
            this.handleNoDataFound();
          }
        },
        error: (error: any) => {
          console.error('Error fetching data:', error);
          this.handleNoDataFound();
        },
      });
  }

  handleNoDataFound() {
    this.noDataFound = true;
  }

  openMapModal(): void {
    this.isMapModalOpen = true;
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  closeMapModal(): void {
    this.isMapModalOpen = false;
    document.body.style.overflow = ''; // Restore background scrolling
  }

  getDistrictClasses(region: string): string {
    return getDistrictClass(region);
  }

  // Carousel counts for hiding/showing sections
  homestaysCount: number = 0;
  activitiesCount: number = 0;
  eventsCount: number = 0;
  productsCount: number = 0;
  committeesCount: number = 0;
}
