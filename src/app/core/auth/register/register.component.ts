import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  ref: Subscription = new Subscription();
  showPass: boolean = false;
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  registerForm!: FormGroup;
  ngOnInit(): void {
    this.registerFormInitialization();
  }
  handleConfirmPassword(form: AbstractControl) {
    return form.get('password')?.value === form.get('rePassword')?.value
      ? null
      : { mismatch: true };
  }
  submitRegisterForm(): void {
    if (this.registerForm.valid) {
      this.ref.unsubscribe();
      this.isLoading.set(true);
      this.ref = this.authService.sendRegisterData(this.registerForm.value).subscribe({
        next: (res) => {
          if (res.message === 'success') {
            this.isLoading.set(false);
            this.registerForm.reset();
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 1000);
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
  registerFormInitialization(): void {
    this.registerForm = this.fb.group(
      {
        name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
        email: [null, [Validators.required, Validators.email]],
        password: [
          null,
          [
            Validators.required,
            Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/),
          ],
        ],
        rePassword: [null, [Validators.required]],
        phone: [
          null,
          [Validators.required, Validators.pattern(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}$/)],
        ],
      },
      { validators: this.handleConfirmPassword },
    );
  }
  showFirstError(): void {
    const controls = this.registerForm.controls;
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
