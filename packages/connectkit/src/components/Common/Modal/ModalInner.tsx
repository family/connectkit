import { InnerContainer, PageContainer, PageContents } from './styles';
import { router } from '../../ConnectKit';
import { signal } from '@preact/signals-react';
import { useEffect, useRef } from 'react';
import styled from '../../../styles/styled';
import { AnimatePresence, motion } from 'framer-motion';
import defaultTheme from '../../../constants/defaultTheme';

type PageProps = {
  open: boolean;
  children?: React.ReactNode;
};

const Page: React.FC<PageProps> = ({ children, open }) => {
  return (
    <AnimatePresence>
      {open && (
        <PageContainer
          initial={{
            opacity: 0,
            zIndex: 1,
            position: 'relative',
            top: 0,
            // left: '50%',
            // x: '-50%',
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
            zIndex: 0,
            top: 0,
            position: 'absolute',
          }}
          transition={{
            default: { duration: 0.24 },
            left: { duration: 0 },
            x: { duration: 0 },
          }}
        >
          {children}
        </PageContainer>
      )}
    </AnimatePresence>
  );
};

type ModalContentProps = {
  pages: any;
  children: React.ReactNode;
};

const dimensions = signal({ width: 360, height: 413 });

const PagesContainer = styled(motion.div)`
  /* margin: 0 auto; */
  position: relative;
  width: fit-content;
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    max-width: 100%;
    min-width: 100%;
  }
`;

const ModalInner: React.FC<ModalContentProps> = ({ pages, children }) => {
  const pageId = router.value;
  const contentRef = useRef<any>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    setTimeout(() => {
      dimensions.value = {
        width: contentRef.current?.offsetWidth,
        height: contentRef.current?.offsetHeight,
      };
    }, 16.66);
  }, [pageId]);

  return (
    <InnerContainer
      initial={false}
      animate={{
        width: dimensions.value.width,
        height: dimensions.value.height,
      }}
      transition={{
        type: 'spring',
        mass: 0.3,
        damping: 20,
        stiffness: 220,
      }}
    >
      {children}
      <PagesContainer ref={contentRef}>
        {Object.keys(pages).map((key) => {
          const page = pages[key];
          return (
            // TODO: We may need to use the follow check avoid unnecessary computations, but this causes a bug where the content flashes
            // (key === pageId || key === prevPage) && (
            <Page key={key} open={key === pageId}>
              <PageContents key={`inner-${key}`}>{page}</PageContents>
            </Page>
          );
        })}
      </PagesContainer>
    </InnerContainer>
  );
};

export default ModalInner;
