import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { LoaderService } from '../../../services/loader.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-loader',
  template: `<div
    *ngIf="loader$ | async"
    class="fixed inset-0 z-[50] flex flex-col items-center justify-center w-screen h-screen bg-white/80 backdrop-blur-sm overflow-hidden transition-all duration-500"
  >
    <div class="relative flex items-center justify-center w-24 h-24">
      <!-- Animated outer ring with rainbow color pulse -->
      <span
        class="absolute w-full h-full rounded-full border-2 border-red-400 animate-pulse-ring ring-outer"
      ></span>
      <!-- Animated middle ring with rainbow color pulse -->
      <span
        class="absolute w-14 h-14 rounded-full border-2 border-yellow-400 animate-pulse-ring ring-middle"
        style="animation-delay: 0.25s"
      ></span>

      <!-- Lucide Loader icon in center -->
      <img
        src="tourism_logo.svg"
        class="w-12 h-12 text-primary animate-pulse z-10 drop-shadow-lg transition-transform duration-500"
        loading="eager"
      />

      <span class="sr-only">Loading...</span>
    </div>
    <div class="mt-6 flex flex-col items-center">
      <span class="text-base font-semibold text-primary animate-bounce"
        >Loading</span
      >
      <span class="mt-1 text-xs text-gray-500 animate-fade-in-out"
        >Please wait ...</span
      >
    </div>
  </div> `,
  styles: `@tailwind utilities;

  .loader-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    width: 100%;
  }
  
  .loader-ring {
    position: relative;
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .loader-ring::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    border: 6px solid #e0e0e0;
    border-top: 6px solid #009688;
    animation: spin 1s linear infinite;
    z-index: 1;
  }
  
  .loader-icon {
    width: 60px;
    height: 60px;
    z-index: 2;
    display: block;
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  
  @keyframes spin-reverse {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(-360deg);
    }
  }
  .animate-spin-reverse {
    animation: spin-reverse 1.5s linear infinite;
  }
  
  @keyframes fade-in-out {
    0%,
    100% {
      opacity: 0.2;
    }
    50% {
      opacity: 1;
    }
  }
  .animate-fade-in-out {
    animation: fade-in-out 2s ease-in-out infinite;
  }
  
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }
  
  .animate-pulse-ring {
    animation: pulse-ring 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  .ring-outer {
    --ring-color: #06b6d4; /* Tailwind cyan-500 as example for primary */
  }
  .ring-middle {
    --ring-color: #0ea5e9; /* Tailwind sky-500 as example for secondary */
  }
  .ring-inner {
    --ring-color: #6366f1; /* Tailwind indigo-500 as example for accent */
  }
  @keyframes pulse-ring {
    0% {
      border-color: #e5e7eb; /* gray-200 */
      box-shadow: 0 0 0 0 var(--ring-color, #06b6d4);
    }
    40% {
      border-color: var(--ring-color, #06b6d4);
      box-shadow: 0 0 0 8px var(--ring-color, #06b6d4, 0.2);
    }
    60% {
      border-color: var(--ring-color, #06b6d4);
      box-shadow: 0 0 0 12px var(--ring-color, #06b6d4, 0.1);
    }
    100% {
      border-color: #e5e7eb;
      box-shadow: 0 0 0 0 var(--ring-color, #06b6d4, 0);
    }
  }
  
  `,
  standalone: true,
  imports: [CommonModule],
})
export class LoaderComponent implements OnInit, OnDestroy {
  loaderService = inject(LoaderService);
  loader$ = this.loaderService.isLoading$;

  private destroy$ = new Subject<void>();
  platformId = inject(PLATFORM_ID);
  isBrowser: boolean = true;

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.loaderService.isLoading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading) => {
        if (this.isBrowser) {
          if (isLoading) {
            document.body.classList.add('overflow-hidden');
          } else {
            document.body.classList.remove('overflow-hidden');
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
