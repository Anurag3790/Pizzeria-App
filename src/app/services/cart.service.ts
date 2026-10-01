import { Injectable, computed, signal } from '@angular/core';
import { CartItem } from '../models/cart-item.model';

/**
 * Single source of truth for the shopping cart, shared app-wide via DI.
 * Built on writable signals so every consumer (header badge, cart page,
 * "Add to cart" buttons) reacts automatically without manual subscriptions.
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _items = signal<CartItem[]>([]);

  /** Read-only view of the cart lines. */
  readonly items = this._items.asReadonly();

  /** Total number of pizzas across all lines (used for the header badge). */
  readonly itemCount = computed(() =>
    this._items().reduce((sum, item) => sum + item.quantity, 0)
  );

  /** Sum of unitPrice * quantity across all lines. */
  readonly subtotal = computed(() =>
    this._items().reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  );

  /**
   * Adds a pizza to the cart. If a line with the same name/details/source
   * already exists (e.g. adding "Paneer Tikka" twice), its quantity is
   * bumped instead of creating a duplicate row.
   */
  addItem(newItem: Omit<CartItem, 'cartItemId' | 'quantity'>, quantity = 1): void {
    this._items.update(items => {
      const existing = items.find(
        i =>
          i.source === newItem.source &&
          i.name === newItem.name &&
          i.details === newItem.details
      );

      if (existing) {
        return items.map(i =>
          i.cartItemId === existing.cartItemId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }

      const item: CartItem = { ...newItem, quantity, cartItemId: this.generateId() };
      return [...items, item];
    });
  }

  /** Sets an exact quantity; removes the line if it drops to 0 or below. */
  updateQuantity(cartItemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(cartItemId);
      return;
    }
    this._items.update(items =>
      items.map(i => (i.cartItemId === cartItemId ? { ...i, quantity } : i))
    );
  }

  increment(cartItemId: string): void {
    const item = this._items().find(i => i.cartItemId === cartItemId);
    if (item) this.updateQuantity(cartItemId, item.quantity + 1);
  }

  decrement(cartItemId: string): void {
    const item = this._items().find(i => i.cartItemId === cartItemId);
    if (item) this.updateQuantity(cartItemId, item.quantity - 1);
  }

  removeItem(cartItemId: string): void {
    this._items.update(items => items.filter(i => i.cartItemId !== cartItemId));
  }

  clearCart(): void {
    this._items.set([]);
  }

  private generateId(): string {
    return `cart_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }
}
