import { configureServerSideSIWE } from 'connectkit-next-siwe';

const serverSiwe = configureServerSideSIWE({});

export default serverSiwe.apiRouteHandler;
