import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-partner-registration',
  templateUrl: './partner-registration.component.html',
  styleUrls: ['./partner-registration.component.scss']
})
export class PartnerRegistrationComponent implements OnInit {
registrationFormGroup:FormGroup;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
         this.registrationFormGroup = this.formBuilder.group ({
          fullName:['',Validators.required],
        userName: ['',[Validators.required]],
        password: ['',[Validators.required]],
        passwordConfirm: ['',[Validators.required]],
        mobileNo: ['',[Validators.required]],
        email: ['',[Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),Validators.required]],
        custPincode:['',[Validators.required,Validators.pattern(/^[1-9][0-9]{5}$/)]],
        referenceCode:['']
      })
  }
  	checkLength(value, len: number, fldName: any) {
		if (value.length > len) {
			// tslint:disable-next-line: radix
			this.registrationFormGroup.get(fldName).setValue(parseInt(value.substring(0, len)));
		}
	}

}
