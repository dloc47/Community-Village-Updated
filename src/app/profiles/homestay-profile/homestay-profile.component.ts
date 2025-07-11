import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { getByIDEndpoints, placeholder } from '../../utils/globalEnums.enum';
import { CommonModule } from '@angular/common';
import { register } from 'swiper/element/bundle';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
  Home,
  Check,
  AppWindow,
  Bed,
  Users,
  Tags,
  CreditCard,
  Share2,
  Banknote,
  Facebook,
  Instagram,
} from 'lucide-angular';
import { HomestaysCarouselComponent } from '../../carousels/homestays-carousel/homestays-carousel.component';
import { ProductsCarouselComponent } from '../../carousels/products-carousel/products-carousel.component';
import { EventsCarouselComponent } from '../../carousels/events-carousel/events-carousel.component';
import { ActivitiesCarouselComponent } from '../../carousels/activities-carousel/activities-carousel.component';

// Register Swiper custom elements
register();

@Component({
  selector: 'app-homestay-profile',
  templateUrl: './homestay-profile.component.html',
  styleUrls: ['./homestay-profile.component.css'],
  imports: [
    CommonModule,
    LucideAngularModule,
    HomestaysCarouselComponent,
    ActivitiesCarouselComponent,
    ProductsCarouselComponent,
    EventsCarouselComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomestayProfileComponent implements OnInit, AfterViewInit {
  loading: boolean = false;
  noDataFound: boolean = false;
  homestayInfo: any = [];
  placeholder: placeholder = placeholder.image;
  private _smallImages: any[] = [];
  mainImage: any = null;
  public handleImageError = handleImageError;

  // Carousel counts for section visibility
  activitiesCount = 0;
  productsCount = 0;
  eventsCount = 0;
  homestaysCount = 0;

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
    Tags: Tags,
    Landmark: Landmark,
    Contact: Contact,
    Home: Home,
    Check: Check,
    Bed: Bed,
    Users: Users,
    CreditCard: CreditCard,
    Share2: Share2,
    AppWindow: AppWindow,
    Facebook: Facebook,
    Instagram: Instagram,
    Banknote: Banknote,
  };

  private apiService = inject(ApiService);

  constructor(private router: ActivatedRoute) {}

  ngOnInit() {
    this.getFirstSegment();
  }

  ngAfterViewInit(): void {
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

  get smallImages(): any[] {
    return this._smallImages;
  }

  getDistrictClasses(region: string): string {
    return getDistrictClass(region);
  }

  swapImage(image: any): void {
    if (image) {
      const currentIndex = this._smallImages.findIndex((img) => img === image);
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

  getFirstSegment(): boolean {
    let segmentFound = false;
    this.router.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loadHomestayData(parseInt(id));
        segmentFound = true;
      } else {
        console.log('No valid ID found in route.');
      }
    });
    return segmentFound;
  }

  loadHomestayData(id: number): void {
    this.loading = true;
    this.apiService.getDataById<any>(getByIDEndpoints.homestays, id).subscribe({
      next: (data: any) => {
        if (data) {
          this.homestayInfo = data;
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
    this.loading = false;
  }

  getSocialMediaLinks(): { name: string; url: string; icon: any }[] {
    const links = [];
    if (this.homestayInfo.socialMediaLinks?.facebook) {
      links.push({
        name: 'Facebook',
        url: this.homestayInfo.socialMediaLinks.facebook,
        icon: this.icons.Facebook,
      });
    }
    if (this.homestayInfo.socialMediaLinks?.instagram) {
      links.push({
        name: 'Instagram',
        url: this.homestayInfo.socialMediaLinks.instagram,
        icon: this.icons.Instagram,
      });
    }
    return links;
  }
}
