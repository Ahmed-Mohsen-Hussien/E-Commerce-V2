import { CartService } from './../cart/services/cart.service';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  checkOutForm!: FormGroup;
  cartId: string | null = null;
  buttonId: string | null = null;
  ngOnInit(): void {
    this.checkOutFormInitialization();
    this.getCartId();
  }
  checkOutFormInitialization(): void {
    this.checkOutForm = this.fb.group({
      shippingAddress: this.fb.group({
        details: [null, [Validators.required]],
        phone: [
          null,
          [Validators.required, Validators.pattern(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}$/)],
        ],
        city: [null, Validators.required],
      }),
    });
  }
  onSubmitCheckOutForm(e: SubmitEvent): void {
    if (this.checkOutForm.valid) {
      const ele = e.submitter as HTMLElement;
      this.buttonId = ele.getAttribute('id');
      console.log(this.buttonId);
      if (this.buttonId === 'visa') {
        this.isLoading.set(true);
        this.cartService.checkOutSession(this.cartId, this.checkOutForm.value).subscribe({
          next: (res) => {
            this.isLoading.set(false);
            if (res.status === 'success') {
              window.open(res.session.url, '_self');
            }
          },
          error: () => {
            this.isLoading.set(false);
          },
        });
      } else {
        this.isLoading.set(true);
        this.cartService.creatCashOrder(this.cartId, this.checkOutForm.value).subscribe({
          next: (res) => {
            if (res.status === 'success') {
              this.isLoading.set(false);
              Swal.fire({
                title: 'Success',
                icon: 'success',
                text: 'Order set to be paid with cash',
              });
              this.getAllUserData();
              this.router.navigate(['/allorders']);
            }
          },
          error: () => {
            this.isLoading.set(false);
          },
        });
      }
    }
  }
  getCartId(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        this.cartId = params.get('id');
      },
    });
  }
  getAllUserData(): void {
    this.cartService.getCartItems().subscribe({
      next: (res) => {
        this.cartService.cartCount.set(res.numOfCartItems);
      },
    });
  }
}
