import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getByIDEndpoints } from '../../globalEnums.enum';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-event-profile',
  templateUrl: './event-profile.component.html',
  styleUrls: ['./event-profile.component.css'],
  imports:[CommonModule]
})
export class EventProfileComponent implements OnInit {

   loading :boolean=false;
    noDataFound:boolean=false;
    eventInfo:any=[]
    
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
            this.loadEventData(parseInt(id)); // Load data with ID
            segmentFound = true;
          } else {
            // Fallback if no ID
            console.log('No valid ID found in route.');
          }
        });
    
        return segmentFound;
      }
    
    
      
      // ✅ Fetch  data  
      loadEventData(id:number): void {
        this.loading = true;
        this.apiService
          .getDataById<any>(getByIDEndpoints.events, id)
          .subscribe({
            next: (data: any) => {
              console.log(data);
              
              // Check if data is valid
              if (data) {
                // Enrich with additional properties (no need for mapping here)
                this.eventInfo = data;
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
              console.log('Data fetch completed:', this.eventInfo);
            },
          });
      }
      
      // Handle no data scenario
      handleNoDataFound() {
        this.noDataFound = true;
        this.loading=false;
      }
      

}
