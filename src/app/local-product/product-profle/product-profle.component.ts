import { Component, inject, OnInit } from '@angular/core';
import { initializeOwlCarousel,destroyOwlInstance } from '../../utils/utils';
import { getByIDEndpoints, placeholder } from '../../globalEnums.enum';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-profle',
  templateUrl: './product-profle.component.html',
  styleUrls: ['./product-profle.component.css'],
  imports:[CommonModule]
})
export class ProductProfleComponent implements OnInit {
    loading :boolean=false;
    noDataFound:boolean=false;
    productInfo:any=[]
    placeholder:placeholder=placeholder.image
    
    private apiService = inject(ApiService)
    
      constructor(
        private router:ActivatedRoute
      ) { }
    
       ngOnInit() {
         this.getFirstSegment();
      }
    
      getFirstSegment(): boolean {
        let segmentFound = false;
    
        // Get route parameters using ActivatedRoute
        this.router.paramMap.subscribe((params) => {
          const id = params.get('id');
    
          if (id) {
            // If ID is present, load committee data
            this.loadProductbyID(parseInt(id)); // Load data with ID
            segmentFound = true;
          } else {
            // Fallback if no ID
            console.log('No valid ID found in route.');
          }
        });
    
        return segmentFound;
      }
    
    
      
      // ✅ Fetch  data  
      loadProductbyID(id:number): void {
        this.loading = true;
        this.apiService
          .getDataById<any>(getByIDEndpoints.products, id)
          .subscribe({
            next: (data: any) => {
              console.log(data);
              
              // Check if data is valid
              if (data) {
                // Enrich with additional properties (no need for mapping here)
                this.productInfo =   data;
    
                setTimeout(() => {
                  initializeOwlCarousel('.productImageSwiper',false,true,1,false,[1,1,1])
                }, 300);
    
              } else {
                // Handle no data scenario
                this.handleNoDataFound();
              }
            },
            error: (error: any) => {
              console.error('Error fetching data:', error);
              this.handleNoDataFound(); // Handle error gracefully
            },
            complete: () => {
              this.loading = false;
              console.log('Data fetch completed:', this.productInfo);
            },
          });
      }
      
      // Handle no data scenario
      handleNoDataFound() {
        this.noDataFound = true;
        this.loading=false;
      }
      

      
}
