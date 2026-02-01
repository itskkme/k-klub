
import React from 'react';
import Navbar from "@/components/layout/Navbar";

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
                <h1 className="font-display text-4xl mb-8">Terms of Service</h1>

                <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
                    <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
                        <p>By accessing or using K-Klub, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3">2. Use License</h2>
                        <p>Permission is granted to temporarily download one copy of the materials (information or software) on K-Klub's website for personal, non-commercial transitory viewing only.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3">3. Disclaimer</h2>
                        <p>The materials on K-Klub's website are provided on an 'as is' basis. K-Klub makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3">4. Limitations</h2>
                        <p>In no event shall K-Klub or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on K-Klub's website.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3">5. Affiliate Links</h2>
                        <p>Our website contains links to third-party websites and services. If you click on an affiliate link and make a purchase, we may receive a commission. We are not responsible for the content or practices of these third-party sites.</p>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default TermsOfService;
