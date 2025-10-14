import { SpinnerContainer } from './styles';

const transition = {
  duration: 0.4,
  ease: [0.175, 0.885, 0.32, 0.98],
};

export const Spinner = () => (
  <SpinnerContainer
    initial={{ opacity: 0, rotate: 180 }}
    animate={{
      opacity: 1,
      rotate: 0,
    }}
    exit={{
      position: 'absolute',
      opacity: 0,
      rotate: -180,
      transition: {
        ...transition,
      },
    }}
    transition={{
      ...transition,
      delay: 0.2,
    }}
  >
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="9"
        cy="9"
        r="7"
        stroke="currentColor"
        strokeOpacity="0.1"
        strokeWidth="2.5"
      />
      <path
        d="M16 9C16 5.13401 12.866 2 9 2"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  </SpinnerContainer>
);
