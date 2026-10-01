export type CartItemSource = 'menu' | 'custom';


export interface CartItem {
  /** Stable id used for trackBy + updating/removing the correct line. */
  cartItemId: string;
  /** Whether this came from "Order Pizza" (menu) or "Build Ur Pizza" (custom). */
  source: CartItemSource;
  name: string;
  unitPrice: number;
  quantity: number;
  image?: string;
  
  details?: string;
}
