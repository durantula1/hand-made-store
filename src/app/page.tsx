import { ShopShell } from "@/components/shop-shell";
import { Storefront } from "@/components/storefront";

export default function Home() {
  return (
    <ShopShell footer={<HomeFooter />}>
      <main id="main">
        <Storefront />
      </main>
    </ShopShell>
  );
}

function HomeFooter() {
  return (
    <footer className="footer" id="contact">
      <div>
        <p className="brand-lockup">
          <span>LUMA</span>
          <small>handmade</small>
        </p>
        <p className="mt-4 max-w-md text-sm leading-6 text-ink/58">
          Thoughtful handmade gifts, softly styled and packed with care from our
          spring studio edit.
        </p>
      </div>
      <form className="newsletter">
        <label htmlFor="email">Studio letters</label>
        <div>
          <input
            autoComplete="email"
            id="email"
            name="email"
            placeholder="you@example.com…"
            spellCheck={false}
            type="email"
          />
          <button type="button">Join</button>
        </div>
      </form>
    </footer>
  );
}
