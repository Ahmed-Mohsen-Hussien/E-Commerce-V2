import { Directive, ElementRef, HostListener, inject, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appPopup]',
})
export class Popup {
  private readonly ele = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  myDiv!: HTMLElement;
  @Input() msg!: string;
  @HostListener('mouseenter') mouseEnter(): void {
    this.renderer.setStyle(this.ele.nativeElement, 'position', 'relative');
    this.myDiv = this.renderer.createElement('div');
    this.renderer.setStyle(this.myDiv, 'position', 'absolute');
    this.renderer.setStyle(this.myDiv, 'buttom', '100%');
    this.renderer.setStyle(this.myDiv, 'left', '0');
    this.renderer.setStyle(this.myDiv, 'padding', '5px 10px');
    this.renderer.setStyle(this.myDiv, 'background-color', 'black');
    this.renderer.setStyle(this.myDiv, 'color', 'white');
    this.renderer.setStyle(this.myDiv, 'border-radius', '7px');
    this.myDiv.innerText = this.msg;
    this.renderer.appendChild(this.ele.nativeElement, this.myDiv);
  }
  @HostListener('mouseleave') mouseLeave(): void {
    this.renderer.removeChild(this.ele.nativeElement, this.myDiv);
  }
}
