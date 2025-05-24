import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { getDynamicClass,initializeOwlCarousel,destroyOwlInstance, getProfileImage, getDistrictClass } from '../../utils/utils';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { paginatedEndpoints } from '../../globalEnums.enum';

@Component({
  selector: 'app-products-carousel',
  templateUrl: './products-carousel.component.html',
  styleUrls: ['./products-carousel.component.css'],
  imports:[CommonModule,RouterLink]
})
export class ProductsCarouselComponent implements OnInit, AfterViewInit, OnDestroy  {

  private apiService = inject(ApiService)

  products:any[]=[];

  ngOnInit() {
    this.getProducts()
  }

  ngAfterViewInit(): void {
  
  }

  ngOnDestroy() {
    destroyOwlInstance('.product-carousel')
  }

  getClass(region: string): string {
    return getDistrictClass(region);
  }

  getProducts(): void {
    this.apiService.getPaginatedData(paginatedEndpoints.products,1,4).subscribe({
      next: (data: any) => {
     
        if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
          this.products = data.data
        }

        if (this.products.length > 0) {
          setTimeout(() => {
            initializeOwlCarousel('.product-carousel',true,true,24,false,[1,3,5]);
          }, 300);
        }

      },
      error: (error:any) => {
        console.error('Error fetching Products:', error);
        // Optionally, set a default value or handle the error
        this.products = []; // Fallback to an empty array
      },
      complete: () => {
        // Optional: Handle completion logic if needed
        console.log('Products fetch completed.');
      }
    });
  }

  getProfileImage(images:any[]):string{
    return getProfileImage(images)
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}