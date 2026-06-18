/* eslint-disable no-unneeded-ternary */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable eqeqeq */
/* eslint-disable react/destructuring-assignment */

import React, { useEffect, Suspense } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Gas from "./create/gas";
import Electric from "./create/electric";
import Water from "./create/water";
import ChipPin from "./create/chipandpin";
import Telecoms from "./create/telecoms";
import SolarPaid from "./create/solarpaid";
import Broadband from "./create/broadband";
import Energy from "./create/energy";
import Waste from "./create/waste";
import Insurance from "./create/insurance";
import BusinessRates from "./create/businessRates";
import TeleBroad from "./create/teleBroad"
import Eco from "./create/eco"

export function ServiceContainer(props) {
  const {
    RadioToggle,
    selectedTab,
    SitePostcode,
    CurrentErrors,
    checkParentValidation,
    email,
    contact,
    tabHandleChange,
    setFieldValue,
    submitForm,
    validateForm,
  } = props;
  useEffect(() => {
    validateForm();
  }, []);
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Paper>
            <Tabs
              value={selectedTab}
              onChange={tabHandleChange}
              variant="scrollable"
              scrollButtons="auto"
              textColor="primary"
              indicatorColor="primary"
            >
              {["lead", "company", "consumer"].includes(RadioToggle) && (
                <Tab label="Gas" value="gas" />
              )}
              {["lead", "company", "consumer"].includes(RadioToggle) && (
                <Tab label="Electric" value="electric" />
              )}
              {/* {["lead", "company", "consumer"].includes(RadioToggle) && (
                <Tab label="Debt" value="debt" />
              )} */}
              {/* {["lead", "company"].includes(RadioToggle) && (
                <Tab label="Telecom & BroadBand" value="telebroad" />
              )} */}
              {["lead", "company"].includes(RadioToggle) && (
                <Tab label="Water" value="water" />
              )}
              {["lead", "company"].includes(RadioToggle) && (
                <Tab label="Chip And Pin" value="chip&Pin" />
              )}
              {["lead", "company"].includes(RadioToggle) && (
                <Tab label="Telecom" value="telecoms" />
              )}
              {["lead", "company"].includes(RadioToggle) && (
                <Tab label="Broadband" value="broadband" />
              )}
              {["lead", "company"].includes(RadioToggle) && (
                <Tab label="Waste" value="waste" />
              )}
              {["lead", "company"].includes(RadioToggle) && (
                <Tab label="Insurance" value="insurance" />
              )}
              {["lead", "company"].includes(RadioToggle) && (
                <Tab label="Business Rates" value="businessRates" />
              )}
              {["consumer"].includes(RadioToggle) && (
                <Tab label="Energy" value="energy" />
              )}
              {/* {["consumer"].includes(RadioToggle) && (
                <Tab label="Funeral" value="funeral" />
              )}
              {["consumer"].includes(RadioToggle) && (
                <Tab label="Mortgage" value="mortgage" />
              )} */}
              {["lead", "company", "consumer"].includes(RadioToggle) && (
                <Tab label="Eco" value="eco" />
              )}
              {["lead", "company", "consumer"].includes(RadioToggle) && (
                <Tab label="Paid Solar" value="paidSolar" />
              )}
            </Tabs>
          </Paper>
        </Grid>
      </Grid>

      {RadioToggle && selectedTab === "gas" && (
        <Suspense fallback={<>Loading...</>}>
          {" "}
          <Gas
            {...props}
            GetServiceData={(obj, sid) => {
              setFieldValue("otherData", {
                obj: obj,
                sid: sid,
                service: "gas",
                serviceType: "Gas",
              });
              submitForm();
            }}
            SitePostcode={SitePostcode}
            PostCodeRandomString={Math.random().toString(36).substring(7)}
            checkParentValidation={() => checkParentValidation()}
            ParentStuff={CurrentErrors}
          />
        </Suspense>
      )}
      {RadioToggle && selectedTab === "electric" && (
        <Suspense fallback={<>Loading...</>}>
          <Electric
            {...props}
            GetServiceData={
              (obj, sid) => {
                setFieldValue("otherData", {
                  obj: obj,
                  sid: sid,
                  service: "electric",
                  serviceType: "Electric",
                });
                submitForm();
              }
            }
            checkParentValidation={() => checkParentValidation()}
            ParentStuff={CurrentErrors}
          />
        </Suspense>
      )}

      {/* {RadioToggle && selectedTab === "debt" && (
        <Suspense fallback={<>Loading...</>}>
          <Debt
            {...props}
            GetServiceData={
              (obj, sid) => {
                setFieldValue("otherData", {
                  obj: obj,
                  sid: sid,
                  service: "debt",
                  serviceType: "Debt",
                });
                submitForm();
              }
            }
            checkParentValidation={() => checkParentValidation()}
            ParentStuff={CurrentErrors}
          />
        </Suspense>
      )} */}

      {RadioToggle && selectedTab === "water" && (
        <Suspense fallback={<>Loading...</>}>
          {" "}
          <Water
            {...props}
            GetServiceData={(obj, sid) => {
              setFieldValue("otherData", {
                obj: obj,
                sid: sid,
                service: "water",
                serviceType: "Water",
              });
              submitForm();
            }}
            checkParentValidation={() => checkParentValidation()}
            ParentStuff={CurrentErrors}
          />
        </Suspense>
      )}
      {RadioToggle && selectedTab === "chip&Pin" && (
        <Suspense fallback={<>Loading...</>}>
          {" "}
          <ChipPin
            {...props}
            GetServiceData={(obj, sid) => {
              setFieldValue("otherData", {
                obj: obj,
                sid: sid,
                service: "chipAndPin",
                serviceType: "ChipAndPin",
              });
              submitForm();
            }}
            checkParentValidation={() => checkParentValidation()}
            ParentStuff={CurrentErrors}
          />
        </Suspense>
      )}
      {RadioToggle && selectedTab === "telecoms" && (
        <Suspense fallback={<>Loading...</>}>
          {" "}
          <Telecoms
            {...props}
            GetServiceData={(obj, sid) => {
              setFieldValue("otherData", {
                obj: obj,
                sid: sid,
                service: "telecoms",
                serviceType: "Telecoms",
              });
              submitForm();
            }}
            checkParentValidation={() => checkParentValidation()}
            ParentStuff={CurrentErrors}
          />
        </Suspense>
      )}
      {RadioToggle && selectedTab === "broadband" && (
        <Suspense fallback={<>Loading...</>}>
          {" "}
          <Broadband
            {...props}
            GetServiceData={(obj, sid) => {
              setFieldValue("otherData", {
                obj: obj,
                sid: sid,
                service: "broadband",
                serviceType: "Broadband",
              });
              submitForm();
            }}
            checkParentValidation={() => checkParentValidation()}
            ParentStuff={CurrentErrors}
          />
        </Suspense>
      )}
      {RadioToggle && selectedTab === "energy" && (
        <Suspense fallback={<>Loading...</>}>
          {" "}
          <Energy
            {...props}
            GetServiceData={(obj, sid) => {
              setFieldValue("otherData", {
                obj: obj,
                sid: sid,
                service: "energy",
                serviceType: "Energy",
              });
              submitForm();
            }}
            checkParentValidation={() => checkParentValidation()}
            ParentStuff={CurrentErrors}
          />
        </Suspense>
      )}
      {/* {RadioToggle && selectedTab === "funeral" && (
        <Suspense fallback={<>Loading...</>}>
          {" "}
          <Funeral
            {...props}
            GetServiceData={(obj, sid) => {
              setFieldValue("otherData", {
                obj: obj,
                sid: sid,
                service: "funeral",
                serviceType: "Funeral",
              });
              submitForm();
            }}
            checkParentValidation={() => checkParentValidation()}
            ParentStuff={CurrentErrors}
          />
        </Suspense>
      )}
      {RadioToggle && selectedTab === "mortgage" && (
        <Suspense fallback={<>Loading...</>}>
          {" "}
          <Mortgage
            {...props}
            GetServiceData={(obj, sid) => {
              setFieldValue("otherData", {
                obj: obj,
                sid: sid,
                service: "mortgage",
                serviceType: "Mortgage",
              });
              submitForm();
            }}
            checkParentValidation={() => checkParentValidation()}
            ParentStuff={CurrentErrors}
          />
        </Suspense>
      )} */}
      {RadioToggle && selectedTab === "waste" && (
        <Suspense fallback={<>Loading...</>}>
          {" "}
          <Waste
            {...props}
            GetServiceData={(obj, sid) => {
              setFieldValue("otherData", {
                obj: obj,
                sid: sid,
                service: "waste",
                serviceType: "Waste",
              });
              submitForm();
            }}
            checkParentValidation={() => checkParentValidation()}
            ParentStuff={CurrentErrors}
          />
        </Suspense>
      )}
      {RadioToggle && selectedTab === "insurance" && (
        <Suspense fallback={<>Loading...</>}>
          {" "}
          <Insurance
            {...props}
            email={email}
            contact={contact}
            GetServiceData={(obj, sid) => {
              setFieldValue("otherData", {
                obj: obj,
                sid: sid,
                service: "insurance",
                serviceType: "Insurance",
              });
              submitForm();
            }}
            checkParentValidation={() => checkParentValidation()}
            ParentStuff={CurrentErrors}
          />
        </Suspense>
      )}
      {RadioToggle && selectedTab === "businessRates" && (
        <Suspense fallback={<>Loading...</>}>
          {" "}
          <BusinessRates
            {...props}
            GetServiceData={(obj, sid) => {
              setFieldValue("otherData", {
                obj: obj,
                sid: sid,
                service: "businessrates",
                serviceType: "BusinessRates",
              });
              submitForm();
            }}
            checkParentValidation={() => checkParentValidation()}
            ParentStuff={CurrentErrors}
          />
        </Suspense>
      )}

      {/* {RadioToggle && selectedTab === "telebroad" && (
        <Suspense fallback={<>Loading...</>}>
          <TeleBroad
            {...props}
            GetServiceData={
              (obj, sid) => {
                setFieldValue("otherData", {
                  obj: obj,
                  sid: sid,
                  service: "telecomandbroadband",
                  serviceType: "TelecomAndBroadband",
                });
                submitForm();
              }
            }
            checkParentValidation={() => checkParentValidation()}
            ParentStuff={CurrentErrors}
          />
        </Suspense>
      )} */}

      {RadioToggle && selectedTab === "eco" && (
        <Suspense fallback={<>Loading...</>}>
          <Eco
            {...props}
            GetServiceData={(obj, sid) => {
              setFieldValue("otherData", {
                obj: obj,
                sid: sid,
                service: "eco",
                serviceType: "Eco",
              });
              submitForm();
            }}
            checkParentValidation={() => checkParentValidation()}
            ParentStuff={CurrentErrors}
          />
        </Suspense>
      )}

      {RadioToggle && selectedTab === "paidSolar" && (
        <Suspense fallback={<>Loading...</>}>
          <SolarPaid
            {...props}
            GetServiceData={(obj, sid) => {
              setFieldValue("otherData", {
                obj: obj,
                sid: sid,
                service: "paidsolar",
                serviceType: "PaidSolar",
              });
              submitForm();
            }}
            checkParentValidation={() => checkParentValidation()}
            ParentStuff={CurrentErrors}
          />
        </Suspense>
      )}
    </>
  );
}
