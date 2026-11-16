import Link from "next/link";
import { NotFoundBrand } from "@/components/not-found-brand";

export default function NotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center bg-ivory px-6 py-20" id="main">
      <NotFoundBrand />
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <p className="font-script text-7xl leading-none text-brown sm:text-8xl" aria-hidden="true">
          404
        </p>
        <svg aria-hidden="true" className="my-5 text-brown/60" fill="none" height="28" stroke="currentColor" strokeLinecap="round" strokeWidth="1.2" viewBox="0 0 120 28" width="120">
          <path d="M2 14h42M76 14h42" />
          <circle cx="60" cy="14" r="8" />
          <circle cx="60" cy="14" r="3" />
        </svg>
        <h1 className="font-serif text-4xl font-medium text-ink sm:text-5xl">Тази страница се изгуби</h1>
        <p className="mt-4 text-muted">
          Като мънисто, търкулнало се под масата в студиото. Страницата, която търсиш, не съществува или е преместена.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link className="primary-button" href="/">
            Към началото
          </Link>
          <Link className="inline-flex items-center justify-center border border-ink/30 px-6 py-3 text-sm uppercase tracking-[0.14em] text-ink transition hover:bg-paper" href="/shop">
            Разгледай бижутата
          </Link>
        </div>
      </div>
    </main>
  );
}
