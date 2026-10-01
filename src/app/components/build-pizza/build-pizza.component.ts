import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { DataService } from '../../services/data.service';
import { CartService } from '../../services/cart.service';
import { Topping } from '../../models/topping.model';

interface ToppingDot {
  id: number;
  x: number;
  y: number;
  color: string;
}

@Component({
  selector: 'app-build-pizza',
  imports: [CurrencyPipe],
  templateUrl: './build-pizza.component.html',
  styleUrl: './build-pizza.component.css'
})
export class BuildPizzaComponent implements OnInit {
  private data = inject(DataService);
  private cart = inject(CartService);

  readonly ingredients = signal<Topping[]>([]);
  readonly loading = signal(true);
  readonly loadError = signal(false);
  readonly selectedIds = signal<ReadonlySet<number>>(new Set());
  readonly justBuilt = signal(false);

  private readonly dotColors = ['#c0392b', '#7fa650', '#f2c14e', '#8d5524', '#e07a5f'];

  readonly selectedIngredients = computed(() =>
    this.ingredients().filter(t => this.selectedIds().has(t.id))
  );

  /** Sum of selected ingredient prices - recomputes automatically as selection changes. */
  readonly totalCost = computed(() =>
    this.selectedIngredients().reduce((sum, t) => sum + Number(t.price), 0)
  );

  readonly toppingDots = computed<ToppingDot[]>(() =>
    this.selectedIngredients().map((t, i) => this.dotFor(t.id, i))
  );

  ngOnInit(): void {
    this.data.getIngredients().subscribe({
      next: list => {
        this.ingredients.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.loadError.set(true);
      }
    });
  }

  isSelected(id: number): boolean {
    return this.selectedIds().has(id);
  }

  toggle(id: number): void {
    this.selectedIds.update(set => {
      const next = new Set(set);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  buildPizza(): void {
    const chosen = this.selectedIngredients();
    if (chosen.length === 0) {
      return;
    }

    this.cart.addItem({
      source: 'custom',
      name: 'Build Ur Pizza',
      unitPrice: this.totalCost(),
      details: chosen.map(t => t.tname).join(', ')
    });

    this.selectedIds.set(new Set());
    this.justBuilt.set(true);
    setTimeout(() => this.justBuilt.set(false), 1800);
  }

  /** Deterministic pseudo-random placement so a given ingredient always lands
   *  in the same spot on the preview pizza, instead of jumping around. */
  private dotFor(id: number, index: number): ToppingDot {
    const angle = (id * 53) % 360;
    const radiusBand = 18 + ((id + index) % 4) * 10;
    const rad = (angle * Math.PI) / 180;
    return {
      id,
      x: 100 + radiusBand * Math.cos(rad),
      y: 100 + radiusBand * Math.sin(rad),
      color: this.dotColors[id % this.dotColors.length]
    };
  }
}
