import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()  // Remove the providedIn: 'root' if adding to component providers
export class ApiService {
  constructor(private http: HttpClient) {
    // Constructor code
  }
  
  // ... service methods ...
} 