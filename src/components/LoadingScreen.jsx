
import { motion } from "framer-motion";
import { Compass } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <motion.div
        className="loading-mark"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      >
        <Compass size={34} strokeWidth={1.3} />
      </motion.div>
      <p>Finding your somewhere<span className="loading-dots">...</span></p>
    </div>
  );
}
