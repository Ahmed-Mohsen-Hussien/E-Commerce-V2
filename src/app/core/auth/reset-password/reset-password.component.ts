import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  errorMessage: WritableSignal<string> = signal<string>('');
  showPass: boolean = false;
  newPasswordForm!: FormGroup;
  resetCode!: FormControl;
  ngOnInit(): void {
    this.resetCode = new FormControl(null, [Validators.required]);
  }
  submitResetCode(): void {
    if (this.resetCode.valid) {
      this.isLoading.set(true);
      this.authService.verifyResetCode(this.resetCode.value).subscribe({
        next: (res) => {
          if (res.status === 'Success') {
            this.isLoading.set(false);
            this.router.navigate(['/set-new-password']);
          }
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
    }
  }
}
