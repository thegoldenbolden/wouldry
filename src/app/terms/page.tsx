import type { Metadata } from "next";
import { Footer } from "~/components/footer";
import { Calendar } from "~/components/icons";
import { Link } from "~/components/ui/link";
import { Section } from "~/components/ui/section";
import { BRAND_NAME } from "~/lib/constants";
import { links } from "~/lib/links";

export const metadata: Metadata = {
  title: "Terms & Services",
  description: `${BRAND_NAME}'s terms and services`,
  alternates: {
    canonical: links.terms.href,
  },
};

export default function Page() {
  return (
    <div className="mx-auto flex max-w-screen-md flex-col gap-16 px-3 md:px-6 md:py-6">
      <main className="flex flex-col gap-16">
        <Section>
          <Section.Header className="flex flex-wrap items-end justify-between gap-4">
            <Section.Title>Terms and Services</Section.Title>
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
              These terms of service (the &quot;Terms&quot;) govern your use
              of&nbsp;
              {BRAND_NAME}&apos;s website and online services (the
              &quot;Services&quot;). By accessing or using the Services, you
              agree to be bound by these Terms. If you do not agree to these
              Terms, you may not use the Services.
            </p>
          </Section.Content>
        </Section>

        <Section>
          <Section.Title>Eligibility</Section.Title>
          <Section.Content>
            <p>
              You must be at least 18 years old to use the Services. If you are
              under 18, you may only use the Services with the involvement and
              consent of a parent or guardian.
            </p>
          </Section.Content>
        </Section>

        <Section>
          <Section.Title>Account Registration</Section.Title>
          <Section.Content>
            <p>
              To access certain features of the Services, you may need to create
              an account. You are responsible for maintaining the
              confidentiality of your account login information and for all
              activities that occur under your account. You agree to notify us
              immediately of any unauthorized use of your account.
            </p>
          </Section.Content>
        </Section>

        <Section>
          <Section.Title>Prohibited Conduct</Section.Title>
          <Section.Content>
            <p>
              You may not use the Services for any unlawful or prohibited
              purpose, or in any way that could damage, disable, overburden, or
              impair the Services or interfere with any other party&apos;s use
              of the Services. You may not attempt to gain unauthorized access
              to the Services or any systems or networks connected to the
              Services.
            </p>
          </Section.Content>
        </Section>

        <Section>
          <Section.Title>Intellectual Property</Section.Title>
          <Section.Content>
            <p>
              The Services and all content and materials included on the
              Services, including but not limited to text, graphics, logos,
              images, and software, are the property of Wouldry or its licensors
              and are protected by foregroundright and trademark laws. You may
              not use any content or materials on the Services for any
              commercial purpose without the express written consent of Wouldry.
            </p>
          </Section.Content>
        </Section>

        <Section>
          <Section.Title>Disclaimer of Warranties</Section.Title>
          <Section.Content>
            <p>
              &quot;The Services are provided on an &quot;as is&quot; and
              &quot;as available&quot; basis. Wouldry makes no representations
              or warranties of any kind, express or implied, as to the operation
              of the Services or the information, content, materials, or
              products included on the Services.&quot;
            </p>
          </Section.Content>
        </Section>

        <Section>
          <Section.Title>Limitation of Liability</Section.Title>
          <Section.Content>
            <p>
              {BRAND_NAME} will not be liable for any damages of any kind
              arising from the use of the Services, including but not limited to
              direct, indirect, incidental, punitive, and consequential damages.
            </p>
          </Section.Content>
        </Section>

        <Section>
          <Section.Title>Indemnification</Section.Title>
          <Section.Content>
            <p>
              You agree to indemnify and hold {BRAND_NAME} and its affiliates,
              officers, agents, and employees harmless from any claim or demand,
              including reasonable attorneys&apos; fees, made by any third party
              due to or arising out of your use of the Services, your violation
              of these Terms, or your violation of any rights of another.
            </p>
          </Section.Content>
        </Section>

        <Section>
          <Section.Title>Governing Law</Section.Title>
          <Section.Content>
            <p>
              These Terms and your use of the Services will be governed by and
              construed in accordance with the laws of the state of Tennessee,
              without giving effect to any principles of conflicts of law.
            </p>
          </Section.Content>
        </Section>

        <Section>
          <Section.Title>Dispute Resolution</Section.Title>
          <Section.Content>
            <p>
              Any dispute arising out of or relating to these Terms or the
              Services will be resolved through binding arbitration in
              accordance with the rules of the American Arbitration Association.
            </p>
          </Section.Content>
        </Section>

        <Section>
          <Section.Title>Changes to the Terms</Section.Title>
          <Section.Content>
            <p>
              {BRAND_NAME} reserves the right to change these Terms at any time.
              Any changes will be effective upon posting the revised Terms on
              the Services. We encourage you to review these Terms regularly to
              stay informed about our terms of service.
            </p>
          </Section.Content>
        </Section>

        <Section>
          <Section.Title>Contact</Section.Title>
          <Section.Content>
            <p>
              If you have any questions or concerns about these Terms or the
              Services, please contact us on&nbsp;
              <Link
                target="_blank"
                text="primary"
                className="inline p-0"
                rel="noreferrer noopenner"
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
