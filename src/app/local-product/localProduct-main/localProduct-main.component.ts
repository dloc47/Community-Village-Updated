import { Component, OnInit } from '@angular/core';
import { ProductsCarouselComponent } from '../../home/products-carousel/products-carousel.component';
import { ProductProfleComponent } from '../product-profle/product-profle.component';

@Component({
  selector: 'app-localProduct-main',
  templateUrl: './localProduct-main.component.html',
  styleUrls: ['./localProduct-main.component.css'],
  imports:[ProductsCarouselComponent,ProductProfleComponent]
})
export class LocalProductMainComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
