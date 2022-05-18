import React from 'react';
import Avatar from '../Common/Avatar';

import styled from 'styled-components';
import { ResetContainer } from './../../styles';
import ConnectWithQRCode from './../ConnectModal/ConnectWithQRCode';

import {
  Container as ModalContainer,
  InnerContainer,
  PageContainer,
} from '../Common/Modal/styles';
import Button from '../Common/Button';
import BrowserIcon from '../Common/BrowserIcon';
import logos from '../../assets/logos';

import { Theme } from '../ConnectKit';
import { DisconnectIcon, ExternalLinkIcon } from '../../assets/icons';

const Container = styled.div`
  margin: 32px 0;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 12px;
`;

const FakeModal: React.FC<{ children?: any }> = ({ children }) => {
  return (
    <ModalContainer>
      <InnerContainer>
        <PageContainer>{children}</PageContainer>
      </InnerContainer>
    </ModalContainer>
  );
};

const QA: React.FC<{
  setTheme: (e: any) => void;
  setLang: (e: any) => void;
  theme: Theme;
}> = ({ setLang, setTheme, theme }) => {
  return (
    <>
      <fieldset>
        options
        <hr />
        <label>theme</label>{' '}
        <select onChange={(e: any) => setTheme(e.target.value)}>
          <option value={'auto'}>system settings</option>
          <option value={'light'}>light mode</option>
          <option value={'dark'}>dark mode</option>
        </select>
      </fieldset>
      <p>
        This page is used to QA components that are difficult to QA in-app,
        though it may have inconsistencies with the actual app.
      </p>
      <ResetContainer theme={theme}>
        <h1>Avatar</h1>
        <h3>ENS avatars</h3>
        <Container>
          <Avatar name="lochie.eth" />
          <Avatar name="pugson.eth" />
          <Avatar name="bulktransaction.eth" />
          <Avatar name="shahruz.eth" />
          <Avatar name="vitalik.eth" />
        </Container>
        <h3>No avatars</h3>
        <Container>
          <Avatar name="benjitaylor.eth" />
          <Avatar name="alexvanderzon.eth" />
          <Avatar name="jsngr.eth" />
          <Avatar name="jsmth.eth" />
          <Avatar name="christopherlang.eth" />
          <Avatar name="bijani.eth" />
        </Container>
        <h1>Buttons</h1>
        <div style={{ width: 295 }}>
          <Button onClick={() => {}} arrow>
            Choose Your First Wallet
          </Button>
          <Button onClick={() => {}} icon={<BrowserIcon browser="chrome" />}>
            Install on Chrome
          </Button>
          <Button onClick={() => {}} icon={<BrowserIcon browser="chrome" />}>
            Install the Extension
          </Button>
          <Button onClick={() => {}} icon={<BrowserIcon browser="firefox" />}>
            Install the Extension
          </Button>
          <Button onClick={() => {}} icon={logos.Coinbase} roundedIcon>
            Get Coinbase Wallet
          </Button>
          <Button onClick={() => {}} icon={<DisconnectIcon />}>
            Disconnect
          </Button>
          <Button onClick={() => {}} icon={<ExternalLinkIcon />}>
            Open Default Modal
          </Button>
        </div>
        <h1>QR Code</h1>
        <Container>
          <FakeModal>
            <ConnectWithQRCode
              connectorId="walletConnect"
              switchConnectMethod={() => {}}
            />
          </FakeModal>
          <FakeModal>
            <ConnectWithQRCode
              connectorId="coinbaseWallet"
              switchConnectMethod={() => {}}
            />
          </FakeModal>
        </Container>
        {/**
      <h1>Injectors</h1>
      <Container>
        {Object.keys(states).map((key) => {
          // @ts-ignore
          const state = states[key];
          return (
            <FakeModal>
              <ConnectWithInjector
                connectorId="coinbaseWallet"
                switchConnectMethod={() => {}}
                forceState={state}
              />
            </FakeModal>
          );
        })}
      </Container>
      <Container>
        {Object.keys(states).map((key) => {
          // @ts-ignore
          const state = states[key];
          return (
            <FakeModal>
              <ConnectWithInjector
                connectorId="injected"
                switchConnectMethod={() => {}}
                forceState={state}
              />
            </FakeModal>
          );
        })}
      </Container>
      */}
      </ResetContainer>
    </>
  );
};

export default QA;
