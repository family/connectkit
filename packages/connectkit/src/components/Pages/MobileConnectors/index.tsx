import React from 'react';
import { Container } from './styles';

import { PageContent, ModalContent } from '../../Common/Modal/styles';

import { useWallets } from '../../../wallets/useDefaultWallets';
import { ConnectorList } from '../Connectors';
import Input from '../../Common/Input';

const SearchIcon = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.2929 13.7071C12.6834 14.0976 13.3166 14.0976 13.7071 13.7071C14.0976 13.3166 14.0976 12.6834 13.7071 12.2929L12.2929 13.7071ZM13.7071 12.2929L12.4028 10.9886L10.9886 12.4028L12.2929 13.7071L13.7071 12.2929ZM12.4028 10.9886L10.2071 8.79289L8.79289 10.2071L10.9886 12.4028L12.4028 10.9886Z"
      fill="currentColor"
    />
  </svg>
);

const MobileConnectors: React.FC = () => {
  const wallets = useWallets();
  const [search, setSearch] = React.useState('');

  const filtered = wallets.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageContent style={{ width: 312 }}>
      <Container>
        <ModalContent>
          <Input
            autoFocus
            icon={SearchIcon}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="search"
            placeholder={`Search ${wallets.length} Wallets`}
          />
          <ConnectorList
            wallets={search ? filtered : wallets}
            start={search ? 0 : 2}
            end={wallets.length}
          />
        </ModalContent>
      </Container>
    </PageContent>
  );
};

export default MobileConnectors;
