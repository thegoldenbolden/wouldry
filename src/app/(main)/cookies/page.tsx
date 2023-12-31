import { Link } from "~/components/ui/link";
import type { Metadata } from "next";
import { links } from "~/lib/links";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Wouldry's cookie policy",
  alternates: {
    canonical: links.cookies.href,
  },
};

export default function Cookies() {
  return (
    <main className="mx-auto divide-y divide-border px-4 md:max-w-screen-md xl:px-0">
      <section className="flex flex-col gap-2 py-8 opacity-90 sm:px-0">
        <div>
          <h1 className="text-3xl">Cookie Policy</h1>
          <div className="text-sm font-bold opacity-75">
            Last Updated: <time dateTime="2023-09-11">September 11, 2023</time>
          </div>
        </div>
        <p className="opacity-90">
          We use cookies on our website to improve your browsing experience and
          to personalize the content we show you. By continuing to use our
          website, you consent to our use of cookies.
        </p>
      </section>
      <section className="py-8 opacity-90 sm:px-0">
        <h2 className="text-2xl opacity-100">What are cookies?</h2>
        <p>
          Cookies are small text files that are stored on your device when you
          visit a website. They are widely used to make websites work, or work
          more efficiently, as well as to provide information to the owners of
          the site.
        </p>
      </section>
      <section className="py-8 opacity-90 sm:px-0">
        <h2 className="text-2xl opacity-100">Types of cookies we use:</h2>
        <ol className="list-[square] px-4 ">
          <li>
            <span className="underline">Session Cookies</span>: These are
            temporary cookies that expire when you close your browser. They are
            used to keep track of your preferences while you navigate through
            the website.
          </li>
          <li>
            <span className="underline">Persistent Cookies</span>: These cookies
            remain on your device until they expire or you delete them. They are
            used to remember your preferences and settings when you return to
            the website.
          </li>
        </ol>
      </section>
      <section className="py-8 opacity-90 sm:px-0">
        <h2 className="text-2xl opacity-100">Manage Your Cookies</h2>
        <p>
          You can manage cookies by adjusting your browser settings. Most
          browsers allow you to block or delete cookies, but doing so may affect
          your ability to use some features of our website. If you have any
          questions or concerns about our use of cookies, please contact us
          on&nbsp;
          <Link
            target="_blank"
            rel="noreferrer noopenner"
            text="primary"
            href={links.discord.href}
          >
            discord
          </Link>
        </p>
      </section>
    </main>
  );
}
