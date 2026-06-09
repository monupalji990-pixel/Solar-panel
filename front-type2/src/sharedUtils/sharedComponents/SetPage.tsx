import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectLogged,
  selectLoggedUser,
} from "../../projects/authentication/redux/auth";
import { CircularProgress } from "@material-ui/core";

export default function setPage(route) {
  const logged = useSelector(selectLogged);
  const userData = useSelector(selectLoggedUser);

  if (logged == "pass") {
    route.history.push(userData.role.configurations.afterLoginPage);
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress />
    </div>
  );
}
