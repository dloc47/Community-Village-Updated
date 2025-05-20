import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { getByIDEndpoints, placeholder } from '../../globalEnums.enum';
import { CommonModule } from '@angular/common';
import { register } from 'swiper/element/bundle';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// Register Swiper custom elements
register();

@Component({
  selector: 'app-homestay-profile',
  templateUrl: './homestay-profile.component.html',
  styleUrls: ['./homestay-profile.component.css'],
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomestayProfileComponent implements OnInit, AfterViewInit {
  loading: boolean = false;
  noDataFound: boolean = false;
  homestayInfo: any = [];
  placeholder: placeholder = placeholder.image;
  private _smallImages: any[] = [];
  mainImage: any = null;

  private apiService = inject(ApiService);

  constructor(private router: ActivatedRoute) { }

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

  swapImage(image: any): void {
    if (image) {
      const currentIndex = this._smallImages.findIndex(img => img === image);
      if (currentIndex !== -1) {
        // Add fade-in animation class
        const mainImageElement = document.querySelector('.main-image-container img');
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
      const mainImageElement = document.querySelector('.main-image-container img');
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
      const mainImageElement = document.querySelector('.main-image-container img');
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

  openImageGallery(): void {
    // This method can be implemented later to open a full-screen gallery view
    console.log('Opening image gallery...');
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
    this.apiService
      .getDataById<any>(getByIDEndpoints.homestays, id)
      .subscribe({
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
}
