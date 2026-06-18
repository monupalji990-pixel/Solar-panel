import React, { useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";
import ContactList from "../sections/contactList";
import AddContact from "../sections/addContact";
import ViewContact from "../sections/viewContact";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import {
  contactAction,
  contactReducer,
  contactSaga,
  sliceKeyContact,
} from "../redux/contact";

export const Common = (props: any) => {
  useInjectReducer({ key: sliceKeyContact, reducer: contactReducer });
  useInjectSaga({ key: sliceKeyContact, saga: contactSaga });

  const [drawerIs, setDrawerIs] = useState(null);
  const getUserTable = useRef(null);
  const dispatch = useDispatch();

  const _closeSideBar = (payload) =>
    dispatch(contactAction.CloseSideBar(payload));

  function closeDrawer() {
    setDrawerIs(null);
  }

  function setAddDrawer() {
    _closeSideBar(false);

    setDrawerIs(
      <MyDrawer
        open={true}
        drawerSize="1100px"
        iconName="Contact"
        onClose={closeDrawer}
      >
        <AddContact
          {...props}
          getUserTable={getUserTable}
          onCloseChild={closeDrawer}
        />
      </MyDrawer>
    );
  }
  function setEditDrawer(data) {
    setDrawerIs(
      <MyDrawer
        open={true}
        drawerSize="1100px"
        iconName="Contact"
        onClose={closeDrawer}
      >
        <ViewContact
          {...props}
          getUserTable={getUserTable}
          contact={data}
          onCloseChild={closeDrawer}
        />
      </MyDrawer>
    );
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>View Contact</title>
        <meta name="description" content="A Edan Power CRM Portal" />
      </Helmet>
      <ContactList
        {...props}
        getUserTable={getUserTable}
        tableRef={getUserTable}
        onCloseChild={closeDrawer}
        setAddDrawer={setAddDrawer}
        setEditDrawer={setEditDrawer}
      />
      {drawerIs}
    </React.Fragment>
  );
};
