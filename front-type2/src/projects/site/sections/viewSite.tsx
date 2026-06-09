import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Select from "react-select";
import { siteAction, selectSiteState } from "../Redux/site";
import { selectCompanyState } from "../../company/redux/company";
import OnTextEditInput from "../../../sharedUtils/sharedComponents/editHelpers2/onTextEditHelper";
import { AMPS } from "../../../sharedUtils/globalHelper/constantValues"; // export default connect(

export default function viewSite(props) {
  const siteState = useSelector(selectSiteState);
  const companyState = useSelector(selectCompanyState);

  const {
    siteList,
    currentSite,
    count,
    limit,
    remote,
    page,
    message,
    hideSideBar,
    messageCode,
    editRemote,
    isLoadingData,
  } = {
    ...siteState,
  };
  const dispatch = useDispatch();

  const _viewSite = (payload) => dispatch(siteAction.viewSite(payload));
  const _editSite = (payload) => dispatch(siteAction.editSite(payload));
  const _isLoadingData = (payload) =>
    dispatch(siteAction.setIsLoadingData(payload));

  useEffect(() => {
    _isLoadingData(true);
    _viewSite(props);
  }, []);

  const [defaultSS, setDefaultSS] = useState({});
  const [selectedContactId, setSelectedContactId] = useState();

  interface Igas {
    MPRN: string;
    meterSerialNumber: string;
  }
  interface Ielectric {
    topLine: string;
    meterNumber: string;
    meterSerialNumber: string;
  }
  interface Iwater {
    WaterCorespId: string;
    SewageSpid: string;
    WaterMeterSN: string;
  }
  interface Ichipandpin {
    ProviderRefNumber: string;
    midNumber: string;
  }

  const simpleEdit = (value, closeEdit, setSubmitting) => {
    const { User, gas, electric, water } = currentSite;
    const es: any = {
      findId: currentSite._id,
      editData: {},
    };
    es.companyId = companyState.currentCompany._id; // es.editData.companyId = props.currentCompany._id;s

    if (value.siteName) {
      es.editData.siteName = value.siteName;
    }

    if (value.siteAddress) {
      es.editData.siteAddress = value.siteAddress;
    }

    if (value.town) {
      es.editData.town = value.town;
    }

    if (value.city) {
      es.editData.city = value.city;
    }

    if (value.country) {
      es.editData.country = value.country;
    }

    if (value.postcode) {
      es.editData.postcode = value.postcode;
    }

    if (value.siteContactPerson) {
      es.editData.User = [value.siteContactPerson.id];
    }

    Object.keys(value).forEach((key) => {
      const arr = key.split("_");
      if (arr && arr.length === 2) {
        es.editData[arr[0]] = {
          ...(currentSite[arr[0]] || {}),
          [arr[1]]: value[key],
        };
      }
    });

    _isLoadingData(true);
    _editSite(es);
    closeEdit(null);
    setSubmitting(false);
  };

  const {
    siteName,
    siteAddress,
    town,
    city,
    country,
    postcode,
    User,
  } = currentSite;

  const gas: Igas = currentSite.gas;
  const electric: Ielectric = currentSite.electric;
  const water: Iwater = currentSite.water;
  const chipandpin: Ichipandpin = currentSite.chipandpin;

  if (User && Object.keys(defaultSS).length <= 0) {
    setDefaultSS({
      label: User.name,
      value: User.name,
      id: User._id,
    });
  }

  let contactList2 = [];

  if (
    companyState.currentCompany &&
    companyState.currentCompany.Contact !== undefined
  ) {
    contactList2 = companyState.currentCompany.Contact.map((e) => ({
      label: e.name,
      value: e.name,
      id: e._id,
    }));
  }

  function CreateEditabeTextField(DisplayName, obj, field, value) {
    const fieldName = `${obj}_${field}`;
    return (
      <TableRow>
        <TableCell>
          <strong>{DisplayName}</strong>
        </TableCell>
        {AMPS.includes(props.slug) ? (
          <TableCell component="th" scope="row">
            <OnTextEditInput
              name={fieldName}
              value={value}
              onSubmit={simpleEdit}
              validateIt={Yup.object().shape({
                [fieldName]: Yup.string().required("Required"),
              })}
            >
              {(props) => {
                return (
                  <TextField
                    error={
                      props.errors[fieldName] && props.touched[fieldName]
                        ? true
                        : false
                    }
                    name={fieldName}
                    value={props.values[fieldName]}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    margin="normal"
                  />
                );
              }}
            </OnTextEditInput>
          </TableCell>
        ) : (
          <TableCell component="th" scope="row">
            {value}
          </TableCell>
        )}
      </TableRow>
    );
  }

  return (
    <Grid container spacing={3} className="txt-uppercase">
      <Grid item md={8} xs={12}>
        <TableContainer component={Paper}>
          <Table aria-label="caption table">
            <TableBody>
              <TableRow>
                <TableCell>
                  <strong>Site Name</strong>
                </TableCell>
                {AMPS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="siteName"
                      value={siteName ? siteName : 'N/A'}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        siteName: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.siteName && props.touched.siteName
                                ? true
                                : false
                            }
                            name="siteName"
                            value={props.values.siteName}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {siteName}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Site Address</strong>
                </TableCell>
                {AMPS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="siteAddress"
                      value={siteAddress ? siteAddress : 'N/A'}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        siteAddress: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.siteAddress &&
                                props.touched.siteAddress
                                ? true
                                : false
                            }
                            name="siteAddress"
                            value={props.values.siteAddress}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {siteAddress}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Town</strong>
                </TableCell>
                {AMPS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="town"
                      value={town ? town : 'N/A'}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        town: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.town && props.touched.town
                                ? true
                                : false
                            }
                            name="town"
                            value={props.values.town}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {town}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>City</strong>
                </TableCell>
                {AMPS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="city"
                      value={city ? city : 'N/A'}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        city: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.city && props.touched.city
                                ? true
                                : false
                            }
                            name="city"
                            value={props.values.city}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {city}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Country</strong>
                </TableCell>
                {AMPS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="country"
                      value={country ? country : 'N/A'}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        country: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.country && props.touched.country
                                ? true
                                : false
                            }
                            name="country"
                            value={props.values.country}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {country}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Postcode</strong>
                </TableCell>
                {AMPS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="postcode"
                      value={postcode ? postcode : 'N/A'}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        postcode: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.postcode && props.touched.postcode
                                ? true
                                : false
                            }
                            name="postcode"
                            value={props.values.postcode}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {postcode}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Site Contact Person</strong>
                </TableCell>
                {AMPS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="siteContactPerson"
                      value={
                        User &&
                          User !== undefined &&
                          User[0] !== undefined &&
                          User[0] &&
                          User[0].name ? { value: User[0]._id, label: User[0].name } : null
                      }
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        siteContactPerson: Yup.string().required("Required"),
                      })}
                      reactSelect={true}
                    >
                      {(props) => {
                        return (
                          <Select
                            error={
                              props.errors.siteContactPerson &&
                                props.touched.siteContactPerson
                                ? true
                                : false
                            }
                            className="basic-multi-select WidhtFull100"
                            name="siteContactPerson"
                            onChange={(e) => {
                              setDefaultSS({
                                label: e.label,
                                value: e.label,
                              });
                              props.setFieldValue("siteContactPerson", e);
                              setSelectedContactId(e);
                            }}
                            value={defaultSS}
                            options={contactList2}
                            helperText={!props.errors.siteContactPerson}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {User &&
                      User !== undefined &&
                      User[0] !== undefined &&
                      User[0] &&
                      User[0].name}
                  </TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell>GAS</TableCell>
              </TableRow>

              {CreateEditabeTextField("MPRN", "gas", "MPRN", gas?.MPRN)}
              {CreateEditabeTextField(
                "Meter Serial Number",
                "gas",
                "meterSerialNumber",
                gas?.meterSerialNumber
              )}

              <TableRow>
                <TableCell>Electric</TableCell>
              </TableRow>
              {CreateEditabeTextField(
                "Top Line",
                "electric",
                "topLine",
                electric?.topLine
              )}
              {CreateEditabeTextField(
                "Bottom Line",
                "electric",
                "meterNumber",
                electric?.meterNumber
              )}
              {CreateEditabeTextField(
                "Meter Serial Number",
                "electric",
                "meterSerialNumber",
                electric?.meterSerialNumber
              )}

              <TableRow>
                <TableCell>Water</TableCell>
              </TableRow>
              {CreateEditabeTextField(
                "WATER CORESPID",
                "water",
                "WaterCorespId",
                water?.WaterCorespId
              )}
              {CreateEditabeTextField(
                "SEWAGE SPID",
                "water",
                "SewageSpid",
                water?.SewageSpid
              )}
              {CreateEditabeTextField(
                "WATER METER SN",
                "water",
                "WaterMeterSN",
                water?.WaterMeterSN
              )}

              <TableRow>
                <TableCell>Chip and Pin</TableCell>
              </TableRow>
              {CreateEditabeTextField(
                "WATER Provider Ref. number",
                "chipandpin",
                "ProviderRefNumber",
                chipandpin?.ProviderRefNumber
              )}
              {CreateEditabeTextField(
                "MID Number",
                "chipandpin",
                "midNumber",
                chipandpin?.midNumber
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
