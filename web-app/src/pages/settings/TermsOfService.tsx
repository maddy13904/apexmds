import Layout from "../../components/Layout";
import Card from "../../components/ui/Card";

export default function TermsOfService() {
  return (
    <Layout>

      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Terms of Service
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Last updated: January 29, 2026
          </p>
        </div>


        {/* Info Card */}
        <Card>
          <div className="flex gap-3">

            <div className="text-blue-600 text-xl">
              📄
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">
                Important Information
              </h3>

              <p className="text-sm text-slate-600 mt-1">
                Please read these terms carefully before using ApexMDS.
                By accessing or using our platform, you agree to be bound
                by these Terms of Service.
              </p>
            </div>

          </div>
        </Card>


        {/* Terms Card */}
        <Card>

          <div className="space-y-6 text-sm text-slate-700">

            <Section
              title="1. Acceptance of Terms"
              text={[
                "By accessing and using ApexMDS - AI Based NEET MDS Preparation Platform, you accept and agree to be bound by these terms.",
                "If you do not agree with these Terms of Service, please discontinue use of the platform."
              ]}
            />

            <Section
              title="2. Use of Service"
              text={[
                "ApexMDS provides an educational platform for NEET MDS exam preparation. You agree to use the service only for lawful purposes."
              ]}
              bullets={[
                "You must be at least 18 years old to use this platform",
                "You are responsible for maintaining account confidentiality",
                "You agree not to share your login credentials",
                "You will not misuse the service for illegal purposes"
              ]}
            />

            <Section
              title="3. Intellectual Property"
              text={[
                "All content on the platform including text, graphics, study materials, and software is owned by ApexMDS and protected by copyright laws.",
                "Users may not reproduce, distribute, or redistribute any materials without permission."
              ]}
            />

            <Section
              title="4. User Conduct"
              bullets={[
                "Do not upload or share unlawful content",
                "Do not attempt unauthorized access to the system",
                "Do not disrupt platform services",
                "Do not impersonate other users"
              ]}
            />

            <Section
              title="5. Subscription and Payment"
              bullets={[
                "Users must provide accurate billing information",
                "Subscription fees must be paid on time",
                "Subscriptions may renew automatically unless cancelled",
                "Refunds follow the ApexMDS refund policy"
              ]}
            />

            <Section
              title="6. Disclaimers"
              bullets={[
                "The service may occasionally experience interruptions or errors",
                "ApexMDS does not guarantee exam results",
                "Content accuracy is continuously improved but not guaranteed"
              ]}
            />

            <Section
              title="7. Termination"
              text={[
                "ApexMDS reserves the right to suspend or terminate accounts that violate these Terms of Service."
              ]}
            />

            <Section
              title="8. Changes to Terms"
              text={[
                "We may update these Terms from time to time. Continued use of the platform indicates acceptance of the updated terms."
              ]}
            />

            <Section
              title="9. Governing Law"
              text={[
                "These Terms shall be governed and interpreted under the laws of India."
              ]}
            />

            <Section
              title="10. Contact Information"
              text={[
                "ApexMDS Support Team"
              ]}
            />

            <div className="space-y-1">

              <p>
                Email:{" "}
                  SIMATS Engineering
              </p>

            </div>

          </div>

        </Card>


        {/* Footer */}
        <p className="text-xs text-center text-slate-500">
          By using ApexMDS, you acknowledge that you have read and understood
          these Terms of Service.
        </p>

      </div>

    </Layout>
  );
}


/* Section Component */

function Section({
  title,
  text,
  bullets
}: {
  title: string;
  text?: string[];
  bullets?: string[];
}) {
  return (
    <div>

      <h3 className="font-semibold text-slate-900 mb-2">
        {title}
      </h3>

      {text &&
        text.map((t, i) => (
          <p key={i} className="mb-1">
            {t}
          </p>
        ))}

      {bullets &&
        bullets.map((b, i) => (
          <div key={i} className="flex gap-2 mb-1">
            <span>•</span>
            <span>{b}</span>
          </div>
        ))}

    </div>
  );
}