import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appCompareTo]',
  providers: [{ provide: NG_VALIDATORS, useExisting: CompareToDirective, multi: true }]
})
export class CompareToDirective implements Validator {
  @Input('appCompareTo') controlNameToCompare: string = '';

  validate(control: AbstractControl): ValidationErrors | null {
    const controlToCompare = control.root.get(this.controlNameToCompare);
    if (controlToCompare && controlToCompare.value !== control.value) {
      return { 'compareTo': true };
    }
    return null;
  }
}
