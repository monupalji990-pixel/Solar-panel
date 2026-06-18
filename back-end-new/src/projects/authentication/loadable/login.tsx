import * as React from "react";
import { lazyLoad } from "utils/loadable";
import { LoadingIndicator } from "sharedUtils/sharedComponents/LoadingIndicator";
import styled from "styled-components/macro";

const LoadingWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: "#f6f7fb";
`;

export const Login = lazyLoad(
  () => import("../pages/login"),
  (module) => module.Login,
  {
    fallback: (
      <LoadingWrapper>
        <LoadingIndicator />
      </LoadingWrapper>
    ),
  }
);
