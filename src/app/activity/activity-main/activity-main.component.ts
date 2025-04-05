import { Component, OnInit } from '@angular/core';
import { AdventuresComponent } from '../../home/adventures/adventures.component';
import { ActivityProfileComponent } from '../activity-profile/activity-profile.component';

@Component({
  selector: 'app-activity-main',
  templateUrl: './activity-main.component.html',
  styleUrls: ['./activity-main.component.css'],
  imports:[AdventuresComponent,ActivityProfileComponent]
})
export class ActivityMainComponent implements OnInit {

  constructor() { }

  ngOnInit() {
      // Smooth scroll to top
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
  }

}
