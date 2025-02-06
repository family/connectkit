import React from 'react';
import { motion } from 'framer-motion';

type DynamicContainerProps = { id: string; children?: React.ReactNode };

const DynamicContainer: React.FC<DynamicContainerProps> = ({
  id,
  children,
}) => {
  return (
    <div style={{ position: 'relative' }}>
      <motion.div
        key={id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, position: 'absolute', top: 0, left: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </div>
  );
};
export default DynamicContainer;
