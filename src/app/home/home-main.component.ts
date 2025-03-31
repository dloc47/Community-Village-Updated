import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home-main',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  providers: [
    ApiService,
  ],
  templateUrl: './home-main.component.html',
  styleUrls: ['./home-main.component.scss']
})
export class HomeMainComponent {
  constructor(private apiService: ApiService) { }
} 