import {Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';

@Directive({
  selector: '[cellEditable]',
})
export class CellEditableDirective {

  @Input() element: any;

  div: any;
  saveButton: any;
  cancelButton: any;
  input: any;

  get columnDef(): string {
    return [...this.el.nativeElement.classList].find((c: string) => c.substr(0, 11) === 'mat-column-').substr(11);
  }

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  /**
   * Event when clicking the cell.
   */
  @HostListener('click') onClick(): void {
    if (this.el.nativeElement.children.length === 0) {
      this.createInput();
      this.createSaveButton();
      this.createCancelButton();

      this.div = this.renderer.createElement('div');
      this.renderer.setStyle(this.div, 'display', 'flex');

      // The user can use keys (Esc or Enter) to edit cells, or the buttons (better for mobile)
      this.renderer.appendChild(this.div, this.cancelButton);
      this.renderer.appendChild(this.div, this.saveButton);
      this.renderer.appendChild(this.div, this.input);

      this.renderer.setProperty(this.el.nativeElement, 'innerText', '');
      this.renderer.appendChild(this.el.nativeElement, this.div);

      this.input.focus();
    }
  }

  /**
   * Creates input to edit the cell.
   * @private
   */
  private createInput(): void {
    this.input = this.renderer.createElement('input');
    this.renderer.setProperty(this.input, 'value', this.element[this.columnDef]);
    this.renderer.listen(this.input, 'keyup', (evt: KeyboardEvent) => {
      if (evt.key === 'Enter') {
        this.element[this.columnDef] = this.input.value;
      }
      if (evt.key === 'Enter' || evt.key === 'Escape') {
        this.clearDiv();
      }
    });
  }

  /**
   * Creates save button.
   * @private
   */
  private createSaveButton(): void {
    this.saveButton = this.renderer.createElement('mat-icon');
    this.setButtonStyles(this.saveButton, { icon: 'save' });
    this.renderer.listen(this.saveButton, 'click', (evt: MouseEvent) => {
      this.element[this.columnDef] = this.input.value;
      this.clearDiv();
      evt.stopPropagation();
    });
  }

  /**
   * Creates cancel button.
   * @private
   */
  private createCancelButton(): void {
    this.cancelButton = this.renderer.createElement('mat-icon');
    this.setButtonStyles(this.cancelButton, { icon: 'cancel', color: 'red' });
    this.renderer.listen(this.cancelButton, 'click', (evt: MouseEvent) => {
      this.clearDiv();
      evt.stopPropagation();
    });
  }

  /**
   * Set's standard styles to button.
   * @param button
   * @param data
   * @private
   */
  private setButtonStyles(button: any, data: { icon: string, color?: string, }): void {
    this.renderer.setProperty(button, 'innerText', data.icon);
    this.renderer.setStyle(button, 'margin-right', '5px');
    this.renderer.setStyle(button, 'cursor', 'pointer');
    if (data.color) {
      this.renderer.setStyle(button, 'color', data.color);
    }
    this.renderer.addClass(button, 'mat-icon');
    this.renderer.addClass(button, 'material-icons');
    this.renderer.addClass(button, 'cell-editable-' + data.icon);
  }

  /**
   * Removes input and buttons and updates the value of the cell.
   * @private
   */
  private clearDiv(): void {
    this.renderer.removeChild(this.el.nativeElement, this.div);
    this.renderer.setProperty(this.el.nativeElement, 'innerText', this.element[this.columnDef]);
  }

}
