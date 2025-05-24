import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { getDynamicClass,destroyOwlInstance,initializeOwlCarousel } from '../../utils/utils';
import { ApiService } from '../../../services/api.service';
import { paginatedEndpoints } from '../../globalEnums.enum';
import { RouterModule ,RouterLink} from '@angular/router';

declare var $:any
@Component({
  selector: 'app-events-carousel',
  templateUrl: './events-carousel.component.html',
  styleUrls: ['./events-carousel.component.css'],
  imports:[CommonModule,RouterModule]
})
export class EventsCarouselComponent implements OnInit, AfterViewInit, OnDestroy {

   private apiService = inject(ApiService)

  constructor() { }

  Events:any[]=[]
  paginatedEvent:any=[]

  ngOnInit() {
    this.Events;
    this.getEvents();
  }
  
    ngAfterViewInit(): void {
     
  }
  



   
    ngOnDestroy() {
      destroyOwlInstance('.event-carousel')
    }
  

    
 
 getClass(input:number){
   return getDynamicClass(input);
 }
 
 
  
 getEvents(): void {
   this.apiService.getPaginatedData(paginatedEndpoints.events,1,5).subscribe({
     next: (data: any) => {
      
       if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
         // Enrich the fetched data with additional properties
         this.paginatedEvent = data.data;

         setTimeout(() => {
          initializeOwlCarousel('.event-carousel',true,true,10,false,[1,3,5])
         }, 300);// Small delay to ensure DOM is updated
       }
       console.log('here is the event',this.paginatedEvent)
 
     },
     error: (error:any) => {
       console.error('Error fetching Committies:', error);
       // Optionally, set a default value or handle the error
       this.paginatedEvent = []; // Fallback to an empty array
     },
     complete: () => {
       // Optional: Handle completion logic if needed
       console.log('Event fetch completed.');
    
     }
   });
 }

 scrollToTop(): void {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

 

}
