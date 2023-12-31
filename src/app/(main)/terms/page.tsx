import { Link } from "~/components/ui/link";
import type { Metadata } from "next";
import { links } from "~/lib/links";

export const metadata: Metadata = {
  title: "Terms & Services",
  description: "Wouldry's terms and services",
  alternates: {
    canonical: links.terms.href,
  },
};

export default function Terms() {
  return (
    <main className="mx-auto divide-y divide-border px-4 md:max-w-screen-md xl:px-0">
      <section className="flex flex-col gap-2 py-8 sm:px-0">
        <div>
          <h1 className="text-3xl">Terms and Services</h1>
          <div className="text-sm font-bold opacity-75">
            Last Updated: <time dateTime="2023-09-11">September 11, 2023</time>
          </div>
        </div>
        <p className="opacity-90">
          &quot;These terms of service (the &quot;Terms&quot;) govern your use
          of Wouldry&apos;s website and online services (the
          &quot;Services&quot;). By accessing or using the Services, you agree
          to be bound by these Terms. If you do not agree to these Terms, you
          may not use the Services.&quot;
        </p>
      </section>
      <section className="py-8 opacity-90 sm:px-0">
        <h2 className="text-2xl opacity-100">Eligibility</h2>
        <p className="opacity-90">
          You must be at least 18 years old to use the Services. If you are
          under 18, you may only use the Services with the involvement and
          consent of a parent or guardian.
        </p>
      </section>
      <section className="py-8 opacity-90 sm:px-0">
        <h2 className="text-2xl opacity-100">Account Registration</h2>
        <p className="opacity-90">
          To access certain features of the Services, you may need to create an
          account. You are responsible for maintaining the confidentiality of
          your account login information and for all activities that occur under
          your account. You agree to notify us immediately of any unauthorized
          use of your account.
        </p>
      </section>
      <section className="py-8 opacity-90 sm:px-0">
        <h2 className="text-2xl opacity-100">Prohibited Conduct</h2>
        <p className="opacity-90">
          You may not use the Services for any unlawful or prohibited purpose,
          or in any way that could damage, disable, overburden, or impair the
          Services or interfere with any other party&apos;s use of the Services.
          You may not attempt to gain unauthorized access to the Services or any
          systems or networks connected to the Services.
        </p>
      </section>
      <section className="py-8 opacity-90 sm:px-0">
        <h2 className="text-2xl opacity-100">Intellectual Property</h2>
        <p className="opacity-90">
          The Services and all content and materials included on the Services,
          including but not limited to text, graphics, logos, images, and
          software, are the property of Wouldry or its licensors and are
          protected by copyright and trademark laws. You may not use any content
          or materials on the Services for any commercial purpose without the
          express written consent of Wouldry.
        </p>
      </section>
      <section className="py-8 opacity-90 sm:px-0">
        <h2 className="text-2xl opacity-100">Disclaimer of Warranties</h2>
        <p className="opacity-90">
          &quot;The Services are provided on an &quot;as is&quot; and &quot;as
          available&quot; basis. Wouldry makes no representations or warranties
          of any kind, express or implied, as to the operation of the Services
          or the information, content, materials, or products included on the
          Services.&quot;
        </p>
      </section>
      <section className="py-8 opacity-90 sm:px-0">
        <h2 className="text-2xl opacity-100">Limitation of Liability</h2>
        <p className="opacity-90">
          Wouldry will not be liable for any damages of any kind arising from
          the use of the Services, including but not limited to direct,
          indirect, incidental, punitive, and consequential damages.
        </p>
      </section>
      <section className="py-8 opacity-90 sm:px-0">
        <h2 className="text-2xl opacity-100">Indemnification</h2>
        <p className="opacity-90">
          You agree to indemnify and hold Wouldry and its affiliates, officers,
          agents, and employees harmless from any claim or demand, including
          reasonable attorneys&apos; fees, made by any third party due to or
          arising out of your use of the Services, your violation of these
          Terms, or your violation of any rights of another.
        </p>
      </section>
      <section className="py-8 opacity-90 sm:px-0">
        <h2 className="text-2xl opacity-100">Governing Law</h2>
        <p className="opacity-90">
          These Terms and your use of the Services will be governed by and
          construed in accordance with the laws of the state of Tennessee,
          without giving effect to any principles of conflicts of law.
        </p>
      </section>
      <section className="py-8 opacity-90 sm:px-0">
        <h2 className="text-2xl opacity-100">Dispute Resolution</h2>
        <p className="opacity-90">
          Any dispute arising out of or relating to these Terms or the Services
          will be resolved through binding arbitration in accordance with the
          rules of the American Arbitration Association.
        </p>
      </section>
      <section className="py-8 opacity-90 sm:px-0">
        <h2 className="text-2xl opacity-100">Changes to the Terms</h2>
        <p className="opacity-90">
          Wouldry reserves the right to change these Terms at any time. Any
          changes will be effective upon posting the revised Terms on the
          Services. We encourage you to review these Terms regularly to stay
          informed about our terms of service.
        </p>
      </section>
      <section className="py-8 opacity-90 sm:px-0">
        <h2 className="text-2xl opacity-100">Contact Us</h2>
        <p className="opacity-90">
          If you have any questions or concerns about these Terms or the
          Services, please contact us on&nbsp;
          <Link
            target="_blank"
            text="primary"
            rel="noreferrer noopenner"
            href={links.discord.href}
          >
            discord
          </Link>
        </p>
      </section>
    </main>
  );
}
