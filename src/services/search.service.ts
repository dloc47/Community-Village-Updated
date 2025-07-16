import { inject, Injectable } from '@angular/core';
import { paginatedEndpoints } from '../app/utils/globalEnums.enum';
import { ApiService } from './api.service';
import {
  BehaviorSubject,
  catchError,
  finalize,
  map,
  Observable,
  of,
} from 'rxjs';

export type EntityType =
  | 'Committee'
  | 'Activity'
  | 'Product'
  | 'Homestay'
  | 'Event';
export type DistrictCode = '1' | '2' | '3' | '4' | '';

export interface SearchParams {
  entityType: EntityType;
  districtCode: DistrictCode;
  committeeId: string;
  searchText: string;
  pageSize: number;
  pageNumber: number;
}

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private apiService = inject(ApiService);

  public isDataFound = new BehaviorSubject<boolean>(true);
  isDataFound$ = this.isDataFound.asObservable();

  private _searchParams = new BehaviorSubject<SearchParams>({
    entityType: 'Committee',
    districtCode: '',
    committeeId: '',
    searchText: '',
    pageSize: 10,
    pageNumber: 1,
  });

  public searchParams$ = this._searchParams.asObservable();

  updateParams(partial: Partial<SearchParams>) {
    const current = this._searchParams.getValue();
    const updated = { ...current, ...partial };
    // Only emit if params actually changed
    if (JSON.stringify(current) !== JSON.stringify(updated)) {
      this._searchParams.next(updated);
    }
  }

  getCurrentParams(): SearchParams {
    return this._searchParams.getValue();
  }

  querySearchEndpoint(): string {
    const {
      entityType,
      pageNumber,
      pageSize,
      districtCode,
      searchText,
      committeeId,
    } = this.getCurrentParams();

    let query = `website/filter?`;
    let parts = [];

    if (entityType) parts.push(`entityType=${entityType}`);
    if (pageNumber) parts.push(`pageNumber=${pageNumber}`);
    if (pageSize) parts.push(`pageSize=${pageSize}`);
    if (districtCode) parts.push(`districtId=${districtCode}`);
    if (searchText?.trim())
      parts.push(`searchText=${encodeURIComponent(searchText.trim())}`);
    if (committeeId) parts.push(`villageId=${committeeId}`);

    query += parts.join('&'); // ✅ This automatically adds & in between

    return query;
  }

  // Track no data and error states
  loadingSubject = new BehaviorSubject<boolean>(true);
  noDataFoundSubject = new BehaviorSubject<boolean>(false);
  errorMessageSubject = new BehaviorSubject<string | null>(null);

  private queryStateSubject = new BehaviorSubject<any>({
    type: 'paginated', // Default to paginated
    query: null,
  });

  // Expose as Observables
  loading$ = this.loadingSubject.asObservable();
  noDataFound$ = this.noDataFoundSubject.asObservable();
  errorMessage$ = this.errorMessageSubject.asObservable();
  queryState$ = this.queryStateSubject.asObservable();

  constructor() {}

  //  Update query dynamically from any component
  updateQueryState(type: 'paginated' | 'filtered', query: any = null): void {
    this.queryStateSubject.next({ type, query });
  }

  // Fetch data dynamically based on query state
  getData(type: 'paginated' | 'filtered', query: any): Observable<any> {
    //  Start loading before API call
    this.loadingSubject.next(true);

    console.log(query.searchTerm);

    if (type === 'paginated') {
      return this.PaginatedData(
        query.endpoint,
        query.pageNo,
        query.itemPerPage
      );
    } else {
      return this.fetchFilteredData(
        query.category,
        query.districtId,
        query.villageId,
        query.searchTerm
      );
    }
  }

  PaginatedData(
    endpoint: paginatedEndpoints,
    pageNo: number,
    itemPerPage: number = 5
  ): Observable<{
    items: any[];
    pageNumber: number;
    totalRecords: number;
    isDataAvailable: boolean;
    error?: boolean;
    errorMessage?: string;
    errorCode?: number;
  }> {
    return this.apiService
      .getPaginatedData<any>(endpoint, pageNo, itemPerPage)
      .pipe(
        finalize(() => {
          // ✅ Stop loading after API completes (success or error)
          setTimeout(() => {
            this.loadingSubject.next(false);
          }, 800);
        }),
        map((data: any) => {
          // ✅ More robust data parsing to handle different API response formats
          console.log('API Response:', data); // Log the raw response for debugging

          // Try to handle different response structures
          let items = [];
          let pageNumber = pageNo;
          let totalRecords = 0;

          if (data) {
            if (data.data && Array.isArray(data.data)) {
              // Original API format
              items = data.data;
              pageNumber = data.pageNumber || pageNo;
              totalRecords = data.totalRecords || items.length;
            } else if (Array.isArray(data)) {
              // Alternative API format - direct array
              items = data;
              totalRecords = items.length;
            } else if (typeof data === 'object') {
              // Alternative API format with different field names
              items = data.items || data.results || data.data || [];
              pageNumber = data.pageNumber || data.page || pageNo;
              totalRecords =
                data.totalRecords || data.total || data.count || items.length;
            }
          }

          // Check if we have valid items
          if (items.length > 0) {
            // ✅ Data found
            this.noDataFoundSubject.next(false);
            this.errorMessageSubject.next(null);

            return {
              items: items,
              pageNumber: pageNumber,
              totalRecords: totalRecords,
              isDataAvailable: true,
            };
          } else {
            // ✅ Handle No Data Case
            this.noDataFoundSubject.next(true);
            this.errorMessageSubject.next(null);

            return {
              items: [],
              pageNumber: pageNo,
              totalRecords: 0,
              isDataAvailable: false,
            };
          }
        }),
        catchError((error: any) => {
          // ✅ Extract Detailed Error Info
          const errorMessage = this.getFriendlyErrorMessage(error);
          const errorCode = error?.status || 500; // Default 500 if no status

          this.errorMessageSubject.next(errorMessage);
          this.noDataFoundSubject.next(true);

          // ✅ Return Error Response with Details
          return of({
            items: [],
            pageNumber: pageNo,
            totalRecords: 0,
            isDataAvailable: false,
            error: true,
            errorMessage, // User-friendly error message
            errorCode, // HTTP error code
          });
        })
      );
  }

  fetchFilteredData(
    category: string, // Required
    districtId?: number, // Optional
    villageId?: number, // Optional
    searchTerm?: string // Optional
  ): Observable<{
    items: any[];
    isDataAvailable: boolean;
    error?: boolean;
    errorMessage?: string;
    errorCode?: number;
  }> {
    this.noDataFoundSubject.next(false); // Reset no data state

    // Prepare API params (use undefined instead of null)
    const params = {
      category: category,
      districtId: districtId !== undefined ? districtId : undefined,
      villageId: villageId !== undefined ? villageId : undefined,
      searchTerm: searchTerm || '', // Default to empty string
    };

    return this.apiService
      .getFilteredData(
        params.category,
        params.districtId,
        params.villageId,
        params.searchTerm
      )
      .pipe(
        finalize(() => {
          // ✅ Stop loading after API completes (success or error)
          setTimeout(() => {
            this.loadingSubject.next(false);
          }, 800);
        }),
        map((data: any) => {
          // ✅ More robust data parsing to handle different API response formats
          console.log('API Filter Response:', data); // Log the raw response for debugging

          let items = [];

          if (data) {
            if (Array.isArray(data)) {
              items = data;
            } else if (data.data && Array.isArray(data.data)) {
              items = data.data;
            } else if (data.items && Array.isArray(data.items)) {
              items = data.items;
            } else if (data.results && Array.isArray(data.results)) {
              items = data.results;
            } else if (typeof data === 'object') {
              // Try to extract data from any property that is an array
              for (const key in data) {
                if (Array.isArray(data[key]) && data[key].length > 0) {
                  items = data[key];
                  break;
                }
              }
            }
          }

          // Check if we have valid items
          if (items.length > 0) {
            // ✅ Data found – update state
            this.noDataFoundSubject.next(false);
            this.errorMessageSubject.next(null);

            return {
              items: items,
              isDataAvailable: true,
            };
          } else {
            // ❌ No Data Found – return empty result
            this.noDataFoundSubject.next(true);
            this.errorMessageSubject.next(null);

            return {
              items: [],
              isDataAvailable: false,
            };
          }
        }),
        catchError((error: any) => {
          // ❌ Handle API Error
          const errorMessage = this.getFriendlyErrorMessage(error);
          const errorCode = error?.status || 500;

          this.errorMessageSubject.next(errorMessage);
          this.noDataFoundSubject.next(true);

          // ✅ Return error object with details
          return of({
            items: [],
            isDataAvailable: false,
            error: true,
            errorMessage,
            errorCode,
          });
        })
      );
  }

  private getFriendlyErrorMessage(error: any): string {
    // Default message
    let message = 'An unexpected error occurred. Please try again.';

    // Extract error message based on different possible structures
    if (error) {
      if (error.message) {
        message = error.message;
      } else if (error.error && error.error.message) {
        message = error.error.message;
      } else if (error.statusText) {
        message = `HTTP Error: ${error.statusText}`;
      } else if (typeof error === 'string') {
        message = error;
      }
    }

    // Log the detailed error for debugging
    console.error('Search service error:', error);

    return message;
  }
}
