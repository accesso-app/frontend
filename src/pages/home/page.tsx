import { reflect } from '@effector/reflect/ssr';
import { createEvent, createStore } from 'effector';
import { useStore } from 'effector-react/ssr';
import React from 'react';
import styled from 'styled-components';
import { Button } from 'woly';

import { createStart, withStart } from 'lib/page-routing';

export interface ProfileCardProps {
  fullName: string;
  email: string;
}

export const pageStarted = createStart();
export const $fullName = createStore('');
export const $email = createStore('');
export const $showError = createStore(false);

export const logoutClicked = createEvent<React.MouseEvent<HTMLButtonElement>>();

export const HomePage = withStart(pageStarted, () => {
  const fullName = useStore($fullName);
  const email = useStore($email);
  return (
    <PageContainer>
      <ProfileGroup>
        <Failure />
        <ProfileTitle>Profile</ProfileTitle>
        <ProfileCard fullName={fullName} email={email} />
      </ProfileGroup>
    </PageContainer>
  );
});

export const ProfileCard = ({ fullName, email }: ProfileCardProps) => {
  return (
    <ProfileCardContainer>
      <CardRow>
        <ProfileIconStub />
        <UserInfoGroup>
          <UserFullNameGroup>
            <UserFullName>{fullName}</UserFullName>
            <UserEmail>{email}</UserEmail>
          </UserFullNameGroup>
          <Button
            type="button"
            text="Logout"
            size="small"
            variant="primary"
            onClick={logoutClicked}
          />
        </UserInfoGroup>
      </CardRow>
      {/*<CardRow>*/}
      {/*  <CardRowFiller />*/}
      {/*  <div>*/}
      {/*    <SocialButton*/}
      {/*      type="button"*/}
      {/*      size="small"*/}
      {/*      variant="default"*/}
      {/*      text="Connect Google"*/}
      {/*    />*/}
      {/*    <SocialButton*/}
      {/*      type="button"*/}
      {/*      size="small"*/}
      {/*      variant="default"*/}
      {/*      text="Connect Facebook"*/}
      {/*    />*/}
      {/*  </div>*/}
      {/*</CardRow>*/}
    </ProfileCardContainer>
  );
};

const Failure = reflect({
  view: ({ showError }: { showError: boolean }) =>
    showError ? <ErrorText>Something went wrong! Please, try again later</ErrorText> : null,
  bind: {
    showError: $showError,
  },
});

const CardRow = styled.div`
  display: grid;
  grid-template-columns: 48px 1fr 48px;
  width: 100%;
  margin-bottom: 12px;
`;

const CardRowFiller = styled.div``;

const ErrorText = styled.div`
  font-size: 1.8rem;
`;

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: var(--block-padding);
`;

const ProfileCardContainer = styled.div`
  width: 100%;
  padding: var(--block-padding);
  border: thin solid var(--block-border);
  box-shadow: var(--block-shadow);
  box-sizing: border-box;
`;

const ProfileGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 72px;
  width: 50vw;
  @media (max-width: 1023px) {
    width: 100vw;
  }
  @media (max-width: 1199px) {
    width: 85vw;
  }
  @media (max-width: 1439px) {
    width: 70vw;
  }
`;

const ProfileIconStub = styled.div`
  border-radius: 50%;
  border: thin solid var(--conch);
  width: 36px;
  height: 36px;
`;

const ProfileTitle = styled.h2`
  font-size: var(--h2-font-size);
  align-self: flex-start;
  margin-bottom: 12px;
`;

const SocialButton = styled(Button)`
  margin-right: 12px;
`;

const UserInfoGroup = styled.div`
  display: flex;
  flex-wrap: nowrap;
  margin-right: 12px;
`;

const UserFullName = styled.span`
  height: var(--title-height);
  font-size: 1.5rem;
`;

const UserEmail = styled.span`
  color: var(--conch);
  font-size: 1.2rem;
`;

const UserFullNameGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 12px;
`;
