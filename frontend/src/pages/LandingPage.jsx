import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, HeartPulse, ShieldCheck } from "lucide-react";

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 overflow-hidden">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                ShikshaCare
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link to="/login" className="text-gray-600 hover:text-primary font-medium transition-colors">Login</Link>
                            <Link to="/register" className="bg-black hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium transition-all shadow-lg shadow-blue-500/30">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6"
                    >
                        Empowering <span className="text-primary">Education</span> <br />
                        <span className="text-secondary">& Healthcare</span> with AI
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 mb-10"
                    >
                        A unified platform bridging the gap between quality education and accessible healthcare services using advanced AI technology.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex justify-center gap-4"
                    >
                        <Link to="/register" className="group bg-gray-900 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-800 transition-all flex items-center gap-2">
                            Start Journey <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>

                {/* Background Blobs */}
                <div className="absolute top-0 left-0 -z-10 w-full h-full overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<BookOpen className="w-8 h-8 text-blue-500" />}
                            title="AI Education"
                            description="Personalized learning paths and AI-driven tutoring for every student."
                        />
                        <FeatureCard
                            icon={<HeartPulse className="w-8 h-8 text-rose-500" />}
                            title="Remote Health"
                            description="Instant access to medical consultations and health monitoring tools."
                        />
                        <FeatureCard
                            icon={<ShieldCheck className="w-8 h-8 text-emerald-500" />}
                            title="Secure & Private"
                            description="Enterprise-grade security ensuring your data remains private and safe."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-all"
    >
        <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow-sm mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
);

export default LandingPage;
