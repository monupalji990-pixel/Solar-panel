import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { globalConfigActions } from "sharedUtils/sharedRedux/configuration";
import ViewImportExport from "../sections/viewImportExport";

export const Common = (props: any) => {
  const [drawerIs, setDrawerIs] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    props.setBreadCrumbs([
      {
        name: "Dashboard",
        isClickable: true,
        url: `/dashboard/${props.slug}`,
      },
      { name: "Import/Export" },
    ]);
  }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
        <meta name="description" content="A Edan Power CRM Portal" />
      </Helmet>
      <ViewImportExport
        {...props}
        _enableFeedback={(payload) => {
          dispatch(globalConfigActions.enableFeedback(payload));
        }}
      />
      {drawerIs}
    </>
  );
};
