import { Component, inject, OnInit } from '@angular/core';
import { getByIDEndpoints, placeholder } from '../../globalEnums.enum';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { register } from 'swiper/element/bundle';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// Register Swiper custom elements
register();

@Component({
  selector: 'app-product-profle',
  templateUrl: './product-profle.component.html',
  styleUrls: ['./product-profle.component.css'],
  imports:[CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductProfleComponent implements OnInit {
    loading: boolean = false;
    noDataFound: boolean = false;
    productInfo: any = [];
    placeholder: placeholder = placeholder.image;
    showModal: boolean = false;
    selectedImage: string = '';
    
    private apiService = inject(ApiService);
    
    constructor(
        private router: ActivatedRoute
    ) { }
    
    ngOnInit() {
        this.getFirstSegment();
    }
    
    getFirstSegment(): boolean {
        let segmentFound = false;
        this.router.paramMap.subscribe((params) => {
            const id = params.get('id');
            if (id) {
                this.loadProductbyID(parseInt(id));
                segmentFound = true;
            } else {
                console.log('No valid ID found in route.');
            }
        });
        return segmentFound;
    }
    
    loadProductbyID(id: number): void {
        this.loading = true;
        this.apiService
            .getDataById<any>(getByIDEndpoints.products, id)
            .subscribe({
                next: (data: any) => {
                    if (data) {
                        this.productInfo = data;
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

    openImageModal(imageUrl: string): void {
        this.selectedImage = imageUrl;
        this.showModal = true;
        document.body.style.overflow = 'hidden';
    }

    closeModal(): void {
        this.showModal = false;
        this.selectedImage = '';
        document.body.style.overflow = 'auto';
    }

    onModalClick(event: Event): void {
        event.stopPropagation();
    }
}
