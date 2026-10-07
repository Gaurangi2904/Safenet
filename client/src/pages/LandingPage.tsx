import { useNavigate } from "react-router-dom";
import {
    ShieldCheck,
    HeartHandshake,
    Scale,
    LockKeyhole,
    ArrowRight,
    AlertTriangle,
    Home,
    Footprints,
    Smartphone,
    GraduationCap,
    BriefcaseBusiness,
    HandCoins,
    Baby,
    FileText,
    Heart,
    BookOpen,
    Zap,
    Users,
    ClipboardCheck,
    Eye,
    MapPin,
    MessageCircle
} from "lucide-react";

const safetyAreas = [
    {
        icon: Home,
        title: "Domestic Abuse",
        description:
            "Support for physical, emotional, sexual and economic abuse."
    },
    {
        icon: Footprints,
        title: "Stalking",
        description:
            "Tools and guidance for stalking and repeated unwanted contact."
    },
    {
        icon: Smartphone,
        title: "Online Harassment",
        description:
            "Support for digital abuse, threats and online harassment."
    },
    {
        icon: GraduationCap,
        title: "College Safety",
        description:
            "Safety support for students and college-related harassment."
    },
    {
        icon: BriefcaseBusiness,
        title: "Workplace Safety",
        description:
            "Resources for workplace harassment and unsafe situations."
    },
    {
        icon: HandCoins,
        title: "Dowry Harassment",
        description:
            "Document pressure, threats and harassment related to dowry."
    },
    {
        icon: Baby,
        title: "Pregnancy Pressure",
        description:
            "Support for pregnancy and reproductive coercion."
    },
    {
        icon: AlertTriangle,
        title: "Public Harassment",
        description:
            "Guidance and safety tools for harassment in public spaces."
    }
];

const platformFeatures = [
    {
        icon: ShieldCheck,
        title: "Safety First",
        description:
            "Emergency tools, safety journeys, check-ins and trusted contacts."
    },
    {
        icon: Scale,
        title: "Know Your Rights",
        description:
            "Access safety and rights information in one place."
    },
    {
        icon: LockKeyhole,
        title: "Privacy by Design",
        description:
            "Private documentation, protected evidence and controlled access."
    },
    {
        icon: HeartHandshake,
        title: "Get Support",
        description:
            "Connect with trusted people and discover relevant support resources."
    }
];

const whyChooseFeatures = [
    {
        icon: LockKeyhole,
        title: "Privacy First",
        description:
            "Your personal safety information is designed to remain private and under your control."
    },
    {
        icon: Zap,
        title: "Quick Access",
        description:
            "Important safety tools are organized so you can reach what you need quickly."
    },
    {
        icon: ClipboardCheck,
        title: "Document Safely",
        description:
            "Keep important notes, incidents and evidence organized for future reference."
    },
    {
        icon: Scale,
        title: "Know Your Rights",
        description:
            "Understand your rights and find practical information for difficult situations."
    },
    {
        icon: Users,
        title: "Trusted Support",
        description:
            "Keep trusted contacts and useful support resources close when you need them."
    },
    {
        icon: MapPin,
        title: "Plan Ahead",
        description:
            "Prepare safety plans, journeys and check-ins before a situation becomes urgent."
    }
];

const howItWorksSteps = [
    {
        number: "01",
        icon: Eye,
        title: "Recognize",
        description:
            "Understand different forms of abuse, harassment, coercion and unsafe situations."
    },
    {
        number: "02",
        icon: ClipboardCheck,
        title: "Prepare",
        description:
            "Create safety plans, add trusted contacts and organize important information."
    },
    {
        number: "03",
        icon: ShieldCheck,
        title: "Protect",
        description:
            "Use safety tools such as check-ins, journeys, location protection and emergency access."
    },
    {
        number: "04",
        icon: MessageCircle,
        title: "Get Support",
        description:
            "Find practical resources and learn how to seek help or support someone else."
    }
];

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="landing-page">

            {/* NAVBAR */}
            <nav className="landing-navbar">
                <div
                    className="brand"
                    onClick={() => navigate("/")}
                >
                    <div className="brand-icon">
                        <ShieldCheck size={26} />
                    </div>

                    <div>
                        <div className="brand-name">
                            SAFENET
                        </div>

                        <div className="brand-tagline">
                            Safety • Rights • Support
                        </div>
                    </div>
                </div>

                <div className="nav-actions">
                    <button
                        className="nav-login"
                        onClick={() => navigate("/login")}
                        type="button"
                    >
                        Login
                    </button>

                    <button
                        className="nav-register"
                        onClick={() => navigate("/register")}
                        type="button"
                    >
                        Get Started
                    </button>
                </div>
            </nav>


            {/* HERO */}
            <section className="hero-section">

                <div className="hero-content">

                    <div className="hero-badge">
                        <ShieldCheck size={17} />
                        Privacy-first women's safety platform
                    </div>

                    <h1>
                        Your safety.
                        <br />
                        Your rights.
                        <br />
                        <span>Your voice.</span>
                    </h1>

                    <p className="hero-description">
                        SAFENET helps women recognize risks, prepare for
                        emergencies, access support, securely document
                        incidents and understand their rights.
                    </p>

                    <div className="hero-buttons">

                        <button
                            className="primary-button"
                            onClick={() => navigate("/register")}
                            type="button"
                        >
                            Get Started
                            <ArrowRight size={19} />
                        </button>

                        <button
                            className="danger-button"
                            onClick={() => navigate("/login")}
                            type="button"
                        >
                            <AlertTriangle size={19} />
                            I'm in Immediate Danger
                        </button>

                    </div>

                    <p className="hero-note">
                        SAFENET is an assistive platform and does not replace
                        emergency responders or professional legal services.
                    </p>

                </div>


                {/* SAFETY ACTION CARD */}
                <div className="hero-action-card">

                    <div className="action-card-header">

                        <div className="action-shield">
                            <ShieldCheck size={25} />
                        </div>

                        <div>
                            <h3>SAFENET SAFE ACTION</h3>
                            <p>Choose what you need help with</p>
                        </div>

                    </div>

                    <div className="action-grid">

                        <button
                            onClick={() => navigate("/register")}
                            type="button"
                        >
                            <AlertTriangle size={20} />
                            <span>Immediate Danger</span>
                        </button>

                        <button
                            onClick={() => navigate("/register")}
                            type="button"
                        >
                            <Home size={20} />
                            <span>Abuse at Home</span>
                        </button>

                        <button
                            onClick={() => navigate("/register")}
                            type="button"
                        >
                            <Footprints size={20} />
                            <span>Stalking</span>
                        </button>

                        <button
                            onClick={() => navigate("/register")}
                            type="button"
                        >
                            <Smartphone size={20} />
                            <span>Online Abuse</span>
                        </button>

                        <button
                            onClick={() => navigate("/register")}
                            type="button"
                        >
                            <GraduationCap size={20} />
                            <span>College</span>
                        </button>

                        <button
                            onClick={() => navigate("/register")}
                            type="button"
                        >
                            <BriefcaseBusiness size={20} />
                            <span>Workplace</span>
                        </button>

                        <button
                            onClick={() => navigate("/register")}
                            type="button"
                        >
                            <HandCoins size={20} />
                            <span>Dowry Pressure</span>
                        </button>

                        <button
                            onClick={() => navigate("/register")}
                            type="button"
                        >
                            <Baby size={20} />
                            <span>Pregnancy Pressure</span>
                        </button>

                    </div>

                    <button
                        className="action-more"
                        onClick={() => navigate("/register")}
                        type="button"
                    >
                        Explore all safety options
                        <ArrowRight size={17} />
                    </button>

                </div>

            </section>


            {/* PLATFORM FEATURES */}
            <section className="features-section">

                <div className="section-heading">

                    <span>
                        BUILT AROUND YOUR SAFETY
                    </span>

                    <h2>
                        More than an emergency button.
                    </h2>

                    <p>
                        SAFENET brings safety planning, rights information,
                        documentation and support together in one platform.
                    </p>

                </div>

                <div className="feature-grid">

                    {platformFeatures.map((feature) => {

                        const Icon = feature.icon;

                        return (
                            <div
                                className="feature-card"
                                key={feature.title}
                            >
                                <div className="feature-icon">
                                    <Icon size={24} />
                                </div>

                                <h3>
                                    {feature.title}
                                </h3>

                                <p>
                                    {feature.description}
                                </p>
                            </div>
                        );

                    })}

                </div>

            </section>


            {/* WHY CHOOSE SAFENET */}
            <section className="why-choose-section">

                <div className="section-heading">

                    <span>
                        WHY CHOOSE SAFENET
                    </span>

                    <h2>
                        Safety tools designed around real needs.
                    </h2>

                    <p>
                        SAFENET brings practical safety features, privacy,
                        planning and support into one connected experience.
                    </p>

                </div>

                <div className="why-choose-grid">

                    {whyChooseFeatures.map((feature) => {

                        const Icon = feature.icon;

                        return (
                            <div
                                className="why-choose-card"
                                key={feature.title}
                            >
                                <div className="why-choose-icon">
                                    <Icon size={23} />
                                </div>

                                <div>
                                    <h3>
                                        {feature.title}
                                    </h3>

                                    <p>
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        );

                    })}

                </div>

            </section>


            {/* HOW SAFENET WORKS */}
            <section className="how-it-works-section">

                <div className="section-heading">

                    <span>
                        HOW SAFENET WORKS
                    </span>

                    <h2>
                        From awareness to action.
                    </h2>

                    <p>
                        SAFENET helps you move from understanding a situation
                        to preparing, protecting yourself and finding support.
                    </p>

                </div>

                <div className="how-it-works-grid">

                    {howItWorksSteps.map((step) => {

                        const Icon = step.icon;

                        return (
                            <div
                                className="how-it-works-card"
                                key={step.number}
                            >

                                <div className="step-top">

                                    <span className="step-number">
                                        {step.number}
                                    </span>

                                    <div className="step-icon">
                                        <Icon size={22} />
                                    </div>

                                </div>

                                <h3>
                                    {step.title}
                                </h3>

                                <p>
                                    {step.description}
                                </p>

                            </div>
                        );

                    })}

                </div>

            </section>


            {/* SAFETY AREAS */}
            <section className="areas-section">

                <div className="section-heading">

                    <span>
                        SAFETY & RIGHTS
                    </span>

                    <h2>
                        Support for real-life situations.
                    </h2>

                    <p>
                        SAFENET is designed around different forms of
                        harassment, abuse, coercion and safety concerns.
                    </p>

                </div>

                <div className="areas-grid">

                    {safetyAreas.map((area) => {

                        const Icon = area.icon;

                        return (
                            <div
                                className="area-card"
                                key={area.title}
                            >
                                <Icon size={22} />

                                <div>
                                    <h3>
                                        {area.title}
                                    </h3>

                                    <p>
                                        {area.description}
                                    </p>
                                </div>
                            </div>
                        );

                    })}

                </div>

            </section>


            {/* CTA */}
            <section className="cta-section">

                <div className="cta-icon">
                    <ShieldCheck size={30} />
                </div>

                <h2>
                    You deserve to feel safe.
                </h2>

                <p>
                    Prepare. Protect. Document. Know your rights.
                </p>

                <button
                    className="primary-button"
                    onClick={() => navigate("/register")}
                    type="button"
                >
                    Create Your SAFENET Account
                    <ArrowRight size={19} />
                </button>

            </section>


            {/* FOOTER */}
            <footer className="landing-footer">

                <div className="footer-brand">
                    <ShieldCheck size={21} />
                    <strong>
                        SAFENET
                    </strong>
                </div>

                <p>
                    Safety • Rights • Support
                </p>

                <div className="footer-links">

                    <span>
                        <FileText size={15} />
                        Private Documentation
                    </span>

                    <span>
                        <BookOpen size={15} />
                        Safety Resources
                    </span>

                    <span>
                        <Heart size={15} />
                        Built for Safety
                    </span>

                </div>

            </footer>

        </div>
    );
}