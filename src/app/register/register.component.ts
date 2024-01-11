import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { RegisterDTO } from '../dtos/register.dto';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  @ViewChild('registerForm') registerForm!: NgForm;
  // Khai bao cac bien tuong ung voi cac truong du lieu trong form
  phone: string;
  password: string;
  retypePassword: string;
  fullName: string;
  address: string;
  isAccepted: boolean;
  dateOfBirth: Date;

  constructor(private router: Router, private UserService: UserService){
    this.phone = '';
    this.password = '';
    this.retypePassword = '';
    this.fullName = '';
    this.address = '';
    this.isAccepted = true;
    this.dateOfBirth = new Date();
    this.dateOfBirth.setFullYear(this.dateOfBirth.getFullYear() - 18);
  }
  onPhoneChange(){
    console.log(`Phone typed: ${this.phone}`)
  }
  register(){
    const message = 
      `Phone: ${this.phone}`+
      `Password: ${this.password}`+
      `Retype Password: ${this.retypePassword}`+
      `Full name: ${this.fullName}`+
      `Address: ${this.address}`+
      `Accepted: ${this.isAccepted}` + 
      `Date of birth: ${this.dateOfBirth}`;
    
    const registerDTO:RegisterDTO = {
      "fullname": this.fullName,
      "phone_number": this.phone,
      "address": this.address,
      "password": this.password,
      "retype_password": this.retypePassword,
      "date_of_birth": this.dateOfBirth,
      "facebook_account_id": 0,
      "google_account_id": 0,
      "role_id": 1
    }
    this.UserService.register(registerDTO).subscribe({
      next: (response: any) => {
        debugger
        // Xu ly ket qua tra ve khi dang ky thanh cong
        this.router.navigate(['/login']);
      },
      complete: () => {
        debugger
      },
      error: (err: any) => {
        // Xu ly loi neu co
        alert(`Cannot register, error: ${err.error}`);
        debugger
        console.error("Dang ky khong thanh cong: ", err);
      },
    })
  }
  
  // how to check password match
  checkPasswordsMatch() {
    if (this.password !== this.retypePassword) {
      this.registerForm.form.controls['retypePassword']
        .setErrors({'passwordMismatch':true});
    } else {
      this.registerForm.form.controls['retypePassword']
        .setErrors(null);
    }
  }

  checkAge() {
    if (this.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(this.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18) {
        this.registerForm.form.controls['dateOfBirth'].setErrors({'invalidAge' : true});
      } else {
        this.registerForm.form.controls['dateOfBirth'].setErrors(null);
      }
    }
  }
}
