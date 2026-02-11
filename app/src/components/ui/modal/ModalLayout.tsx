"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";

type ModalLayoutType = "bottom-to-top";

interface ModalLayoutProps extends React.ComponentPropsWithoutRef<"div"> {
  modalType: ModalLayoutType;
  closeModal?: () => void;
}

const ModalLayout: React.FunctionComponent<ModalLayoutProps> = ({
  modalType,
  closeModal,
  ...props
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  switch (modalType) {
    case "bottom-to-top": {
      return (
        <React.Fragment>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              type: "tween",
              duration: 0.1,
            }}
            exit={{ opacity: 0 }}
            className="z-backdrop fixed inset-0 backdrop-blur-md"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();

              if (closeModal) {
                closeModal();
              }
            }}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "tween",
              duration: 0.1,
            }}
            className="rounded-t-md z-modal border-t border-gray-04 bg-light-black fixed bottom-0 left-0 right-0 h-[calc(100%-7rem)] overflow-y-auto p-2"
          >
            {props.children}
          </motion.div>
        </React.Fragment>
      );
    }
  }
};

export { ModalLayout };
export type { ModalLayoutProps, ModalLayoutType };
