import React from "react";
import EditProfile from "../../editProfile";
import Sidebar from "./sidebar";
import UserAppBar from "./AppBar";
import OpenDueDateTask from "sharedUtils/sharedComponents/OpenDueDateTask";

export function mainTemplate(props) {
  return (
    <>
      <OpenDueDateTask {...props} needToUpdate={Math.random()} />
      <UserAppBar />
      <EditProfile />
      <Sidebar {...props} />
    </>
  );
}
