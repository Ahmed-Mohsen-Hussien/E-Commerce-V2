import { AuthService } from './../services/auth.service';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-set-new-password',
  imports: [ReactiveFormsModule],
  templateUrl: './set-new-password.component.html',
  styleUrl: './set-new-password.component.css',
})
export class SetNewPasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  showPass: boolean = false;
  newPasswordForm!: FormGroup;
  ngOnInit(): void {
    this.newPasswordFormInitialization();
  }
  newPasswordFormInitialization(): void {
    this.newPasswordForm = this.fb.group({
      email: [null, [Validators.required]],
      newPassword: [
        null,
        [
          Validators.required,
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/),
        ],
      ],
    });
  }
  togglePassword(): void {
    this.showPass = !this.showPass;
  }
  setNewPassword(): void {
    if (this.newPasswordForm.valid) {
      this.isLoading.set(true);
      this.authService.resetPassword(this.newPasswordForm.value).subscribe({
        next: (res) => {
          if (res.token) {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Your password has been reset , You will be redirected to login page',
            });
            this.router.navigate(['/login']);
          }
          this.isLoading.set(false);
          console.log(res);
        },
        error: (err) => {
          this.isLoading.set(false);
          console.log(err);
        },
      });
    }
  }
}
