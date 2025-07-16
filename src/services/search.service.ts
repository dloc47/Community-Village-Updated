import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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

  resetParams(): void {
    const defaultParams: SearchParams = {
      entityType: 'Committee',
      districtCode: '',
      committeeId: '',
      searchText: '',
      pageSize: 10,
      pageNumber: 1,
    };
    this._searchParams.next(defaultParams);
    this.isDataFound.next(true); //  reset this
  }
}
