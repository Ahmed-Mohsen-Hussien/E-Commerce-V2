import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { STORED_KEYS } from '../../constants/storedKeys';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly plat_id = inject(PLATFORM_ID);
  ref: Subscription = new Subscription();
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  loginForm!: FormGroup;
  showPass: boolean = false;
  ngOnInit(): void {
    this.loginFormInitialization();
  }
  submitLoginForm(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.ref.unsubscribe();
      this.ref = this.authService.sendLoginData(this.loginForm.value).subscribe({
        next: (res) => {
          if (res.message === 'success') {
            this.isLoading.set(false);
            if (isPlatformBrowser(this.plat_id)) {
              localStorage.setItem(STORED_KEYS.userToken, res.token);
            }
            this.router.navigate(['/home']);
          }
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
    } else {
      this.showFirstError();
    }
  }
  loginFormInitialization(): void {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [
        null,
        [
          Validators.required,
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/),
        ],
      ],
    });
  }
  forgetPassword(): void {
    const emailAddress = this.loginForm.get('email');
    if (emailAddress?.valid) {
      this.authService.forgetLoginPassword(emailAddress?.value).subscribe({
        next: (res) => {
          if (res.statusMsg === 'success') {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Reset code sent to your email',
            });
            this.router.navigate(['/reset-password']);
          }
        },
      });
    } else {
      emailAddress?.markAsTouched();
    }
  }
  showFirstError(): void {
    const controls = this.loginForm.controls;
    for (const key in controls) {
      const control = controls[key];
      if (control.invalid) {
        control.markAsTouched();
        break;
      }
    }
  }
  togglePassword(): void {
    this.showPass = !this.showPass;
  }
}
