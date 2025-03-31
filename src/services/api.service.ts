import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { environment } from '../enviroments/enviroment';
import { paginatedEndpoints } from '../app/globalEnums.enum';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl: string = environment.apiUrl;
  private defaultTimeout = 100000; // 100 seconds 

  constructor(private http: HttpClient) {}

  // Private method for headers
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  // Generic GET request
  getData<T>(endpoint: string): Observable<T> {
    return this.http
      .get<T>(`${this.apiUrl}/${endpoint}`, { headers: this.getHeaders() })
      .pipe(
        timeout(this.defaultTimeout),
        map((res: T) => res),
        catchError(this.handleError)
      );
  }

  
// GET request by ID with improved error handling and logging
getDataById<T>(endpoint: string, id: any): Observable<T> {
  // Validate ID before making the request
  if (!id || id === null || id === undefined) {
    console.warn('Invalid or missing ID provided for fetching data.');
    return throwError(() => new Error('Invalid or missing ID provided.'));
  }

  const url = `${this.apiUrl}/${endpoint}/${id}`;

  return this.http
    .get<T>(url, { headers: this.getHeaders() })
    .pipe(
      timeout(this.defaultTimeout), // Apply request timeout
      map((res: T) => {
        if (!res || Object.keys(res).length === 0) {
          console.warn(`No data found for ID: ${id} at endpoint: ${endpoint}`);
          throw new Error(`No data found for ID: ${id}`);
        }
        console.log(`Data fetched successfully for ID: ${id}`);
        return res;
      }),
      catchError((error) => {
        console.error(`Error fetching data from ${url}`, error);

        // Handle different error types
        if (error.name === 'TimeoutError') {
          console.error('Request timed out while fetching data.');
          return throwError(() => new Error('Request timed out. Please try again.'));
        } else if (error.status === 404) {
          console.error(`Data not found for ID: ${id}`);
          return throwError(() => new Error(`Data not found for ID: ${id}`));
        } else {
          console.error(`An unexpected error occurred: ${error.message}`);
          return throwError(() => new Error('An unexpected error occurred. Please try again.'));
        }
      })
    );
}



  //Filter Search Data
  getFilteredData<T>(category?: string, districtId?: number, villageId?: number, search?: string): Observable<T> {
    let params = new HttpParams();
  
    // Dynamically add parameters only if they have values
    if (category?.trim()) params = params.set('category', category.trim());
    if (districtId !== undefined && districtId !== null) params = params.set('districtId', districtId.toString());
    if (villageId !== undefined && villageId !== null) params = params.set('villageId', villageId.toString());
    if (search?.trim()) params = params.set('search', search.trim());
  
    // Updated to match the new API structure
    return this.http.get<T>(`${this.apiUrl}/website/filter`, { headers: this.getHeaders(), params })
      .pipe(
        timeout(this.defaultTimeout),
        map((res: T) => res),
        catchError(this.handleError)
      );
  }  



  // POST request
  postData<T>(endpoint: string, data: any): Observable<T> {
    return this.http
      .post<T>(`${this.apiUrl}/${endpoint}`, data, { headers: this.getHeaders() })
      .pipe(
        timeout(this.defaultTimeout),
        map((res: T) => res),
        catchError(this.handleError)
      );
  }

  // PUT request
  putData<T>(endpoint: string, data: any): Observable<T> {
    return this.http
      .put<T>(`${this.apiUrl}/${endpoint}`, data, { headers: this.getHeaders() })
      .pipe(
        timeout(this.defaultTimeout),
        map((res: T) => res),
        catchError(this.handleError)
      );
  }

  // DELETE request
  deleteDataById<T>(endpoint: string, id: any): Observable<T> {
    return this.http
      .delete<T>(`${this.apiUrl}/${endpoint}/${id}`, { headers: this.getHeaders() })
      .pipe(
        timeout(this.defaultTimeout),
        map((res: T) => res),
        catchError(this.handleError)
      );
  }



//  Get Paginated Products with Only Page Number and Page Size
getPaginatedData<T>(endpoint:paginatedEndpoints,pageNumber: number = 1, pageSize: number = 5): Observable<T> {
  let params = new HttpParams()
    .set('pageNumber', pageNumber.toString())
    .set('pageSize', pageSize.toString());

  return this.http
  .get<T>(`${this.apiUrl}/${endpoint}`, {
      headers: this.getHeaders(),
      params,
    })
    .pipe(
      timeout(this.defaultTimeout),
      map((res: T) => res),
      catchError(this.handleError)
    );
}


// Centralized Error Handler
private handleError(error: any): Observable<never> {
  let errorMessage = 'Something went wrong. Please try again later.';

  if (error.error instanceof ErrorEvent) {
    // Client-side or network error
    console.error('Client-side error:', error.error.message);
    errorMessage = `Client-side error: ${error.error.message}`;
  } else {
    // Server-side error
    console.error(`Server error (Status: ${error.status}) - ${error.message}`);

    switch (error.status) {
      case 400:
        errorMessage = 'Bad Request. Please check your input.';
        break;
      case 401:
        errorMessage = 'Unauthorized access. Please log in again.';
        break;
      case 403:
        errorMessage = "Forbidden. You don't have permission to access this resource.";
        break;
      case 404:
        errorMessage = 'Resource not found. Please try again.';
        break;
      case 500:
        errorMessage = 'Internal Server Error. Please try again later.';
        break;
      case 503:
        errorMessage = 'Service Unavailable. Please try again after some time.';
        break;
      default:
        errorMessage = `Unexpected error occurred (Status: ${error.status}).`;
        break;
    }
  }

  // Log detailed error information
  console.error('Full error details:', error);

  // Return a more meaningful error message
  return throwError(() => new Error(errorMessage));
}
}