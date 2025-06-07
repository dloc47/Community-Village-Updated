import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { paginatedEndpoints } from '../../globalEnums.enum';
import { getProfileImage, getDistrictClass } from '../../utils/utils';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { LucideAngularModule,Milestone,Users,ChevronRight,Tag} from 'lucide-angular';

// Register Swiper custom elements
register();

@Component({
  selector: 'app-products-carousel',
  templateUrl: './products-carousel.component.html',
  styleUrls: ['./products-carousel.component.css'],
  imports: [CommonModule, RouterLink,LucideAngularModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductsCarouselComponent implements OnInit {
  private apiService = inject(ApiService);
  products: any[] = [];
  icons={
    ArrowIcon :ChevronRight,
    DistrictIcon:Milestone,
    CommitteeIcon:Users,
    TagIcon:Tag,

  }

  ngOnInit() {
    this.getProducts();
  }

  getClass(region: string): string {
    return getDistrictClass(region);
  }

  getProducts(): void {
    this.apiService.getPaginatedData(paginatedEndpoints.products, 1, 4).subscribe({
      next: (data: any) => {
        if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
          this.products = data.data;
        }
      },
      error: (error: any) => {
        console.error('Error fetching Products:', error);
        this.products = [];
      },
      complete: () => {
        console.log('Products fetch completed.');
      }
    });
  }

  getProfileImage(images: any[]): string {
    return getProfileImage(images);
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}