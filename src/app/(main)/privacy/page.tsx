import { Link } from "~/components/ui/link";
import type { Metadata } from "next";
import { links } from "~/lib/links";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Wouldry's privacy policy",
  alternates: {
    canonical: links.privacy.href,
  },
};

export default function Privacy() {
  return (
    <main className="mx-auto divide-y divide-border px-4 md:max-w-screen-md xl:px-0">
      <section className="flex flex-col gap-2 py-8 opacity-90 sm:px-0">
        <div>
          <h1 className="text-3xl">Privacy Policy</h1>
          <div className="text-sm font-bold opacity-75">
            Last Updated: <time dateTime="2023-12-20">December 20, 2023</time>
          </div>
        </div>
        <p className="opacity-90">
          We at Wouldry value your privacy and take great care in protecting it.
          This privacy policy explains how we collect, use, and share personal
          information about you when you use our website and online services.
          Please read this policy carefully to understand how we handle your
          personal information.
        </p>
      </section>
      <section className="py-8 opacity-90 sm:px-0">
        <h2 className="text-2xl opacity-100">Information We Collect</h2>
        <p>
          We collect personal information about you when you provide it to us
          directly, such as when you create an account. The personal information
          we collect may include your name, or email address. We may also
          collect information about your use of our website and services, such
          as your search queries, and the pages you view. This information may
          be collected through the use of cookies and other tracking
          technologies.
        </p>
      </section>
      <section className="py-8 opacity-90 sm:px-0">
        <h2 className="text-2xl opacity-100">How We Use Your Information</h2>
        <div className="flex flex-col gap-2">
          <p>
            We use the personal information we collect about you for various
            purposes, including:
          </p>
          <ol className="list-[square] px-4 text-sm">
            <li>To provide user support and assistance</li>
            <li>To personalize your experience on our website</li>
            <li>To improve the quality of our website and services</li>
          </ol>
          <p>
            To access certain features of the Services, you may need to create
            an account. You are responsible for maintaining the confidentiality
            of your account login information and for all activities that occur
            under your account. You agree to notify us immediately of any
            unauthorized use of your account.
          </p>
        </div>
      </section>
      <section className="py-8 opacity-90 sm:px-0">
        <h2 className="text-2xl opacity-100">Data Security</h2>
        <p>
          We take steps to protect your personal information from unauthorized
          access, use, or disclosure. We use secure servers, encryption, and
          other security measures to protect your personal information.
        </p>
      </section>
      <section className="py-8 opacity-90 sm:px-0">
        <h2 className="text-2xl opacity-100">Your Rights and Choices</h2>
        <p>
          You have the right to access, correct, or delete your personal
          information at any time.
        </p>
      </section>
      <section className="py-8 opacity-90 sm:px-0">
        <h2 className="text-2xl opacity-100">Changes to this Privacy Policy</h2>
        <p>
          We may update this privacy policy from time to time. If we make any
          changes, we will post the updated policy on this page and update the
          effective date. We encourage you to review this policy regularly to
          stay informed about our privacy practices.
        </p>
      </section>
      <section className="py-8 opacity-90 sm:px-0">
        <h2 className="text-2xl opacity-100">Contact Us</h2>
        <p>
          If you have any questions or concerns about our privacy policy or the
          handling of your personal information, please contact us on&nbsp;
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
