import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink,RouterLinkActive,CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent {
  isMenuhidden:boolean=true; 

  toogleMobileMenu(){
    this.isMenuhidden = !this.isMenuhidden;

    if (!this.isMenuhidden) {
      // Freeze body when menu opens
      document.body.style.overflow = 'hidden';
  } else {
      //  Enable scroll when menu closes
      document.body.style.overflow = 'auto';
  }

  }

}
