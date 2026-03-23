import Layout from "../../components/Layout";
import Card from "../../components/ui/Card";

export default function AboutApexMDS() {
  return (
    <Layout>

      <div className="max-w-4xl mx-auto space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            About ApexMDS
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            AI Powered NEET MDS Preparation Platform
          </p>
        </div>


        <Card>

          <div className="space-y-4 text-sm text-slate-700">

            <p>
              ApexMDS is an intelligent preparation platform designed to
              help students succeed in the NEET MDS examination.
            </p>

            <p>
              Our platform combines AI-powered tutoring, performance
              analytics, and structured study tools to help students
              identify weak areas and improve their scores efficiently.
            </p>

          </div>

        </Card>


        <Card>

          <h3 className="font-semibold text-slate-900 mb-3">
            Key Features
          </h3>

          <div className="space-y-2 text-sm text-slate-700">

            <Feature text="Practice MCQs with detailed explanations" />
            <Feature text="AI Tutor for concept learning" />
            <Feature text="Advanced performance analytics" />
            <Feature text="Mock test simulations" />
            <Feature text="Daily study planning tools" />
            <Feature text="Offline e-book access" />

          </div>

        </Card>


        <Card>

          <h3 className="font-semibold text-slate-900 mb-2">
            Version
          </h3>

          <p className="text-sm text-slate-600">
            ApexMDS Platform Version 1.0.0
          </p>

        </Card>

      </div>

    </Layout>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex gap-2">
      <span>•</span>
      <span>{text}</span>
    </div>
  );
}