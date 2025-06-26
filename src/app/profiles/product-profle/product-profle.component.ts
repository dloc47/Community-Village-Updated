import { Component, inject, OnInit } from '@angular/core';
import { getByIDEndpoints, placeholder } from '../../utils/globalEnums.enum';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { register } from 'swiper/element/bundle';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LucideAngularModule, ArrowLeft, ArrowRight, MapPin, Dot, Star, User,
  Award, Globe, Compass, X, Phone, Mail, Tag, Landmark, Contact, Home, Check,AppWindow,Layers,
   Bed, Users, Tags, CreditCard, Share2, Banknote } from 'lucide-angular';
import { handleImageError, getDistrictClass } from '../../utils/utils';
import { ProductsCarouselComponent } from '../../carousels/products-carousel/products-carousel.component';

// Register Swiper custom elements
register();

@Component({
  selector: 'app-product-profle',
  templateUrl: './product-profle.component.html',
  styleUrls: ['./product-profle.component.css'],
  imports:[CommonModule, LucideAngularModule,
    ProductsCarouselComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductProfleComponent implements OnInit {
    loading: boolean = false;
    noDataFound: boolean = false;
    productInfo: any = [];
    placeholder: placeholder = placeholder.image;
    showModal: boolean = false;
    selectedImage: string = '';
    public handleImageError = handleImageError;
    public getDistrictClasses = getDistrictClass;

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
        AppWindow:AppWindow,
        Banknote: Banknote,
        Layers:Layers
    };
    
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
