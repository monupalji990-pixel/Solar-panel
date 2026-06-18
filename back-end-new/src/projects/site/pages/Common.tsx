import React, { Suspense, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";
import ListUserSection from "../sections/siteList";
import AddSite from "../sections/addSite";
import ViewSite from "../sections/viewSite";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import {
  siteReducer,
  siteSaga,
  sliceKeySite,
} from "../Redux/site";

export const Common = (props: any) => {
  useInjectReducer({ key: sliceKeySite, reducer: siteReducer });
  useInjectSaga({ key: sliceKeySite, saga: siteSaga });

  const [drawerIs, setDrawerIs] = useState(null);
  const [setDrawer, setSetDrawer] = useState(null);
  const getUserTable = useRef(null);
  const dispatch = useDispatch();

  function setEditDrawer(data) {
    setDrawerIs(
      <Suspense fallback={<>Loading...</>}>
        <MyDrawer
          drawerSize="950px"
          iconName="Site"
          open
          onClose={closeDrawer}
        >
          <ViewSite
            {...props}
            site={data}
            getUserTable={getUserTable}
            onClose={closeDrawer}
          />
        </MyDrawer>
      </Suspense>
    );
  }

  function setAddDrawer() {
    setDrawerIs(
      <Suspense fallback={<>Loading...</>}>
        <MyDrawer
          open
          drawerSize="1100px"
          iconName="Site"
          onClose={closeDrawer}
        >
          <AddSite
            {...props}
            getUserTable={getUserTable}
            onClose={closeDrawer}
          />
        </MyDrawer>
      </Suspense>
    );
  }

  function closeDrawer() {
    setDrawerIs(null);
  }

  return (
    <Suspense fallback={<>Loading...</>}>
      <ListUserSection
        {...props}
        getUserTable={getUserTable}
        tableRef={getUserTable}
        setAddDrawer={setAddDrawer}
        setEditDrawer={setEditDrawer}
        onClose={closeDrawer}
      />
      {drawerIs}
    </Suspense>
  );
};
