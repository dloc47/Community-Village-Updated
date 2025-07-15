import { Routes } from '@angular/router';
import { HomeMainComponent } from './home/home-main/home-main.component';
import { SearchMainComponent } from './search/search-main/search-main.component';
import { HomestayProfileComponent } from './profiles/homestay-profile/homestay-profile.component';
import { ActivityProfileComponent } from './profiles/activity-profile/activity-profile.component';
import { ProductProfleComponent } from './profiles/product-profle/product-profle.component';
import { CommitteeProfileComponent } from './profiles/committee-profile/committee-profile.component';
import { EventProfileComponent } from './profiles/event-profile/event-profile.component';

export const routes: Routes = [
  { path: '', component: HomeMainComponent },

  {
    path: 'search',
    children: [
      { path: '', component: SearchMainComponent, pathMatch: 'full' },
      {
        path: ':type/:districtId/:villageId/:keyword',
        component: SearchMainComponent,
      },
    ],
  },

  {
    path: 'committee',
    children: [
      {
        path: '',
        component: SearchMainComponent,
        pathMatch: 'full',
        data: { type: 'committee' }, // Pass type to SearchComponent
      },
      {
        path: ':id',
        component: CommitteeProfileComponent,
      },
    ],
  },

  {
    path: 'event',
    children: [
      {
        path: '',
        component: SearchMainComponent,
        pathMatch: 'full',
        data: { type: 'event' }, // Pass type to SearchComponent
      },
      {
        path: ':id',
        component: EventProfileComponent,
      },
    ],
  },

  {
    path: 'homestay',
    children: [
      {
        path: '',
        component: SearchMainComponent,
        pathMatch: 'full',
        data: { type: 'homestay' }, // Pass type to SearchComponent
      },
      {
        path: ':id',
        component: HomestayProfileComponent,
      },
    ],
  },

  {
    path: 'product',
    children: [
      {
        path: '',
        component: SearchMainComponent,
        pathMatch: 'full',
        data: { type: 'product' }, // Pass type to SearchComponent
      },
      {
        path: ':id',
        component: ProductProfleComponent,
      },
    ],
  },
  {
    path: 'activity',
    children: [
      {
        path: '',
        component: SearchMainComponent,
        pathMatch: 'full',
        data: { type: 'activity' }, // Pass type to SearchComponent
      },
      {
        path: ':id',
        component: ActivityProfileComponent,
      },
    ],
  },
];
