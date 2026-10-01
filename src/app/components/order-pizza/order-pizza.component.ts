import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { DataService } from '../../services/data.service';
import { CartService } from '../../services/cart.service';
import { Pizza } from '../../models/pizza.model';

@Component({
  selector: 'app-order-pizza',
  imports: [CurrencyPipe],
  templateUrl: './order-pizza.component.html',
  styleUrl: './order-pizza.component.css'
})
export class OrderPizzaComponent implements OnInit {
  private data = inject(DataService);
  private cart = inject(CartService);

  readonly pizzas = signal<Pizza[]>([]);
  readonly loading = signal(true);
  readonly loadError = signal(false);
  /** id of the pizza that just got a "Added ✓" confirmation flash */
  readonly addedId = signal<string | null>(null);

  ngOnInit(): void {
    this.data.getPizzas().subscribe({
      next: pizzas => {
        this.pizzas.set(pizzas);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.loadError.set(true);
      }
    });
  }

  /** `price` in the source data arrives as either a number or a numeric string. */
  priceOf(pizza: Pizza): number {
    return Number(pizza.price);
  }

  addToCart(pizza: Pizza): void {
    this.cart.addItem({
      source: 'menu',
      name: pizza.name,
      unitPrice: this.priceOf(pizza),
      image: pizza.image,
      details: pizza.type === 'veg' ? 'Veg' : 'Non-veg'
    });

    this.addedId.set(pizza.id);
    setTimeout(() => {
      if (this.addedId() === pizza.id) {
        this.addedId.set(null);
      }
    }, 1200);
  }
}
