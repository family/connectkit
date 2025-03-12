import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { AsideMainContent } from "./AsideMainContent";
import { ProvidersEdit } from "./ProvidersEdit";
import { AsideContentType } from "./types";

export const AsideContent = () => {
  const [content, setContent] = useState<AsideContentType>("main");

  return (
    <div className="relative flex flex-col w-full h-full">
      <AnimatePresence>
        {content === "main" && (
          <motion.div
            className="h-full flex flex-col w-full"
            key="main"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, position: "absolute", x: 10, }}
          >
            <AsideMainContent
              setContent={setContent}
            />
          </motion.div>
        )}
        {content === "providers" && (
          <motion.div
            className="h-full flex flex-col  w-full"
            key="providers"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, position: "absolute", x: -10 }}
          >
            <ProvidersEdit
              setContent={setContent}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}