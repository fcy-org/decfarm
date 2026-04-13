import { motion } from "framer-motion";

interface QuizButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "cta";
}

const QuizButton = ({ children, onClick, disabled, variant = "primary" }: QuizButtonProps) => {
  const base = "w-full py-4 px-6 rounded-xl font-bold text-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed";
  const styles = {
    primary: `${base} bg-secondary text-secondary-foreground hover:brightness-105 shadow-lg shadow-secondary/30`,
    cta: `${base} bg-secondary text-secondary-foreground hover:brightness-105 shadow-xl shadow-secondary/40 text-xl`,
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      className={styles[variant]}
    >
      {children}
    </motion.button>
  );
};

export default QuizButton;
