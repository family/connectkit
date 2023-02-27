import type { GetServerSideProps, NextPage } from 'next';
import { siweServer } from '../../utils/siweServer';

type Props =
  | { isCollector: false }
  | {
      isCollector: true;
      address: string;
    };

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  res,
}) => {
  const { address } = await siweServer.getSession(req, res);

  if (!address) {
    return {
      props: { isCollector: false },
    };
  }

  // TODO: check for token

  return {
    props: { isCollector: true, address },
  };
};

const TokenGatedPage: NextPage<Props> = (props) => {
  if (!props.isCollector) {
    return <>You need to be signed in and have our token to see this page.</>;
  }

  return <>You made it! Welcome, collector.</>;
};

export default TokenGatedPage;
