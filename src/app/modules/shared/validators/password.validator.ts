import { AbstractControl } from '@angular/forms';

export function ValidatorsPassword(control: AbstractControl): { [key: string]: boolean } | null {
	const password = control.get('password');
	const confirmPassword = control.get('confirmPassword');
	if (password.pristine || confirmPassword.pristine) {
		return null;
	}

	if (password.value === confirmPassword.value) {
		return null;
	}
	return { match: true };
}
