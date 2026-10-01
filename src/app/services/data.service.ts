import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pizza } from '../models/pizza.model';
import { Topping } from '../models/topping.model';

/**
 * Loads the static menu data shipped as JSON assets under /public/data.
 * Kept separate from CartService so the "what pizzas/toppings exist" concern
 * never mixes with the "what's in the user's cart" concern.
 */
@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient);

  private readonly pizzasUrl = 'data/pizzas.json';
  private readonly ingredientsUrl = 'data/ingredients.json';

  getPizzas(): Observable<Pizza[]> {
    return this.http.get<Pizza[]>(this.pizzasUrl);
  }

  getIngredients(): Observable<Topping[]> {
    return this.http.get<Topping[]>(this.ingredientsUrl);
  }
}
