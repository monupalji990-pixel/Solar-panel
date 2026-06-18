import { createGlobalStyle } from "styled-components";
import { StyleConstants } from "./StyleConstants";
/* istanbul ignore next */
export const GlobalStyle = createGlobalStyle`
 html,
  body {
    height: 100%;
    width: 100%;
    background:'red'
  }
  #root {
    min-height: 100%;
    min-width: 100%;
  }

  p,
  label {
    line-height: 1.5em;
  }

  input, select {
    font-size: inherit;
  }

`;
