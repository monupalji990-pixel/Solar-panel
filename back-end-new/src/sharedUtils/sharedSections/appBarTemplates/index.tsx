import {MainTemplate} from "./mainTemplate/loadable";
import React from "react";
import { appBarTemplateSelector } from "../../sharedRedux/configuration";
import { useSelector, useDispatch } from "react-redux";
export default function AppBar(props) {
  const appBarTemplate = useSelector(appBarTemplateSelector);
  if (!(location.pathname.indexOf("auth") >= 0) && !(location.pathname.indexOf("/lead-data") >= 0)) {
    if (appBarTemplate == "mainTemplate") {
      return <MainTemplate {...props} />;
    } else {
      return <></>;
    }
  } else {
    return <></>;
  }
}
