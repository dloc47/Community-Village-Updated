import { Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent {
  isMenuhidden: boolean = true;
  private platformId = inject(PLATFORM_ID);

  toogleMobileMenu() {
    this.isMenuhidden = !this.isMenuhidden;

    if (isPlatformBrowser(this.platformId)) {
      if (!this.isMenuhidden) {
        // Freeze body when menu opens
        document.body.style.overflow = 'hidden';
      } else {
        //  Enable scroll when menu closes
        document.body.style.overflow = 'auto';
      }
    }
  }

  onMobileNavClick() {
    this.isMenuhidden = true;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'auto';
    }
  }
}
