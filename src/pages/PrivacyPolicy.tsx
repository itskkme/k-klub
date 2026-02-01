
import React from 'react';
import Navbar from "@/components/layout/Navbar";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
                <h1 className="font-display text-4xl mb-8">Privacy Policy</h1>

                <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
                    <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
                        <p>We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us. This may include your name, email address, and any other information you choose to provide.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
                        <p>We use the information we collect to:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Provide, maintain, and improve our services;</li>
                            <li>Send you technical notices, updates, security alerts, and support messages;</li>
                            <li>Respond to your comments, questions, and customer service requests;</li>
                            <li>Communicate with you about products, services, offers, and events.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3">3. Affiliate Disclosure</h2>
                        <p>K-Klub is a participant in various affiliate marketing programs, which means we may get paid commissions on editorially chosen products purchased through our links to retailer sites.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3">4. Cookies</h2>
                        <p>We use cookies and similar tracking technologies to track the activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3">5. Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy, please contact us at support@k-klub.com.</p>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default PrivacyPolicy;
