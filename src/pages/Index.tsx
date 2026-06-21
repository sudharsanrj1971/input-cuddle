import { ContactForm } from "@/components/ContactForm";
import { Shield, Zap, CheckCircle } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Real-time Validation",
    description: "Instant feedback as you type with client-side validation",
  },
  {
    icon: Shield,
    title: "Server-side Security",
    description: "All data is validated on the server before storage",
  },
  {
    icon: CheckCircle,
    title: "Secure Storage",
    description: "Your submissions are safely stored in our database",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen page-gradient">
      {/* Hero Section */}
      <header className="pt-16 pb-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
            <Shield className="h-4 w-4" />
            Secure Form Validation
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4 tracking-tight">
            Form Validation <span className="text-primary">Demo</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Experience robust client-side and server-side validation with real-time feedback 
            and secure data storage.
          </p>
        </div>
      </header>

      {/* Features */}
      <section className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex items-start gap-4 p-5 rounded-xl bg-card/50 backdrop-blur border border-border/50"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <main className="px-6 pb-20">
        <div className="max-w-2xl mx-auto">
          <ContactForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground">
            Built with React, Zod validation, and Lovable Cloud
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
