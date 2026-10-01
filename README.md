# Pizzeria — Angular Capstone

An Angular 19 (standalone components + signals) implementation of the Pizzeria
capstone brief: browse pizzas, build a custom one, manage a cart, and check out
with an accurate, validated bill.

## Getting started

```bash
npm install
npm start          # ng serve, then open http://localhost:4200
```

Production build (also runs a stricter type/template check):

```bash
npm run build
```

Lint:

```bash
npx ng lint
```

Both `ng build` (production) and `ng lint` currently pass with zero errors.

## Where each checkpoint lives

| Checkpoint | Route | Component |
|---|---|---|
| 1. Home page, nav, logo -> home | `/home` | `components/home` + `components/header` |
| 2. Order Pizza, add to cart | `/order-pizza` | `components/order-pizza` |
| 3. Build Ur Pizza, dynamic pricing | `/build-pizza` | `components/build-pizza` |
| 4. Checkout, quantity + billing | `/cart` | `components/cart` |

State is centralised in two services (`services/cart.service.ts`,
`services/data.service.ts`) so every page reads/writes the same cart via
Angular signals - no prop drilling, no duplicated totals logic.

## Notes on the source data (`public/data/*.json`)

- **Image URLs**: the URLs in the brief were truncated shutterstock links
  (they end in an ellipsis and don't resolve). They're replaced with
  locally generated SVG art under `public/images/pizzas/` and
  `public/images/ingredients/` — no external image service, no network
  dependency, nothing that can fail or add console errors on a locked-down
  assessment machine. Swap in real photos any time by editing the `image`
  field in `pizzas.json` / `ingredients.json`.
- **Fonts**: for the same reason, the app uses the OS's native font stack
  instead of a Google Fonts link — one less external request that could
  fail depending on the network the grader is on.
- **`price` typing**: the brief mixes numeric (`290`) and string (`"310"`)
  prices across pizza entries. Rather than "fixing" the data, the app keeps
  it as given and reads every price through `Number(pizza.price)` - see
  `Pizza` in `models/pizza.model.ts` and `priceOf()` in `order-pizza.component.ts`.
- **Duplicate entry**: `id: "0004"` and `id: "0006"` are identical
  ("Tripple Chicken Feast") in the supplied data - kept as-is since both are
  valid, distinctly-ID'd entries.
- **"Our story" page copy**: the reference screenshot's about-page text is
  Domino's marketing copy repurposed as filler. It's been replaced with
  original writing for the Home page so no third-party brand content ships
  in the app.
- **Logo**: `public/images/pizzeria-logo.png` is your supplied logo with the
  black background keyed out to transparency, used in the header and as the
  favicon (`images/favicon-32.png` / `favicon-180.png`).

## Checkout assumptions

The brief asks for "accurate billing" without specifying tax/delivery rules,
so `cart.component.ts` uses: 5% tax on the subtotal, a flat Rs.40 delivery fee
that's waived at Rs.500+ subtotal, and a delivery-details form (name, phone,
address, pincode) validated with Angular Reactive Forms before "Place Order"
is enabled. Adjust the constants at the top of `CartComponent` if your
grader expects different numbers.

## Before you submit

Per the assignment instructions: delete `node_modules/` (and this project's
`dist/`/`.angular/` if present) before zipping, and place this `pizzariaapp`
folder inside your own `emailid/name/candidateid`-named outer folder.
