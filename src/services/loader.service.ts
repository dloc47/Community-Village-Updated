import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private _loadingCount = 0;
  private _isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this._isLoading.asObservable();

  private fallbackTimeoutHandle: any;

  /**
   * Show loader (increases counter).
   * @param fallbackDuration (optional) — forces hide after X ms
   */
  showLoader(fallbackDuration: number = 15000): void {
    this._loadingCount++;

    if (this._loadingCount === 1) {
      this._isLoading.next(true);
    }

    // fallback auto-hide if something breaks
    if (fallbackDuration > 0) {
      clearTimeout(this.fallbackTimeoutHandle);
      this.fallbackTimeoutHandle = setTimeout(() => {
        this.forceHide('Fallback timeout triggered');
      }, fallbackDuration);
    }
  }

  /**
   * Hide loader (decreases counter).
   * Only hides when all paired `showLoader()` are cleared.
   */
  hideLoader(): void {
    if (this._loadingCount > 0) {
      this._loadingCount--;
    }

    if (this._loadingCount === 0) {
      clearTimeout(this.fallbackTimeoutHandle);
      this._isLoading.next(false);
    }
  }

  /**
   * Forcefully hide loader (ignores counter).
   */
  forceHide(reason: string = ''): void {
    console.warn('[LoaderService] Force hide triggered.', reason);
    this._loadingCount = 0;
    this._isLoading.next(false);
    clearTimeout(this.fallbackTimeoutHandle);
  }

  /**
   * Reset loader state completely.
   */
  reset(): void {
    this._loadingCount = 0;
    clearTimeout(this.fallbackTimeoutHandle);
    this._isLoading.next(false);
  }
}
