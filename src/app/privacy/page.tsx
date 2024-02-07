import type { Metadata } from "next";
import { Footer } from "~/components/footer";
import { Calendar } from "~/components/icons";
import { Card } from "~/components/ui/card";
import { Link } from "~/components/ui/link";
import { Section } from "~/components/ui/section";
import { BRAND_NAME } from "~/lib/constants";
import { links } from "~/lib/links";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `${BRAND_NAME}'s privacy policy`,
  alternates: {
    canonical: links.privacy.href,
  },
};

export default function Page() {
  return (
    <div className="mx-auto flex max-w-screen-md flex-col gap-16 px-3 md:px-6 md:py-6">
      <main className="flex flex-col gap-16">
        <Section>
          <Section.Header className="flex flex-wrap items-end justify-between gap-4">
            <Section.Title>Privacy Policy</Section.Title>
            <div
              aria-label="last updated at"
              className="flex flex-wrap items-center gap-2 text-sm font-medium tracking-wider text-foreground-lighter"
            >
              <Calendar className="size-4" />
              <time dateTime="2023-09-11">12.20.2023</time>
            </div>
          </Section.Header>
          <Section.Content>
            <p>
              We at {BRAND_NAME} value your privacy and take great care in
              protecting it. This privacy policy explains how we collect, use,
              and share personal information about you when you use our website
              and online services. Please read this policy carefully to
              understand how we handle your personal information.
            </p>
          </Section.Content>
        </Section>
        <Section>
          <Section.Title>Information We Collect</Section.Title>
          <Section.Content>
            <p>
              We collect personal information about you when you provide it to
              us directly, such as when you create an account. The personal
              information we collect may include your name, or email address. We
              may also collect information about your use of our website and
              services, such as your search queries, and the pages you view.
              This information may be collected through the use of cookies and
              other tracking technologies.
            </p>
          </Section.Content>
        </Section>
        <Section>
          <Section.Title>How We Use Your Information</Section.Title>
          <Section.Content>
            <div className="flex flex-col gap-3">
              <p>
                We use the personal information we collect about you for various
                purposes, including:
              </p>
              <Card asChild>
                <ol className="flex list-inside list-decimal flex-col gap-1 border  border-border p-6 text-foreground-light">
                  <li>To provide user support and assistance</li>
                  <li>To personalize your experience on our website</li>
                  <li>To improve the quality of our website and services</li>
                </ol>
              </Card>
              <p>
                To access certain features of the Services, you may need to
                create an account. You are responsible for maintaining the
                confidentiality of your account login information and for all
                activities that occur under your account. You agree to notify us
                immediately of any unauthorized use of your account.
              </p>
            </div>
          </Section.Content>
        </Section>
        <Section>
          <Section.Title>Data Security</Section.Title>
          <Section.Content>
            <p>
              We take steps to protect your personal information from
              unauthorized access, use, or disclosure. We use secure servers,
              encryption, and other security measures to protect your personal
              information.
            </p>
          </Section.Content>
        </Section>
        <Section>
          <Section.Title>Your Rights and Choices</Section.Title>
          <Section.Content>
            <p>
              You have the right to access, correct, or delete your personal
              information at any time.
            </p>
          </Section.Content>
        </Section>
        <Section>
          <Section.Title>Changes to this Privacy Policy</Section.Title>
          <Section.Content>
            <p>
              We may update this privacy policy from time to time. If we make
              any changes, we will post the updated policy on this page and
              update the effective date. We encourage you to review this policy
              regularly to stay informed about our privacy practices.
            </p>
          </Section.Content>
        </Section>
        <Section>
          <Section.Title>Contact Us</Section.Title>
          <Section.Content>
            <p>
              If you have any questions or concerns about our privacy policy or
              the handling of your personal information, please contact us
              on&nbsp;
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
