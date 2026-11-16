import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const corners = [
  { id: "tl", position: "-top-[3px] -left-[3px]", border: "border-t border-l" },
  { id: "tr", position: "-top-[3px] -right-[3px]", border: "border-t border-r" },
  { id: "bl", position: "-bottom-[3px] -left-[3px]", border: "border-b border-l" },
  { id: "br", position: "-bottom-[3px] -right-[3px]", border: "border-b border-r" },
];

const CornerBrackets = ({ children, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocusWithin, setIsFocusWithin] = useState(false);
  const showBrackets = isHovered || isFocusWithin;

  return (
    <div
      className={["relative", className].filter(Boolean).join(" ")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsFocusWithin(true)}
      onBlurCapture={() => setIsFocusWithin(false)}
    >
      <AnimatePresence>
        {showBrackets && (
          <>
            <motion.span
              className="pointer-events-none absolute -inset-[3px] border border-dashed border-correct/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            />
            {corners.map(({ id, position, border }) => (
              <motion.span
                key={id}
                className={[
                  "pointer-events-none absolute h-[5px] w-[5px] border-correct",
                  position,
                  border,
                ].join(" ")}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
      {children}
    </div>
  );
};

export default CornerBrackets;
