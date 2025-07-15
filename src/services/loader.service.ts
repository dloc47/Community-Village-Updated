import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private _isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this._isLoading.asObservable();

  private fallbackTimeoutHandle: any;

  /**
   * Show loader immediately. Optionally auto-hide after fallbackDuration ms.
   * @param fallbackDuration (optional) — forces hide after X ms
   */
  showLoader(fallbackDuration?: number) {
    this._isLoading.next(true);
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
   * Hide loader immediately.
   */
  hideLoader(): void {
    this._isLoading.next(false);
    if (this.fallbackTimeoutHandle) {
      clearTimeout(this.fallbackTimeoutHandle);
      this.fallbackTimeoutHandle = null;
    }
  }
}
