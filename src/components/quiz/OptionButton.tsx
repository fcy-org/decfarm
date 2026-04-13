import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface OptionButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  multiSelect?: boolean;
}

const OptionButton = ({ label, selected, onClick, multiSelect }: OptionButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full p-4 rounded-lg border-2 text-left font-medium transition-colors flex items-center gap-3 ${
        selected
          ? "border-primary bg-primary/10 text-foreground"
          : "border-border bg-card text-foreground hover:border-primary/40"
      }`}
    >
      <div
        className={`w-6 h-6 flex-shrink-0 rounded-${multiSelect ? "md" : "full"} border-2 flex items-center justify-center transition-colors ${
          selected
            ? "border-primary bg-primary"
            : "border-muted-foreground/30"
        }`}
      >
        {selected && <Check className="w-4 h-4 text-primary-foreground" />}
      </div>
      <span className="text-sm md:text-base">{label}</span>
    </motion.button>
  );
};

export default OptionButton;
