import { Directive, Input } from '@angular/core';
import { Validator, AbstractControl, ValidationErrors, NG_VALIDATORS } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[compare]',
  providers: [{provide: NG_VALIDATORS, useExisting: ConpareValidatorDirective, multi: true}]
})
export class ConpareValidatorDirective implements Validator {
  @Input('compare') controlNameToCompare: string;

  validate(c: AbstractControl): ValidationErrors | null {
    const controlToCompare = c.root.get(this.controlNameToCompare);
    if (controlToCompare) {
      const subscription: Subscription = controlToCompare.valueChanges.subscribe(() => {
        c.updateValueAndValidity();
        subscription.unsubscribe();
      });
    }
    return controlToCompare && controlToCompare.value !== c.value ? {compare: true} : null;
  }

}
