import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  inject,
  Input,
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
import { register } from 'swiper/element/bundle';
import {
  LucideAngularModule,
  Milestone,
  Users,
  ChevronRight,
  Tag,
  ShoppingBag,
  Award,
} from 'lucide-angular';

// Register Swiper custom elements
register();

@Component({
  selector: 'app-products-carousel',
  templateUrl: './products-carousel.component.html',
  styleUrls: ['./products-carousel.component.css'],
  imports: [CommonModule, RouterLink, LucideAngularModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductsCarouselComponent implements OnInit, OnChanges {
  @Input() committeeId: number = 0;
  @Input() districtId: number = 0;
  @Input() homestayId?: number;
  @Input() type: 'nearby' | 'related' | 'random' = 'random';
  @Output() totalResults = new EventEmitter<number>();
  @Input() notIncludeId?: number;
  public getClass = getDistrictClass;
  public getProfileImage = getProfileImage;
  public handleImageError = handleImageError;
  private apiService = inject(ApiService);
  products: any[] = [];
  icons = {
    ArrowIcon: ChevronRight,
    DistrictIcon: Milestone,
    CommitteeIcon: Users,
    TagIcon: Tag,
    ProductIcon: ShoppingBag,
    Award: Award,
  };

  ngOnInit() {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadData();
  }

  private loadData(): void {
    switch (this.type) {
      case 'random':
        this.getProductsRandom();
        break;
      case 'related':
        if (this.committeeId) {
          this.getProductsRelated(this.committeeId, undefined);
        } else if (this.homestayId) {
          this.getProductsRelated(undefined, this.homestayId);
        }
        break;
      case 'nearby':
        if (this.districtId) {
          this.getProductsNearby(this.districtId);
        }
        break;
    }
  }

  getProductsRandom(): void {
    this.apiService
      .getPaginatedData(paginatedEndpoints.products, 1, 4)
      .subscribe({
        next: (data: any) => {
          if (
            data &&
            data.data &&
            Array.isArray(data.data) &&
            data.data.length > 0
          ) {
            let products = data.data;
            if (this.notIncludeId) {
              products = products.filter(
                (product: any) => product.productId !== this.notIncludeId
              );
            }
            this.products = products;
            this.totalResults.emit(this.products.length);
          }
        },
        error: (error: any) => {
          console.error('Error fetching Products:', error);
          this.products = [];
          this.totalResults.emit(0);
        },
        complete: () => {
          console.log('Products fetch completed.');
        },
      });
  }

  getProductsRelated(committeeId?: number, homestayId?: number): void {
    let param: string;
    if (committeeId != null) {
      param = `committeeId=${committeeId}`;
    } else if (homestayId != null) {
      param = `homestayId=${homestayId}`;
    } else {
      // fallback: do nothing
      return;
    }
    this.apiService.getData(paginatedEndpoints.related, param).subscribe({
      next: (data: any) => {
        if (data && data.data) {
          let products = data.data.products;
          if (this.notIncludeId) {
            products = products.filter(
              (product: any) => product.productId !== this.notIncludeId
            );
          }
          this.products = products;
          this.totalResults.emit(this.products.length);
        } else {
          this.products = [];
          this.totalResults.emit(0);
        }
      },
      error: (error: any) => {
        console.error('Error fetching related products:', error);
        this.products = [];
        this.totalResults.emit(0);
      },
      complete: () => {
        console.log('Related products fetch completed.');
      },
    });
  }

  getProductsNearby(districtId: any): void {
    this.apiService
      .getData(paginatedEndpoints.nearby, `districtId=${districtId}`)
      .subscribe({
        next: (data: any) => {
          if (data && data.data) {
            let products = data.data.products;
            if (this.notIncludeId) {
              products = products.filter(
                (product: any) => product.productId !== this.notIncludeId
              );
            }
            this.products = products;
            this.totalResults.emit(this.products.length);
          } else {
            this.products = [];
            this.totalResults.emit(0);
          }
        },
        error: (error: any) => {
          console.error('Error fetching nearby products:', error);
          this.products = [];
          this.totalResults.emit(0);
        },
        complete: () => {
          console.log('Nearby products fetch completed.');
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
