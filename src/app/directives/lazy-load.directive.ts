import { AfterViewInit, Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: 'img:not([loading]), iframe:not([loading])',
  standalone: true
})

export class LazyLoadDirective implements AfterViewInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.renderer.setAttribute(this.el.nativeElement, 'loading', 'lazy');
  }
}