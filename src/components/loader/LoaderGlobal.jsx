import { AnimatePresence, motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";

const LoaderGlobal = () => {
  const { cargandoGlobal } = useAppContext();

  return (
    <AnimatePresence>
      {cargandoGlobal && (
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
