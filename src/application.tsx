import * as React from 'react';
import { Scope } from 'effector/fork';
import { Provider } from 'effector-react/ssr';
import styled, { createGlobalStyle } from 'styled-components';
import { Block, Button, Title, Input } from 'woly';
import Logo from './logo.svg';

import { Pages } from './pages';
import { CenterCardTemplate } from '@auth/ui';

interface Props {
  root: Scope;
}

const Globals = createGlobalStyle`
  :root {
    /* common */
    --primary-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    --text-color: var(--black);
    --border-color: rgba(0, 0, 0, 0.1);
    --body-bg: var(--white);

    /* colors */
    --conch: #d5d5dc;
    --black: #000;
    --white: #fff;
    --coral: #f0254c;

    /* block */
    --block-padding: 30px 42px;
    --block-bg: var(--white);
    --block-border: 1px solid var(--border-color);
    --block-border-radius: 3px;
    --block-shadow: 0 3px 12px -3px var(--border-color);

    /* titles */
    --title-color: var(--black)
    --title-height: 1.2rem;

    --h1-font-size: 4.2rem;
    --h1-line-height: var(--title-height);
    --h2-font-size: 3rem;
    --h2-line-height: var(--title-height);
    --h3-font-size: 2.4rem;
    --h3-line-height: var(--title-height);

    /* types */
    --primary: var(--black);
    --primary-text: var(--white);
    --primary-border: var(--black);
    --primary-ghost-text: var(--black);
    --primary-ghost-border: var(--black);

    --warning: var(--coral);
    --warning-text: var(--white);
    --warning-border: var(--coral);
    --warning-ghost-text: var(--coral);
    --warning-ghost-border: var(--coral);

    --ghost: transparent;
    --ghost-border: var(--border-color);

    /* input styles */
    --input-font-size: 3.6rem;
    --input-line-height: 4.8rem;

    /* button styles */
    --button-border-radius: 3px;

    /* button normal */
    --button-font-size-normal: 1.8rem;
    --button-height-normal: 4.2rem;

    /* button small */
    --button-font-size-small: 1.2rem;
    --button-height-small: 2.7rem;

    font-size: 10px;
  }

  body,
  html {
    -webkit-font-smoothing: antialiased;
    color: var(--text-color);
    font-family: var(--primary-font);
    font-weight: 400;
    height: 100vh;
    line-height: 1.4;
    margin: 0;
    width: 100vw;
    box-sizing: border-box;
  }

  input {
    border: 0;
    background-color: transparent;
    outline: none;

    &[type="text"] {
      font-weight: 300;
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0;
  }

  #root {
    height: 100vh;
  }
`;

const Logotype = styled(Logo)`
  margin-bottom: 3rem;
  display: flex;
  flex-shrink: 0;
`;

const Group = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 3rem;

  & *:not(:first-child) {
    margin-left: 2rem;
  }

  &[data-direction='column'] {
    flex-direction: column;

    & *:not(:first-child) {
      margin-left: initial;
      margin-top: 1rem;
    }
  }
`;

const Footer = styled.footer`
  margin-top: 10rem;
  font-size: 1.2rem;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: content-box;
  height: 100%;
`;

export const Application: React.FC<Props> = ({ root }) => (
  <Provider value={root}>
    <>
      <Globals />
      <CenterCardTemplate>
        <Container>
          <Logotype />

          <form>
            <Title level={2}>Sign up</Title>

            <Input placeholder="email" value="" onChange={() => {}} />
            <Input placeholder="display name" value="" onChange={() => {}} />
            <Input placeholder="password" value="" onChange={() => {}} />
            <Input placeholder="repeat password" value="" onChange={() => {}} />

            <Group>
              <Button text="Sign up" variant="primary" />
              <Button text="Sign in" variant="text" />
            </Group>
          </form>
          <Footer>
            By joining nameproject you accept our Terms of Service and Privacy
            Policy
          </Footer>
        </Container>
      </CenterCardTemplate>
    </>
  </Provider>
);
