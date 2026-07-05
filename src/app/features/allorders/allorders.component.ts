import { DatePipe, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/services/auth.service';
import { Orders } from './models/allorders.interface';
import { AllordersService } from './services/allorders.service';

@Component({
  selector: 'app-allorders',
  imports: [DatePipe, RouterLink],
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.css',
})
export class AllordersComponent implements OnInit {
  private readonly allordersService = inject(AllordersService);
  private readonly authService = inject(AuthService);
  private readonly plat_id = inject(PLATFORM_ID);
  ordersList: WritableSignal<Orders[]> = signal<Orders[]>([]);
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  userID: string | null = null;
  ngOnInit(): void {
    if (isPlatformBrowser(this.plat_id)) {
      this.userID = this.authService.getUserId();
      if (this.userID) {
        this.getLoggedUserOrders();
      }
    }
  }
  getLoggedUserOrders(): void {
    this.isLoading.set(true);
    this.allordersService.getUserOrders(this.userID).subscribe({
      next: (res) => {
        this.ordersList.set(res.reverse());
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }
}
