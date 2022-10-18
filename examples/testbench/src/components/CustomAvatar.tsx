import { Types } from 'connectkit';

import { motion } from 'framer-motion';
import Image from 'next/image';

const CustomAvatar = ({
  address,
  ensImage,
  ensName,
  size,
  radius,
}: Types.CustomAvatarProps) => {
  const color = 'red';
  return (
    <motion.div
      style={{
        overflow: 'hidden',
        borderRadius: radius,
        height: size,
        width: size,
        background: color,
      }}
      animate={{
        rotate: [0, 360],
      }}
      transition={{
        duration: 0.5,
        ease: 'linear',
        repeat: Infinity,
      }}
    >
      {ensImage && (
        <Image
          src={ensImage}
          alt={ensName ?? address}
          width="100%"
          height="100%"
        />
      )}
    </motion.div>
  );
};

export default CustomAvatar;
