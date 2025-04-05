import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { ApiService } from '../../../services/api.service';
import { getByIDEndpoints, GlobalEnums, placeholder } from '../../globalEnums.enum';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { SafeUrlPipe } from '../../pipes/SafeUrlPipe.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports:[CommonModule,NgxPaginationModule,SafeUrlPipe,FormsModule ]
})
export class ProfileComponent implements OnInit, AfterViewInit {
  
  private apiService = inject(ApiService)
  committeeInfo:any=[]

  
  loading:boolean=false
  noDataFound:boolean=false
  imgPlaceholder=placeholder.image

  latitude: string = '27.606001';  // default Sikkim
  longitude: string = '88.473167';

get mapUrl(): string {
  return `https://maps.google.com/maps?q=${this.latitude},${this.longitude}&z=15&t=k&output=embed`;
}

  
  constructor(private sanitizer: DomSanitizer,
    private router :ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getFirstSegment();
  }


  getFirstSegment(): boolean {
    let segmentFound = false;

    // Get route parameters using ActivatedRoute
    this.router.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (id) {
        // If ID is present, load committee data
        this.loadCommitteeData(parseInt(id)); // Load data with ID
        segmentFound = true;
      } else {
        // Fallback if no ID
        console.log('No valid ID found in route.');
      }
    });

    return segmentFound;
  }



  p: number = 1;//for image pagination


  ngAfterViewInit(): void {
  }


 

  isBoxVisible: boolean = true;
  toggleDivs(divType:string) {
    if(divType=='villageDetails') this.isBoxVisible=true;
    else if(divType=='leaderShip') this.isBoxVisible=false;
  }



  
// ✅ Fetch  data without filters
loadCommitteeData(id:number): void {
  this.loading = true;
  this.apiService
    .getDataById<any>(getByIDEndpoints.villages, id)
    .subscribe({
      next: (data: any) => {

        this.latitude=data.latitude;
        this.longitude=data.longitude;


        console.log(data);
        
        // Check if data is valid
        if (data) {
          // Enrich with additional properties (no need for mapping here)
          this.committeeInfo =data;
         
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
        console.log('Data fetch completed:', this.committeeInfo);
      },
    });
}

// Handle no data scenario
handleNoDataFound() {
  this.noDataFound = true;
}
}