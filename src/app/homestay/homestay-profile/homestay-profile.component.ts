import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { initializeOwlCarousel, destroyOwlInstance } from '../../utils/utils';
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

  swapImage(clickedImage: any): void {
    if (this.mainImage) {
      this._smallImages.push(this.mainImage);
    }
    this.mainImage = clickedImage;
    this._smallImages = this._smallImages.filter(img => img !== clickedImage);
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
