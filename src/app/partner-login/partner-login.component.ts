import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';


@Component({
  selector: 'app-partner-login',
  templateUrl: './partner-login.component.html',
  styleUrls: ['./partner-login.component.scss']
})
export class PartnerLoginComponent implements OnInit {
loginFormGroup:FormGroup;
  constructor(private formBuilder: FormBuilder) { }
 
  ngOnInit() {
     this.loginFormGroup = this.formBuilder.group ({
    userName: ['',[Validators.required]],
    password: ['',[Validators.required]],
  })
  }

}
