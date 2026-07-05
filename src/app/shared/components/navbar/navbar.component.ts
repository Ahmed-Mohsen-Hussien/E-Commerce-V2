import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../../core/auth/services/auth.service';
import { STORED_KEYS } from '../../../core/constants/storedKeys';
import { FlowbiteService } from '../../../core/services/flowbite/flowbite.service';
import { CartService } from '../../../features/cart/services/cart.service';
import { WishlistService } from './../../../features/wishlist/services/wishlist.service';
import { User } from '../../../core/auth/models/logged-user-data.interface';
interface Language {
  code: string;
  label: string;
}
@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  private readonly flowbiteService = inject(FlowbiteService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly authService = inject(AuthService);
  private readonly plat_id = inject(PLATFORM_ID);
  count: Signal<number> = computed(() => this.cartService.cartCount());
  wishlistProductsCount: Signal<number> = computed(() => this.wishlistService.wishlistCount());
  userData: WritableSignal<User[]> = signal<User[]>([]);
  userId: string | null = null;
  isUserMenuOpen: boolean = false;
  isMainMenuOpen: boolean = false;
  ngOnInit(): void {
    this.flowbiteService.loadFlowbite(() => {
      initFlowbite();
    });
    if (isPlatformBrowser(this.plat_id)) {
      const token = localStorage.getItem(STORED_KEYS.userToken);
      if (token) {
        this.getCartCount();
        this.getAllWishlistData();
        this.userId = this.authService.getUserId();
        if (this.userId) {
          this.getLoggedUserData();
        }
      }
    }
  }
  getCartCount(): void {
    this.cartService.getCartItems().subscribe({
      next: (res) => {
        this.cartService.cartCount.set(res.numOfCartItems);
      },
    });
  }
  getAllWishlistData(): void {
    this.wishlistService.getWishlistProducts().subscribe({
      next: (res) => {
        this.wishlistService.wishlistCount.set(res.count);
      },
    });
  }

  getLoggedUserData(): void {
    this.authService.getUserData(this.userId).subscribe({
      next: (res) => {
        this.userData.set(res.users);
      },
    });
  }
  onSignOut(): void {
    this.authService.signOut();
  }
  private readonly translateService = inject(TranslateService);
  private readonly renderer = inject(Renderer2);
  isOpen = false;
  languages: Language[] = [
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'Arabic' },
    { code: 'de', label: 'German' },
  ];
  selected: Language = { code: this.translateService.getCurrentLang(), label: 'English' };
  toggleMainMenu(e: MouseEvent): void {
    e.stopPropagation();
    this.isMainMenuOpen = !this.isMainMenuOpen;
  }
  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }
  toggleUserMenu(e: MouseEvent): void {
    e.stopPropagation();
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }
  @HostListener('document:click') closeMenu(): void {
    this.isUserMenuOpen = false;
    this.isMainMenuOpen = false;
  }
  closeDropdown(): void {
    this.isOpen = false;
  }
  selectLanguage(lang: Language): void {
    this.selected = lang;
    this.isOpen = false;
    this.translateService.use(lang.code);
    this.renderer.setAttribute(document.documentElement, 'lang', lang.code);
    this.renderer.setAttribute(document.documentElement, 'dir', lang.code === 'ar' ? 'rtl' : 'ltr');
  }
  // private readonly ele = inject(ElementRef);
  // @HostListener('document:click', ['$event'])
  // onDocumentClick(event: MouseEvent): void {
  //   if (!this.ele.nativeElement.contains(event.target)) {
  //     this.isOpen = false;
  //   }
  // }
}
