import Layout from "../../components/Layout";
import Card from "../../components/ui/Card";

export default function PrivacyPolicy() {
  return (
    <Layout>

      <div className="max-w-4xl mx-auto space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Privacy Policy
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Last updated: January 29, 2026
          </p>
        </div>


        <Card>

          <div className="space-y-6 text-sm text-slate-700">

            <Section
              title="1. Information We Collect"
              bullets={[
                "Name and email address",
                "Account login information",
                "Study progress and analytics",
                "Device and usage information"
              ]}
            />

            <Section
              title="2. How We Use Your Data"
              bullets={[
                "Provide personalized study analytics",
                "Improve learning recommendations",
                "Enhance platform performance",
                "Communicate important updates"
              ]}
            />

            <Section
              title="3. Data Protection"
              text={[
                "We use industry-standard security practices to protect your information."
              ]}
            />

            <Section
              title="4. Third Party Services"
              text={[
                "ApexMDS may use secure third-party services such as cloud hosting or analytics providers."
              ]}
            />

            <Section
              title="5. User Rights"
              bullets={[
                "Request deletion of your data",
                "Download your data",
                "Update account information"
              ]}
            />

            <Section
              title="6. Contact Us"
              text={[
                "For privacy concerns contact:"
              ]}
            />

            <p>
              Contact:{" "}
                SIMATS Engineering
            </p>

          </div>

        </Card>

      </div>

    </Layout>
  );
}


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