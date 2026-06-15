import React, { Suspense, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { connect, useDispatch } from "react-redux";
import { supplier_contactAction } from "../redux/supplier_contact";
import ContactList from "../sections/contactList";
import AddContact from "../sections/addContact";
import ViewContact from "../sections/viewContact";
import MyDrawer from "../../../../../sharedUtils/sharedComponents/drawerHelper";

export const Common = (props: any) => {
  const [drawerIs, setDrawerIs] = useState(null);

  const [filter, setFilter] = useState({});

  const getUserTable = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const { setBreadCrumbs, slug } = props;
    setBreadCrumbs([
      {
        name: "Dashboard",
        isClickable: true,
        url: `/dashboard/${slug}`,
      },
      { name: "Supplier" },
    ]);
  }, []);

  const _closeSideBar = (payload) =>
    dispatch(supplier_contactAction.supplier_contactCloseSideBar(payload));

  function closeDrawer() {
    setDrawerIs(null);
  }

  function setAddDrawer() {
    _closeSideBar(false);
    const ds =
      props.showingFrom && props.showingFrom === "viewSupplier"
        ? "960px"
        : "1250px";
    setDrawerIs(
      <MyDrawer
        open={true}
        drawerSize={ds}
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
    const ds =
      props.showingFrom && props.showingFrom === "viewSupplier"
        ? "profile-third-drawer"
        : "profile-first-drawer";
    setDrawerIs(
      <MyDrawer
        open={true}
        drawerSize={ds}
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
        filter={filter}
        onCloseChild={closeDrawer}
        setAddDrawer={setAddDrawer}
        setEditDrawer={setEditDrawer}
      />
      {drawerIs}
    </React.Fragment>
  );
};
