import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './home/nav-bar/nav-bar.component';
import { LazyLoadDirective } from './directives/lazy-load.directive';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,NavBarComponent,LazyLoadDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent   {
  title = 'Community-Village';

}
