import { InnerContainer, PageContainer, PageContents } from './styles';
import { router } from '../../ConnectKit';
import { signal } from '@preact/signals-react';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

type PageProps = {
  open: boolean;
  children?: React.ReactNode;
};

const Page: React.FC<PageProps> = ({ children, open }) => {
  return (
    <PageContainer
      initial={{ opacity: 0 }}
      animate={{
        opacity: open ? 1 : 0,
      }}
      transition={{
        duration: 0.3,
      }}
    >
      {open && children}
    </PageContainer>
  );
};

type ModalContentProps = {
  pages: any;
  children: React.ReactNode;
};

const dimensions = signal({ width: 360, height: 369 });

const PagesContainer = styled(motion.div)`
  width: fit-content;
  justify-content: center;
`;

const ModalInner: React.FC<ModalContentProps> = ({ pages, children }) => {
  const pageId = router.value;
  const contentRef = useRef<any>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    dimensions.value = {
      width: contentRef.current?.offsetWidth,
      height: contentRef.current?.offsetHeight,
    };
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
