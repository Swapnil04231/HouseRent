import { Info, Users, ShieldCheck, Mail } from 'lucide-react';
import './About.css';

const About = () => {
    return (
        <div className="about-container container fade-in">
            <header className="about-header text-center">
                <h1>About <span className="highlight">HouseRent</span></h1>
                <p>Your trusted partner in finding the perfect residential space.</p>
            </header>

            <section className="about-grid">
                <div className="about-card glass-card">
                    <div className="icon-wrapper"><Users size={32} /></div>
                    <h3>Who We Are</h3>
                    <p>We are a dedicated team of real estate experts and tech enthusiasts working to simplify the house hunting process for everyone.</p>
                </div>

                <div className="about-card glass-card">
                    <div className="icon-wrapper"><ShieldCheck size={32} /></div>
                    <h3>Our Mission</h3>
                    <p>Our mission is to provide a seamless, secure, and transparent platform for both homeowners and potential tenants.</p>
                </div>

                <div className="about-card glass-card">
                    <div className="icon-wrapper"><Info size={32} /></div>
                    <h3>Why Choose Us</h3>
                    <p>With verified listings, secure booking systems, and a user-friendly interface, we ensure your next home is just a click away.</p>
                </div>
            </section>

            <section className="contact-cta glass-card">
                <h2>Have Questions?</h2>
                <p>Our support team is available 24/7 to help you with your property needs.</p>
                <button className="btn btn-primary"><Mail size={20} /> Contact Support</button>
            </section>
        </div>
    );
};

export default About;
