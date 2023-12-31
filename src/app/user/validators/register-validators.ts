import { ValidationErrors, AbstractControl, ValidatorFn } from "@angular/forms";

export class RegisterValidators {
    // static methods allow us to call the methods multiple times without creating and new instance

    static match(controlName: string, matchingControlName: string) : ValidatorFn {
        return (group : AbstractControl) : ValidationErrors | null => {
            const control = group.get('password')
            const matchingControl = group.get('confirmPassword')
    
            if(!control || !matchingControl) {
                console.error('Form controls cannot be found in the form block')
                return { controlNotFound: false}
            }
    
            const error = control.value === matchingControl.value ?
            null : 
            { noMatch: true}

            matchingControl.setErrors(error)
    
            return error
        }
    }
}
