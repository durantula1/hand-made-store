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
          Смислени ръчно изработени подаръци, внимателно подбрани и опаковани с грижа
          от пролетната ни колекция.
        </p>
      </div>
      <form className="newsletter">
        <label htmlFor="email">Писма от студиото</label>
        <div>
          <input
            autoComplete="email"
            id="email"
            name="email"
            placeholder="ti@primer.bg"
            spellCheck={false}
            type="email"
          />
          <button type="button">Абонирай се</button>
        </div>
      </form>
    </footer>
  );
}
