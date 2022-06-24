import { motion } from 'framer-motion';
import styled from 'styled-components';
import { truncateEthAddress } from '../../../utils';

const MainCircle = styled(motion.div)`
  z-index: 2;
  position: relative;
  border-radius: 50%;
  transition: background-color 0.5s ease-in-out, box-shadow 0.5s ease-in-out;
`;

export const SlideOne = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <motion.div
      initial={{ opacity: 1, scale: 0.4, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, x: '50%' }}
      style={{
        width: 76,
        height: 76,
        background: '#6366F1',
        borderRadius: '50%',
        boxShadow: '0px 2px 10px rgba(99, 102, 241, 0.3);',
      }}
    ></motion.div>
    <MainCircle
      layoutId="circle"
      style={{
        position: 'relative',
        zIndex: 2,
        margin: '0 -8px',
        width: 112,
        height: 112,
        background: 'var(--body-background)',
        boxShadow: '0px 3px 15px rgba(0, 0, 0, 0.1)',
      }}
    />
    <motion.div
      initial={{ opacity: 1, scale: 0.4, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, x: '-50%' }}
      style={{
        width: 76,
        height: 76,
        background: '#3897FB',
        borderRadius: '50%',
        boxShadow: '0px 2px 10px rgba(56, 151, 251, 0.3)',
      }}
    ></motion.div>
  </div>
);

export const SlideTwo = () => (
  <>
    <div
      style={{
        position: 'relative',
      }}
    >
      <MainCircle
        layoutId="circle"
        style={{
          position: 'absolute',
          left: 14,
          top: 12,
          width: 32,
          height: 32,
          background: 'black',
          boxShadow: '0px 2px 5px rgba(37, 41, 46, 0.26)',
        }}
      />
      <motion.div
        initial={{ opacity: 1, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.4 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '19px 58px',
          background: 'var(--body-background)',
          boxShadow: '0px 2px 9px rgba(0, 0, 0, 0.07)',
          borderRadius: 16,
        }}
      >
        <span
          style={{
            fontFamily: 'SF Pro Rounded',
            fontWeight: 600,
            fontSize: 18,
            lineHeight: 1,
          }}
        >
          {truncateEthAddress('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')}
        </span>
      </motion.div>
    </div>
  </>
);

export const SlideThree = () => (
  <>
    <motion.div
      style={{
        position: 'relative',
      }}
    >
      <MainCircle
        layoutId="circle"
        style={{
          width: 128,
          height: 128,
          background:
            'linear-gradient(180deg, #6C55F6 0%, #5004F1 100%), #D9D9D9',
          boxShadow: '0px 2px 10px rgba(56, 151, 251, 0.3)',
        }}
      />
      <motion.div
        initial={{ opacity: 1, scale: 0.4, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        style={{
          zIndex: 3,
          borderRadius: '50%',
          position: 'absolute',
          bottom: -4,
          right: -4,
          width: 54,
          height: 54,
          background: 'var(--body-background)',
          boxShadow: '0px 2px 9px rgba(0, 0, 0, 0.15)',
        }}
      />
    </motion.div>
  </>
);
