import { Component, OnInit,inject } from '@angular/core';
import { initializeOwlCarousel,destroyOwlInstance } from '../../utils/utils';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { getByIDEndpoints, placeholder } from '../../globalEnums.enum';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-homestay-profile',
  templateUrl: './homestay-profile.component.html',
  styleUrls: ['./homestay-profile.component.css'],
  imports:[CommonModule]
})
export class HomestayProfileComponent implements OnInit {
loading :boolean=false;
noDataFound:boolean=false;
homestayInfo:any=[]
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
        this.loadHomestayData(parseInt(id)); // Load data with ID
        segmentFound = true;
      } else {
        // Fallback if no ID
        console.log('No valid ID found in route.');
      }
    });

    return segmentFound;
  }


  
  // ✅ Fetch  data  
  loadHomestayData(id:number): void {
    this.loading = true;
    this.apiService
      .getDataById<any>(getByIDEndpoints.homestays, id)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          
          // Check if data is valid
          if (data) {
            // Enrich with additional properties (no need for mapping here)
            this.homestayInfo = data;
            setTimeout(() => {
              initializeOwlCarousel('.homestayGallerySwiper',false,true,1,false,[1,1,1])
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
          console.log('Data fetch completed:', this.homestayInfo);
        },
      });
  }
  
  // Handle no data scenario
  handleNoDataFound() {
    this.noDataFound = true;
    this.loading=false;
  }
  
  
}
