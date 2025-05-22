import { Component, inject, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { getByIDEndpoints, placeholder } from '../../globalEnums.enum';
import { CommonModule } from '@angular/common';
import { register } from 'swiper/element/bundle';


register();

@Component({
  selector: 'app-activity-profile',
  standalone: true,
  templateUrl: './activity-profile.component.html',
  styleUrls: ['./activity-profile.component.css'],
  imports:[CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ActivityProfileComponent implements OnInit {

  loading :boolean=false;
  noDataFound:boolean=false;
  activityInfo:any=[]
  placeholder:placeholder=placeholder.image
  showModal: boolean = false;
  selectedImage: string = '';
  
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
          this.loadActivityData(parseInt(id)); // Load data with ID
          segmentFound = true;
        } else {
          // Fallback if no ID
          console.log('No valid ID found in route.');
        }
      });
  
      return segmentFound;
    }
  
  
    
    // ✅ Fetch  data  
    loadActivityData(id:number): void {
      this.loading = true;
      this.apiService
        .getDataById<any>(getByIDEndpoints.activities, id)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            
            // Check if data is valid
            if (data) {
              // Enrich with additional properties (no need for mapping here)
              this.activityInfo = data;
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
            console.log('Data fetch completed:', this.activityInfo);
          },
        });
    }
    
    // Handle no data scenario
    handleNoDataFound() {
      this.noDataFound = true;
      this.loading=false;
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

    // Prevent modal from closing when clicking inside the modal content
    onModalClick(event: Event): void {
      event.stopPropagation();
    }
}
