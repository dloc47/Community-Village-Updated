import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private _isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this._isLoading.asObservable();

  private fallbackTimeoutHandle: any;
  private loaderShownAt: number | null = null;
  private minDisplayTime = 500; // ms

  /**
   * Show loader immediately. Optionally auto-hide after fallbackDuration ms.
   * @param fallbackDuration (optional) — forces hide after X ms
   */
  showLoader(fallbackDuration?: number) {
    this._isLoading.next(true);
    this.loaderShownAt = Date.now();
    if (this.fallbackTimeoutHandle) {
      clearTimeout(this.fallbackTimeoutHandle);
    }
    if (fallbackDuration) {
      this.fallbackTimeoutHandle = setTimeout(() => {
        this.hideLoader();
      }, fallbackDuration);
    }
  }

  /**
   * Hide loader immediately (or after min display time).
   */
  hideLoader(): void {
    if (this.loaderShownAt) {
      const elapsed = Date.now() - this.loaderShownAt;
      if (elapsed < this.minDisplayTime) {
        setTimeout(() => {
          this._isLoading.next(false);
          this.loaderShownAt = null;
        }, this.minDisplayTime - elapsed);
        if (this.fallbackTimeoutHandle) {
          clearTimeout(this.fallbackTimeoutHandle);
          this.fallbackTimeoutHandle = null;
        }
        return;
      }
    }
    this._isLoading.next(false);
    this.loaderShownAt = null;
    if (this.fallbackTimeoutHandle) {
      clearTimeout(this.fallbackTimeoutHandle);
      this.fallbackTimeoutHandle = null;
    }
  }
}
