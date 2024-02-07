import type { Metadata } from "next";
import { Footer } from "~/components/footer";
import { Calendar } from "~/components/icons";
import { Card } from "~/components/ui/card";
import { Link } from "~/components/ui/link";
import { Section } from "~/components/ui/section";
import { BRAND_NAME } from "~/lib/constants";
import { links } from "~/lib/links";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: `${BRAND_NAME}'s cookie policy`,
  alternates: {
    canonical: links.cookies.href,
  },
};

export default function Page() {
  return (
    <div className="mx-auto flex max-w-screen-md flex-col gap-16 px-3 md:px-6 md:py-6">
      <main className="flex flex-col gap-16">
        <Section>
          <Section.Header className="flex flex-wrap items-end justify-between gap-4">
            <Section.Title>Cookie Policy</Section.Title>
            <div
              aria-label="last updated at"
              className="flex flex-wrap items-center gap-2 text-sm font-medium tracking-wider text-foreground-lighter"
            >
              <Calendar className="size-4" />
              <time dateTime="2023-09-11">9.11.2023</time>
            </div>
          </Section.Header>
          <Section.Content>
            <p>
              We use cookies on our website to improve your browsing experience
              and to personalize the content we show you. By continuing to use
              our website, you consent to our use of cookies.
            </p>
          </Section.Content>
        </Section>
        <Section>
          <Section.Title>What are Cookies?</Section.Title>
          <Section.Content>
            <p>
              Cookies are small text files that are stored on your device when
              you visit a website. They are widely used to make websites work,
              or work more efficiently, as well as to provide information to the
              owners of the site.
            </p>
          </Section.Content>
        </Section>
        <Section>
          <Section.Title>Types of Cookies</Section.Title>
          <Section.Content>
            <Card asChild>
              <ul className="flex flex-col gap-3 border  border-border p-6 text-foreground-light">
                <li className="flex flex-col gap-1">
                  <h3 className="text-lg font-medium">Session Cookies</h3>
                  <p>
                    These are temporary cookies that expire when you close your
                    browser. They are used to keep track of your preferences
                    while you navigate through the website.
                  </p>
                </li>
                <li className="flex flex-col gap-1">
                  <h3 className="text-lg font-medium">Persistent Cookies</h3>
                  <p>
                    These cookies remain on your device until they expire or you
                    delete them. They are used to remember your preferences and
                    settings when you return to the website.
                  </p>
                </li>
              </ul>
            </Card>
          </Section.Content>
        </Section>
        <Section>
          <Section.Title>Manage Your Cookies</Section.Title>
          <Section.Content>
            <p>
              You can manage cookies by adjusting your browser settings. Most
              browsers allow you to block or delete cookies, but doing so may
              affect your ability to use some features of our website. If you
              have any questions or concerns about our use of cookies, please
              contact us on&nbsp;
              <Link
                target="_blank"
                rel="noreferrer noopenner"
                text="primary"
                className="inline p-0"
                href={links.discord.href}
              >
                discord
              </Link>
            </p>
          </Section.Content>
        </Section>
      </main>
      <Footer />
    </div>
  );
}
