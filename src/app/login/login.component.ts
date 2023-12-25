import { Component } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { UserManagementService } from '../user-management.service';
import { Router } from '@angular/router';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  // usernameFormControl = new FormControl('', [Validators.required]);
  // passwordFormControl = new FormControl('', [Validators.required]);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  matcher = new MyErrorStateMatcher();

  constructor(
    private userManagementService: UserManagementService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  onLoginSubmitted() {
    // 檢查表單是否有效
    if (this.loginForm.valid) {
      let loginResult = this.userManagementService.login(
        this.loginForm.value.username!,
        this.loginForm.value.password!
      );

      if (loginResult) {
        this.router.navigate(['/home']);
      } else {
        alert('登入失敗');
      }
    } else {
      Object.keys(this.loginForm.controls).forEach((key) => {
        this.loginForm.get(key)!.markAsTouched();
      });
    }
  }
}
