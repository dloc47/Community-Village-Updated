import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private _isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this._isLoading.asObservable();

  private fallbackTimeoutHandle: any;
  private hideDelayTimeout: any;
  private hideDelay = 500; // ms

  /**
   * Show loader immediately. Optionally auto-hide after fallbackDuration ms.
   */
  showLoader(fallbackDuration?: number) {
    if (this.hideDelayTimeout) {
      clearTimeout(this.hideDelayTimeout); // prevent premature hide
    }
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
   * Hide loader, but with a 500ms delay from the time this is called.
   */
  hideLoader(): void {
    if (this.hideDelayTimeout) {
      clearTimeout(this.hideDelayTimeout);
    }

    this.hideDelayTimeout = setTimeout(() => {
      this._isLoading.next(false);
      this.hideDelayTimeout = null;
    }, this.hideDelay);

    if (this.fallbackTimeoutHandle) {
      clearTimeout(this.fallbackTimeoutHandle);
      this.fallbackTimeoutHandle = null;
    }
  }
}
