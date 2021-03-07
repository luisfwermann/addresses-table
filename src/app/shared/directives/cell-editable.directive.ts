import { Directive, ElementRef, HostListener, Input, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: '[cellEditable]',
})
export class CellEditableDirective implements OnInit {
  @Input() element: any;

  originalVal = '';

  get columnDef(): string {
    return [...this.ref.nativeElement.classList].find((c: string) => c.indexOf('mat-column') === 0).substr(11);
  }

  constructor(private ref: ElementRef, private renderer: Renderer2) {
    this.renderer.setAttribute(this.ref.nativeElement, 'contenteditable', 'true');
  }

  /**
   * Event when typing in the cell.
   */
   @HostListener('keyup', ['$event']) onKeyUp(evt: KeyboardEvent): void {
      const el = this.ref.nativeElement;
      if (evt.key === 'Escape') {
        this.renderer.setProperty(el, 'textContent', this.originalVal);
      }
      if (evt.key === 'Enter' || evt.key === 'Escape') {
        el.blur();
      }
  }

  /**
   * Event when leaving the cell.
   */
   @HostListener('blur') onBlur(): void {
    this.renderer.setProperty(this.ref.nativeElement, 'textContent', this.ref.nativeElement.textContent.trim());
    this.element[this.columnDef] = this.ref.nativeElement.textContent.trim();
    this.originalVal = this.element[this.columnDef];
  }

  ngOnInit() {
    this.originalVal = this.element[this.columnDef];
  }
}
