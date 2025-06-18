import { Routes } from '@angular/router';
import { HomeMainComponent } from './home/home-main/home-main.component';
import { ProfileComponent } from './village-profile/profile/profile.component';
import { EventMainComponent } from './event/event-main/event-main.component';
import { HomestayMainComponent } from './homestay/homestay-main/homestay-main.component';
import { LocalProductMainComponent } from './local-product/localProduct-main/localProduct-main.component';
import { ActivityMainComponent } from './activity/activity-main/activity-main.component';
import { SearchMainComponent } from './search/search-main/search-main.component';

export const routes: Routes = [
   {path:'searchTest',component:SearchMainComponent},
  // Search route for search if ID is missing
  {path:'', component:HomeMainComponent},
  {
   path: 'search',
   children:[
      {path:'',
         component:SearchMainComponent,
         pathMatch:'full'
      },
      {
         path:':type/:districtId/:villageId/:keyword',
         component:SearchMainComponent
      },
   ]
 },
 
 {
   path: 'village',
   children:[
      {path:'',
         component:SearchMainComponent,
         pathMatch:'full',
         data: { type: 'village' }, // Pass type to SearchComponent
      },
      {
         path:':id',
         component:ProfileComponent
      }
   ]
 },

 {
   path: 'event',
   children:[
      {path:'',
         component:SearchMainComponent,
         pathMatch:'full',
         data: { type: 'event' }, // Pass type to SearchComponent
      },
      {
         path:':id',
         component:EventMainComponent
      }
   ]
 },

 {
   path: 'homestay',
   children:[
      {path:'',
         component:SearchMainComponent,
         pathMatch:'full',
         data: { type: 'homestay' }, // Pass type to SearchComponent
      },
      {
         path:':id',
         component:HomestayMainComponent
      }
   ]
 },

 {
   path: 'product',
   children:[
      {path:'',
         component:SearchMainComponent,
         pathMatch:'full',
         data: { type: 'product' }, // Pass type to SearchComponent
      },
      {
         path:':id',
         component:LocalProductMainComponent
      }
   ]
 },
 {
   path: 'activity',
   children:[
      {path:'',
         component:SearchMainComponent,
         pathMatch:'full',
         data: { type: 'activity' }, // Pass type to SearchComponent
      },
      {
         path:':id',
         component:ActivityMainComponent
      }
   ]
 },  
];
