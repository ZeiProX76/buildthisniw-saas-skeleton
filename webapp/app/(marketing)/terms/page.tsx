import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — Build This Now",
  description:
    "Terms of Service for Build This Now. Read our terms governing the use of our platform and digital products.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: March 9, 2026
          </p>
        </header>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-10 text-muted-foreground [&_h2]:text-foreground [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-0 [&_h3]:text-foreground [&_h3]:text-base [&_h3]:font-medium [&_strong]:text-foreground">
          <section>
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing or using Build This Now (&ldquo;the Platform&rdquo;),
              you agree to be bound by these Terms of Service
              (&ldquo;Terms&rdquo;). If you do not agree, do not use the
              Platform. The Platform is operated by Kairo Ventures, a company
              registered in a free zone in Dubai, United Arab Emirates.
            </p>
          </section>

          <section>
            <h2>2. Description of Service</h2>
            <p>
              Build This Now provides digital build kits for software developers.
              Each kit includes a validated business idea with market research, a
              technical architecture overview, a step-by-step build plan with AI
              coding prompts, and downloadable starter files. Some content is
              available for free; full kits require a one-time purchase.
            </p>
          </section>

          <section>
            <h2>3. Eligibility</h2>
            <p>
              You must be at least 18 years old to use the Platform. By creating
              an account, you represent that the information you provide is
              accurate and that you have the legal capacity to enter into these
              Terms.
            </p>
          </section>

          <section>
            <h2>4. Account Responsibilities</h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activity under your account. You
              agree to notify us immediately of any unauthorized access. We
              reserve the right to suspend or terminate accounts that violate
              these Terms.
            </p>
          </section>

          <section>
            <h2>5. Purchases and Payments</h2>
            <h3>5.1 Pricing</h3>
            <p>
              Build kits are sold as one-time purchases. Prices are displayed in
              USD and are inclusive of any applicable fees unless otherwise
              stated. We reserve the right to change pricing at any time;
              existing purchases are not affected.
            </p>

            <h3>5.2 Payment Processing</h3>
            <p>
              Payments are processed through a secure third-party payment
              provider. We do not store your full payment card details on our
              servers. By completing a purchase, you agree to the payment
              provider&rsquo;s terms of service.
            </p>

            <h3>5.3 Refund Policy</h3>
            <p>
              Because build kits are digital products delivered immediately upon
              purchase, <strong>all sales are final</strong>. We do not offer
              refunds once a kit has been unlocked and its content made available
              to you. If you experience a technical issue preventing access to
              purchased content, contact us at{" "}
              <a
                href="mailto:support@buildthisnow.com"
                className="text-primary hover:underline"
              >
                support@buildthisnow.com
              </a>{" "}
              and we will resolve the issue.
            </p>
          </section>

          <section>
            <h2>6. Intellectual Property</h2>
            <h3>6.1 Our Content</h3>
            <p>
              All content on the Platform — including but not limited to build
              plans, prompts, architecture documents, market research, starter
              files, designs, and copy — is owned by Build This Now and protected
              by intellectual property laws. Unauthorized reproduction,
              distribution, or resale of our content is prohibited.
            </p>

            <h3>6.2 Your License</h3>
            <p>
              When you purchase a build kit, you receive a{" "}
              <strong>
                non-exclusive, non-transferable, personal license
              </strong>{" "}
              to use the kit&rsquo;s contents to build software for your own
              projects, whether personal or commercial. You may not resell,
              redistribute, or share the kit contents themselves (the prompts,
              plans, and starter files) as a standalone product.
            </p>

            <h3>6.3 What You Build</h3>
            <p>
              Software you build using our kits belongs entirely to you. We claim
              no ownership over the applications, products, or businesses you
              create by following our build plans.
            </p>
          </section>

          <section>
            <h2>7. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                Share, resell, or redistribute purchased kit content to third
                parties
              </li>
              <li>
                Use automated tools to scrape, crawl, or bulk-download content
                from the Platform
              </li>
              <li>
                Attempt to gain unauthorized access to other users&rsquo;
                accounts or our systems
              </li>
              <li>
                Use the Platform for any unlawful purpose or in violation of
                applicable laws
              </li>
              <li>
                Circumvent or interfere with any security or access-control
                features of the Platform
              </li>
            </ul>
          </section>

          <section>
            <h2>8. Disclaimers</h2>
            <h3>8.1 No Guarantee of Results</h3>
            <p>
              Build kits are educational and instructional in nature. We provide
              validated ideas and structured build plans, but we do not guarantee
              any specific business outcome, revenue, or success. Results depend
              on your execution, market conditions, and many factors outside our
              control.
            </p>

            <h3>8.2 &ldquo;As Is&rdquo; Service</h3>
            <p>
              The Platform and all content are provided &ldquo;as is&rdquo; and
              &ldquo;as available&rdquo; without warranties of any kind, whether
              express or implied, including but not limited to implied warranties
              of merchantability, fitness for a particular purpose, and
              non-infringement.
            </p>

            <h3>8.3 Third-Party Tools</h3>
            <p>
              Build kits may reference third-party tools, services, and APIs. We
              are not responsible for the availability, pricing, or terms of
              third-party services. You are responsible for complying with any
              third-party terms when using those tools.
            </p>
          </section>

          <section>
            <h2>9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, Kairo Ventures,
              its officers, directors, employees, and agents shall not be liable
              for any indirect, incidental, special, consequential, or punitive
              damages, or any loss of profits, revenue, data, or business
              opportunities, arising out of or related to your use of the
              Platform, whether based on warranty, contract, tort, or any other
              legal theory. Our total liability for any claim arising from these
              Terms shall not exceed the amount you paid to us in the twelve (12)
              months preceding the claim.
            </p>
          </section>

          <section>
            <h2>10. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Kairo Ventures from any
              claims, damages, losses, or expenses (including reasonable legal
              fees) arising from your use of the Platform, your violation of
              these Terms, or your violation of any third-party rights.
            </p>
          </section>

          <section>
            <h2>11. Modifications to Terms</h2>
            <p>
              We may update these Terms from time to time. Material changes will
              be communicated via email or a notice on the Platform. Continued
              use of the Platform after changes constitutes acceptance. We
              encourage you to review these Terms periodically.
            </p>
          </section>

          <section>
            <h2>12. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account at our
              sole discretion for violation of these Terms. Upon termination, you
              retain access to previously purchased kit content, but your right
              to use the Platform and purchase new kits is revoked.
            </p>
          </section>

          <section>
            <h2>13. Governing Law</h2>
            <p>
              These Terms are governed by and construed in accordance with the
              laws of the United Arab Emirates. Any disputes arising from these
              Terms shall be subject to the exclusive jurisdiction of the courts
              of Dubai, UAE.
            </p>
          </section>

          <section>
            <h2>14. Contact</h2>
            <p>
              If you have questions about these Terms, reach out to us at{" "}
              <a
                href="mailto:legal@buildthisnow.com"
                className="text-primary hover:underline"
              >
                legal@buildthisnow.com
              </a>
              .
            </p>
          </section>
        </div>

        <footer className="mt-16 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            See also our{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </footer>
      </div>
    </main>
  );
}
