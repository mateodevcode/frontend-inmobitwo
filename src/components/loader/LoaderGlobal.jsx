import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";

const LoaderGlobal = ({ delay = 250 }) => {
  const { cargandoGlobal } = useAppContext();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!cargandoGlobal) return;

    const timer = setTimeout(() => setVisible(true), delay);

    return () => {
      clearTimeout(timer);
      setVisible(false);
    };
  }, [cargandoGlobal, delay]);

  return (
    <AnimatePresence>
      {cargandoGlobal && visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-999 bg-black/20 backdrop-blur-[1px] flex items-center justify-center"
        >
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoaderGlobal;
