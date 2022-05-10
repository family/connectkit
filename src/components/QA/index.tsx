import React from 'react';
import Avatar from '../Avatar';

import styled from 'styled-components';
import { ResetContainer } from './../../styles';
import ConnectWithQRCode from './../ConnectModal/ConnectWithQRCode';
import ConnectWithInjector, {
  states,
} from './../ConnectModal/ConnectWithInjector';

import {
  Container as ModalContainer,
  InnerContainer,
  PageContainer,
} from './../Modal/styles';

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

const QA: React.FC = () => {
  return (
    <ResetContainer>
      <p>
        This page is used to QA components that are difficult to QA in-app,
        though it may have inconsistencies with the actual app.
      </p>
      <h1>Avatar</h1>
      <Container>
        <Avatar name="lochie.eth" />
        <Avatar name="pugson.eth" />
        <Avatar name="bulktransaction.eth" />
        <Avatar name="shahruz.eth" />
        <Avatar name="vitalik.eth" />
        <Avatar name="benjitaylor.eth" />
        <Avatar name="alexvanderzon.eth" />
        <Avatar name="jsngr.eth" />
        <Avatar name="jsmth.eth" />
        <Avatar name="christopherlang.eth" />
        <Avatar name="bijani.eth" />
      </Container>
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
      </Container> */}
    </ResetContainer>
  );
};

export default QA;
