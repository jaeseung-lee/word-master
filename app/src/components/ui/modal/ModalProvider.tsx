import { AnimatePresence } from "framer-motion";
import React from "react";

export default function ModalProvider({ children }: React.PropsWithChildren) {
  return <AnimatePresence>{children}</AnimatePresence>;
}
