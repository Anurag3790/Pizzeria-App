export type PizzaType = 'veg' | 'nonveg';

/**
 * Shape of an entry in /data/pizzas.json.
 * NOTE: `price` is intentionally typed as `number | string` because the
 * source data mixes both (some prices arrive as JSON numbers, others as
 * quoted strings). Always read it through `Number(pizza.price)` before
 * doing arithmetic - never assume it is already numeric.
 */
export interface Pizza {
  id: string;
  type: PizzaType;
  price: number | string;
  name: string;
  image: string;
  description: string;
  ingredients: string[];
  topping: string[];
}
