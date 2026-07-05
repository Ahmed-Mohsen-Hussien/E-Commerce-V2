import { Directive, ElementRef, HostListener, inject, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
})
export class Highlight {
  private readonly renderer = inject(Renderer2);
  private readonly ele = inject(ElementRef);
  @HostListener('mouseenter') mouseEnter(): void {
    this.renderer.setStyle(this.ele.nativeElement, 'background-color', 'red');
  }
  @HostListener('mouseleave') mouseLeave(): void {
    this.renderer.setStyle(this.ele.nativeElement, 'background-color', '');
  }
}
