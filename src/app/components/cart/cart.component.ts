import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink, ReactiveFormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cart = inject(CartService);
  private fb = inject(FormBuilder);

  private readonly TAX_RATE = 0.05;
  private readonly DELIVERY_FEE = 40;
  private readonly FREE_DELIVERY_THRESHOLD = 500;

  readonly orderPlaced = signal(false);
  readonly lastOrderTotal = signal(0);

  readonly tax = computed(() => this.cart.subtotal() * this.TAX_RATE);

  readonly deliveryFee = computed(() =>
    this.cart.subtotal() === 0 || this.cart.subtotal() >= this.FREE_DELIVERY_THRESHOLD
      ? 0
      : this.DELIVERY_FEE
  );

  readonly grandTotal = computed(() => this.cart.subtotal() + this.tax() + this.deliveryFee());

  readonly deliveryForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    address: ['', [Validators.required, Validators.minLength(10)]],
    pincode: ['', [Validators.required, Validators.pattern(/^[1-9]\d{5}$/)]]
  });

  increment(cartItemId: string): void {
    this.cart.increment(cartItemId);
  }

  decrement(cartItemId: string): void {
    this.cart.decrement(cartItemId);
  }

  remove(cartItemId: string): void {
    this.cart.removeItem(cartItemId);
  }

  isInvalid(controlName: string): boolean {
    const control = this.deliveryForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  placeOrder(): void {
    if (this.cart.items().length === 0) {
      return;
    }
    if (this.deliveryForm.invalid) {
      this.deliveryForm.markAllAsTouched();
      return;
    }

    this.lastOrderTotal.set(this.grandTotal());
    this.orderPlaced.set(true);
    this.cart.clearCart();
    this.deliveryForm.reset();
  }

  startNewOrder(): void {
    this.orderPlaced.set(false);
  }
}
