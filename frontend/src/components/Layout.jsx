import Sidebar from "./Sidebar";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Layout = ({ children }) => {
    const location = useLocation();

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <Sidebar />
            <main className="flex-1 ml-72 min-h-screen relative overflow-x-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 12, scale: 0.99 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -12, scale: 0.99 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="p-10"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default Layout;

