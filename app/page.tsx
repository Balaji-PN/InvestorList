import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center py-20 px-4 text-center bg-gradient-to-b from-background to-secondary/20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
        <h1 className="text-4xl md:text-6xl font-bold mb-6 hero-text">
          Raise Capital for Your
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"> Business</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
          Connect with top investors and raise funds for your startup. Access our comprehensive database of active investors.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Link href="/signin">
            <Button size="lg" className="text-lg px-8">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl w-full">
          {[
            "500+ Active Investors",
            "Verified Contacts",
            "Regular Updates",
          ].map((feature) => (
            <div key={feature} className="flex items-center justify-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-secondary/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Everything You Need to
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"> Raise Funds</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Investor Database"
              description="Access our curated database of active investors, complete with verified contact information and investment preferences."
              icon="🎯"
            />
            <FeatureCard
              title="Pitch Deck Review"
              description="Get expert feedback on your pitch deck from experienced investors and fundraising specialists."
              icon="📊"
            />
            <FeatureCard
              title="Fundraising Support"
              description="Receive guidance throughout your fundraising journey with our expert support team."
              icon="🤝"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Fundraising Journey?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of founders who have successfully raised capital through our platform
          </p>
          <Link href="/signin">
            <Button size="lg" className="text-lg px-8">
              Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="p-6 rounded-xl bg-card border hover:border-primary/60 transition-all duration-300 hover:shadow-lg">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
