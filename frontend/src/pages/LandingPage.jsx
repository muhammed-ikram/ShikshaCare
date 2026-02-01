import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, HeartPulse, ShieldCheck, Sparkles, Zap, Smartphone } from "lucide-react";
import AestheticBackground from "../components/AestheticBackground";

const LandingPage = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <div className="relative min-h-screen selection:bg-indigo-100 selection:text-indigo-900">
            <AestheticBackground />

            {/* Navbar */}
            <nav className="fixed w-full z-50 px-6 py-4">
                <div className="max-w-7xl mx-auto">
                    <div className="glass px-6 py-3 rounded-2xl flex justify-between items-center shadow-2xl shadow-indigo-500/10">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/40">
                                <Sparkles className="text-white w-6 h-6" />
                            </div>
                            <span className="text-2xl font-black tracking-tight text-slate-900">
                                Shiksha<span className="text-indigo-600">Care</span>
                            </span>
                        </div>
                        <div className="flex items-center space-x-6">
                            <Link to="/login" className="text-slate-600 hover:text-indigo-600 font-semibold transition-all">Login</Link>
                            <Link to="/register" className="bg-indigo-600 hover:bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 lg:pt-56 lg:pb-32 px-6">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-7xl mx-auto relative z-10 text-center"
                >
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-bold mb-8">
                        <Zap size={16} />
                        <span>The Future of Personalized Learning & Health</span>
                    </motion.div>

                    <motion.h1
                        variants={itemVariants}
                        className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-[0.9] mb-8"
                    >
                        Learn faster. <br />
                        <span className="text-gradient">Live better.</span>
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="mt-4 max-w-2xl mx-auto text-xl text-slate-600 mb-12 font-medium leading-relaxed"
                    >
                        ShikshaCare uses predictive AI to build a unique Digital Twin of your skills and health, guiding you towards your peak potential.
                    </motion.p>

                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row justify-center gap-4"
                    >
                        <Link to="/register" className="group bg-slate-900 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/20 hover:shadow-indigo-500/40 active:scale-95">
                            Start Your Journey <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button className="px-10 py-5 rounded-2xl text-lg font-bold text-slate-700 bg-white/50 border border-white/80 hover:bg-white transition-all backdrop-blur-sm shadow-xl shadow-slate-200/50">
                            Watch Demo
                        </button>
                    </motion.div>
                </motion.div>
            </section>

            {/* Features Staggered Reveal */}
            <section className="py-24 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            delay={0.1}
                            icon={<BookOpen className="w-8 h-8 text-indigo-600" />}
                            title="AI Digital Twin"
                            description="Our AI maps your learning DNA, creating a real-time replica of your knowledge gaps."
                        />
                        <FeatureCard
                            delay={0.2}
                            icon={<HeartPulse className="w-8 h-8 text-rose-500" />}
                            title="Proactive Health"
                            description="Predictive wellness insights that bridge the gap between academic stress and physical health."
                        />
                        <FeatureCard
                            delay={0.3}
                            icon={<Smartphone className="w-8 h-8 text-emerald-500" />}
                            title="Cloud Sync"
                            description="Access your personalized tutors and health records from any device, anywhere."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -8, transition: { duration: 0.2 } }}
        className="p-10 rounded-3xl glass border border-white/40 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all flex flex-col gap-6"
    >
        <div className="bg-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner">
            {icon}
        </div>
        <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">{title}</h3>
            <p className="text-slate-600 leading-relaxed font-medium">{description}</p>
        </div>
    </motion.div>
);

export default LandingPage;

