import { createGlobalStyle } from 'styled-components';

export const Globals = createGlobalStyle`
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
