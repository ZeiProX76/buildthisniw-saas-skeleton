import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Build This Now",
  description:
    "Privacy Policy for Build This Now. Learn how we collect, use, and protect your personal data.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: March 9, 2026
          </p>
        </header>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-10 text-muted-foreground [&_h2]:text-foreground [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-0 [&_h3]:text-foreground [&_h3]:text-base [&_h3]:font-medium [&_strong]:text-foreground">
          <section>
            <h2>1. Who We Are</h2>
            <p>
              Kairo Ventures (&ldquo;we,&rdquo; &ldquo;us,&rdquo;
              &ldquo;our&rdquo;) is a company registered in the Dubai
              free zone in Dubai, United Arab Emirates. We operate the Build This Now platform at{" "}
              <strong>buildthisnow.com</strong> (&ldquo;the Platform&rdquo;).
              This Privacy Policy explains how we collect, use, store, and
              protect your personal data when you use the Platform.
            </p>
          </section>

          <section>
            <h2>2. Data We Collect</h2>

            <h3>2.1 Information You Provide</h3>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Account data:</strong> email address, full name, and
                profile avatar when you create an account
              </li>
              <li>
                <strong>Onboarding preferences:</strong> experience level,
                interests, and motivations you share during onboarding
              </li>
              <li>
                <strong>Payment data:</strong> processed securely by our
                third-party payment provider — we receive a transaction
                reference, purchase amount, and confirmation status but{" "}
                <strong>never</strong> your full card number or bank details
              </li>
              <li>
                <strong>Support communications:</strong> any messages you send
                us via email
              </li>
            </ul>

            <h3>2.2 Information Collected Automatically</h3>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Usage data:</strong> pages viewed, build kits browsed,
                steps completed, and feature interactions
              </li>
              <li>
                <strong>Device and browser data:</strong> IP address, browser
                type, operating system, screen resolution, and language
                preferences
              </li>
              <li>
                <strong>Cookies and local storage:</strong> session tokens for
                authentication, preferences, and anonymous analytics identifiers
              </li>
              <li>
                <strong>Bot protection data:</strong> we use a third-party
                challenge service on forms to distinguish real users from
                automated traffic — this service may collect device signals for
                verification purposes
              </li>
            </ul>
          </section>

          <section>
            <h2>3. How We Use Your Data</h2>
            <p>We use your personal data to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                Create and maintain your account, authenticate your sessions,
                and secure access to purchased content
              </li>
              <li>
                Process purchases and deliver digital build kits you have bought
              </li>
              <li>
                Track your build progress so you can resume where you left off
              </li>
              <li>
                Personalize your experience based on your onboarding preferences
                (experience level, interests)
              </li>
              <li>
                Send transactional emails: account verification, password
                resets, and purchase confirmations
              </li>
              <li>
                Improve the Platform through aggregated, anonymized usage
                analytics
              </li>
              <li>
                Prevent fraud, abuse, and unauthorized access to the Platform
              </li>
            </ul>
            <p>
              We do <strong>not</strong> sell your personal data. We do{" "}
              <strong>not</strong> use your data for third-party advertising. We
              do <strong>not</strong> send marketing emails unless you explicitly
              opt in.
            </p>
          </section>

          <section>
            <h2>4. Legal Basis for Processing</h2>
            <p>We process your data on the following grounds:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Contract performance:</strong> to deliver the services
                you have purchased or signed up for
              </li>
              <li>
                <strong>Legitimate interest:</strong> to improve our Platform,
                prevent fraud, and ensure security
              </li>
              <li>
                <strong>Consent:</strong> where required, such as for optional
                marketing communications
              </li>
              <li>
                <strong>Legal obligation:</strong> to comply with applicable laws
                and regulations in the UAE
              </li>
            </ul>
          </section>

          <section>
            <h2>5. Third-Party Service Providers</h2>
            <p>
              We use trusted third-party services to operate the Platform. These
              providers process data on our behalf and are contractually required
              to protect it. Categories of providers include:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Authentication and database hosting:</strong> secure
                cloud infrastructure for storing your account and content data
              </li>
              <li>
                <strong>Payment processing:</strong> handles payment
                transactions — we never see or store your full payment details
              </li>
              <li>
                <strong>Email delivery:</strong> sends transactional emails on
                our behalf (verification codes, password resets)
              </li>
              <li>
                <strong>Application hosting:</strong> serves the Platform from
                global edge locations for fast performance
              </li>
              <li>
                <strong>Bot protection:</strong> verifies form submissions are
                from real users
              </li>
            </ul>
            <p>
              We do not share your personal data with any third party beyond what
              is necessary to operate and secure the Platform.
            </p>
          </section>

          <section>
            <h2>6. Data Retention</h2>
            <p>
              We retain your personal data for as long as your account is active
              or as needed to provide services. Specifically:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Account data:</strong> retained while your account
                exists, deleted within 30 days of account deletion
              </li>
              <li>
                <strong>Purchase records:</strong> retained for 7 years to
                comply with financial record-keeping requirements
              </li>
              <li>
                <strong>Usage analytics:</strong> anonymized and aggregated —
                individual records are purged after 90 days
              </li>
              <li>
                <strong>Support emails:</strong> retained for up to 2 years,
                then deleted
              </li>
            </ul>
          </section>

          <section>
            <h2>7. Your Rights</h2>
            <p>
              Depending on your location, you may have the following rights
              regarding your personal data:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Access:</strong> request a copy of the personal data we
                hold about you
              </li>
              <li>
                <strong>Correction:</strong> request correction of inaccurate or
                incomplete data
              </li>
              <li>
                <strong>Deletion:</strong> request deletion of your personal
                data (subject to legal retention obligations)
              </li>
              <li>
                <strong>Portability:</strong> request your data in a structured,
                machine-readable format
              </li>
              <li>
                <strong>Objection:</strong> object to processing based on
                legitimate interest
              </li>
              <li>
                <strong>Withdrawal of consent:</strong> withdraw consent at any
                time where processing is consent-based
              </li>
            </ul>
            <p>
              To exercise any of these rights, email us at{" "}
              <a
                href="mailto:privacy@buildthisnow.com"
                className="text-primary hover:underline"
              >
                privacy@buildthisnow.com
              </a>
              . We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2>8. Cookies</h2>
            <p>We use the following types of cookies:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Essential cookies:</strong> authentication session
                tokens required for the Platform to function — these cannot be
                disabled
              </li>
              <li>
                <strong>Preference cookies:</strong> remember your settings such
                as theme preference (light/dark mode)
              </li>
              <li>
                <strong>Analytics cookies:</strong> help us understand how the
                Platform is used in aggregate — no personal identification
              </li>
            </ul>
            <p>
              We do not use advertising or tracking cookies. We do not
              participate in cross-site tracking or retargeting networks.
            </p>
          </section>

          <section>
            <h2>9. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your
              data:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                All data in transit is encrypted using TLS (HTTPS)
              </li>
              <li>
                Database access is restricted by row-level security policies —
                users can only access their own data
              </li>
              <li>
                Authentication sessions use secure, HTTP-only cookies that are
                not accessible to client-side scripts
              </li>
              <li>
                Passwords are hashed using industry-standard algorithms — we
                never store passwords in plain text
              </li>
              <li>
                Payment processing is handled entirely by a PCI DSS-compliant
                provider
              </li>
            </ul>
            <p>
              While we take every reasonable precaution, no system is completely
              immune to security threats. We will notify affected users promptly
              in the event of a data breach.
            </p>
          </section>

          <section>
            <h2>10. International Transfers</h2>
            <p>
              Your data may be processed in locations outside the UAE, including
              regions where our infrastructure providers operate. We ensure that
              any international transfer of personal data is protected by
              appropriate safeguards, including contractual commitments from our
              service providers to maintain equivalent levels of data
              protection.
            </p>
          </section>

          <section>
            <h2>11. Children&rsquo;s Privacy</h2>
            <p>
              The Platform is not intended for anyone under the age of 18. We do
              not knowingly collect personal data from minors. If we become aware
              that we have collected data from someone under 18, we will delete
              it promptly.
            </p>
          </section>

          <section>
            <h2>12. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Material
              changes will be communicated via email or a prominent notice on the
              Platform. The &ldquo;last updated&rdquo; date at the top of this
              page reflects the most recent revision.
            </p>
          </section>

          <section>
            <h2>13. Contact</h2>
            <p>
              For any privacy-related questions or to exercise your data rights,
              contact us at{" "}
              <a
                href="mailto:privacy@buildthisnow.com"
                className="text-primary hover:underline"
              >
                privacy@buildthisnow.com
              </a>
              .
            </p>
          </section>
        </div>

        <footer className="mt-16 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            See also our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>
            .
          </p>
        </footer>
      </div>
    </main>
  );
}
