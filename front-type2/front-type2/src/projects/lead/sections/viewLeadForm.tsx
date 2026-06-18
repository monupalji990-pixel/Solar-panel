import React, { } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { AM, AMS } from "sharedUtils/globalHelper/constantValues";
import OnTextEditInput from "../../../sharedUtils/sharedComponents/editHelpers2/onTextEditHelper";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import Select from "react-select";
import Grid from "@material-ui/core/Grid";
import ViewFile from '../../../sharedUtils/sharedComponents/viewFile';

const useStyles = makeStyles(() => ({
    root: {
        maxWidth: 400,
    },
    marginSpacing: {
        marginTop: 10,
        marginBottom: 5,
    },
    paddingSpacing: {
        padding: 15,
    },
    topBtnStyle: {
        background: "#193562",
        color: "#ffffff",
        "&:hover": {
            background: "#193562",
            color: "#ffffff",
        },
        padding: "7px 7px",
        borderRadius: 20,
    },
    setTopBtn: {
        position: "absolute",
        top: "1.5rem",
        right: 0,
        paddingLeft: "10rem",
        "@media(max-width:767px)": {
            top: "1rem",
        },
        width: "auto",
    },

    RightBtnStyle: {
        paddingRight: "2.8rem",
        marginLeft: 20,
    },
}));

export default function ViewLeadForm(props) {
    const classes = useStyles();
    const [state, setState] = React.useState({
        openMsg: false,
        resMsg: ''
    })

    let baseURL;
    if (process.env.NODE_ENV === "development") {
        baseURL = "http://localhost:8087/api/";
    } else {
        baseURL = "/api/";
    }

    const {
        assignee,
        consumer,
        data
    } = props.leadRowdata

    const simpleEdit = (value, closeEdit, setSubmitting) => {
        if (props.leadRowdata?._id) {
            axios({
                method: "put",
                url: baseURL + `form/${props.leadRowdata?._id}`,
                withCredentials: true,
                data: {
                    update: {
                        data: { ...data, ...value }
                    }
                },
            })
                .then((response) => {
                    if (response.data.success) {
                        setState({ ...state, openMsg: true, resMsg: 'Updated Successfully.' })
                        props.setIsUpdatedData(true);
                    } else {
                        setState({ ...state, openMsg: true, resMsg: response.data.message })
                    }
                })
                .catch((resp) => {
                    console.log("Catch Error----", resp)
                });
        }
        closeEdit(null);
        setSubmitting(false);
    }

    return (
        <div className="txt-uppercase app">

            <TableContainer component={Paper}>
                <Table aria-label="caption table" >
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <strong>Assignee</strong>
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {assignee.name}
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <strong>Consumer</strong>
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {consumer.title + ' ' + consumer.firstName + ' ' + consumer.surName}
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <strong>Address</strong>
                            </TableCell>
                            {AMS.includes(props.slug) ? (
                                <TableCell component="th" scope="row">
                                    <OnTextEditInput
                                        name="address"
                                        value={data.address || "N/A"}
                                        onSubmit={simpleEdit}
                                    >
                                        {(props) => {
                                            return (
                                                <TextField
                                                    name="address"
                                                    value={props.values.address}
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
                                    {data.address || "N/A"}
                                </TableCell>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <strong>Property</strong>
                            </TableCell>

                            {AMS.includes(props.slug) ?
                                <TableCell component="th" scope="row">
                                    <OnTextEditInput
                                        name="property"
                                        value={data.property}
                                        onSubmit={simpleEdit}
                                    >
                                        {(props) => (
                                            <Grid item>
                                                <Select
                                                    id="property"
                                                    className="WidhtFull100 basic-multi-select"
                                                    placeholder="property"
                                                    value={{
                                                        label: props.values.property,
                                                        value: props.values.property
                                                    }}
                                                    onChange={(e) => {
                                                        props.setFieldValue("property", e.value);
                                                    }}
                                                    onBlur={props.handleBlur}
                                                    margin="normal"
                                                    aria-describedby="property-number-error"
                                                    name="property"
                                                    options={[
                                                        {
                                                            label: 'Detached',
                                                            value: 'Detached'
                                                        },
                                                        {
                                                            label: 'Semi',
                                                            value: 'Semi'
                                                        },
                                                        {
                                                            label: 'Mid Terrace',
                                                            value: 'Mid Terrace'
                                                        },
                                                        {
                                                            label: 'End Terrace',
                                                            value: 'End Terrace'
                                                        },
                                                        {
                                                            label: 'Flat',
                                                            value: 'Flat'
                                                        }
                                                    ]}
                                                />
                                            </Grid>
                                        )}
                                    </OnTextEditInput>
                                </TableCell>
                                :
                                <TableCell component="th" scope="row">
                                    {data.property || 'N/A'}
                                </TableCell>
                            }
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <strong>Is the property fully furnished?</strong>
                            </TableCell>

                            {AMS.includes(props.slug) ?
                                <TableCell component="th" scope="row">
                                    <OnTextEditInput
                                        name="propertyFurnished"
                                        value={data.propertyFurnished}
                                        onSubmit={simpleEdit}
                                    >
                                        {(props) => (
                                            <Grid item>
                                                <Select
                                                    id="propertyFurnished"
                                                    className="WidhtFull100 basic-multi-select"
                                                    placeholder="propertyFurnished"
                                                    value={{
                                                        label: props.values.propertyFurnished,
                                                        value: props.values.propertyFurnished
                                                    }}
                                                    onChange={(e) => {
                                                        props.setFieldValue("propertyFurnished", e.value);
                                                    }}
                                                    onBlur={props.handleBlur}
                                                    margin="normal"
                                                    aria-describedby="propertyFurnished-number-error"
                                                    name="propertyFurnished"
                                                    options={[
                                                        {
                                                            label: 'Yes',
                                                            value: 'Yes'
                                                        },
                                                        {
                                                            label: 'No',
                                                            value: 'No'
                                                        }
                                                    ]}
                                                />
                                            </Grid>
                                        )}
                                    </OnTextEditInput>
                                </TableCell>
                                :
                                <TableCell component="th" scope="row">
                                    {data.propertyFurnished || 'N/A'}
                                </TableCell>
                            }
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <strong>Who owns the property?</strong>
                            </TableCell>
                            {AMS.includes(props.slug) ? (
                                <TableCell component="th" scope="row">
                                    <OnTextEditInput
                                        name="whoOwnProperty"
                                        value={data.whoOwnProperty || "N/A"}
                                        onSubmit={simpleEdit}
                                    >
                                        {(props) => {
                                            return (
                                                <TextField
                                                    name="whoOwnProperty"
                                                    value={props.values.whoOwnProperty}
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
                                    {data.whoOwnProperty || "N/A"}
                                </TableCell>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <strong>Is there access to the loft?</strong>
                            </TableCell>
                            {AMS.includes(props.slug) ? (
                                <TableCell component="th" scope="row">
                                    <OnTextEditInput
                                        name="loftAccess"
                                        value={data.loftAccess || "N/A"}
                                        onSubmit={simpleEdit}
                                    >
                                        {(props) => {
                                            return (
                                                <TextField
                                                    name="loftAccess"
                                                    value={props.values.loftAccess}
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
                                    {data.loftAccess || "N/A"}
                                </TableCell>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <strong>Is there a previous EPC on the property, what is the rating.<br />
                                    Print this ready for discussion with customer</strong>
                            </TableCell>
                            {AMS.includes(props.slug) ? (
                                <TableCell component="th" scope="row">
                                    <OnTextEditInput
                                        name="previosEPC"
                                        value={data.previosEPC || "N/A"}
                                        onSubmit={simpleEdit}
                                    >
                                        {(props) => {
                                            return (
                                                <TextField
                                                    name="previosEPC"
                                                    value={props.values.previosEPC}
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
                                    {data.previosEPC || "N/A"}
                                </TableCell>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <strong>Note down any other property numbers that are F or G</strong>
                            </TableCell>
                            {AMS.includes(props.slug) ? (
                                <TableCell component="th" scope="row">
                                    <OnTextEditInput
                                        name="propertyNumberFG"
                                        value={data.propertyNumberFG || "N/A"}
                                        onSubmit={simpleEdit}
                                    >
                                        {(props) => {
                                            return (
                                                <TextField
                                                    name="propertyNumberFG"
                                                    value={props.values.propertyNumberFG}
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
                                    {data.propertyNumberFG || "N/A"}
                                </TableCell>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <strong>What benefits in the house?</strong>
                            </TableCell>
                            {AMS.includes(props.slug) ? (
                                <TableCell component="th" scope="row">
                                    <OnTextEditInput
                                        name="benefitsInHouse"
                                        value={data.benefitsInHouse || "N/A"}
                                        onSubmit={simpleEdit}
                                    >
                                        {(props) => {
                                            return (
                                                <TextField
                                                    name="benefitsInHouse"
                                                    value={props.values.benefitsInHouse}
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
                                    {data.benefitsInHouse || "N/A"}
                                </TableCell>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <strong>Benefits options</strong>
                            </TableCell>

                            {AMS.includes(props.slug) ?
                                <TableCell component="th" scope="row">
                                    <OnTextEditInput
                                        name="benefitOptions"
                                        value={data.benefitOptions}
                                        onSubmit={simpleEdit}
                                    >
                                        {(props) => (
                                            <Grid item>
                                                <Select
                                                    id="benefitOptions"
                                                    className="WidhtFull100 basic-multi-select"
                                                    placeholder="benefitOptions"
                                                    value={{
                                                        label: props.values.benefitOptions,
                                                        value: props.values.benefitOptions
                                                    }}
                                                    onChange={(e) => {
                                                        props.setFieldValue("benefitOptions", e.value);
                                                    }}
                                                    onBlur={props.handleBlur}
                                                    margin="normal"
                                                    isMulti
                                                    aria-describedby="benefitOptions-number-error"
                                                    name="benefitOptions"
                                                    options={[
                                                        {
                                                            label: 'Forms Benefits',
                                                            value: 'Forms Benefits',
                                                        },
                                                        {
                                                            label: 'Child Benefits',
                                                            value: 'Child Benefits',
                                                        },
                                                        {
                                                            label: 'LA Flex Low Income',
                                                            value: 'LA Flex Low Income',
                                                        },
                                                        {
                                                            label: 'LA Flew Medical',
                                                            value: 'LA Flew Medical',
                                                        }
                                                    ]}
                                                />
                                            </Grid>
                                        )}
                                    </OnTextEditInput>
                                </TableCell>
                                :
                                <TableCell component="th" scope="row">
                                    {data.benefitOptions || 'N/A'}
                                </TableCell>
                            }
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <strong>Who is benefit receiver?</strong>
                            </TableCell>
                            {AMS.includes(props.slug) ? (
                                <TableCell component="th" scope="row">
                                    <OnTextEditInput
                                        name="benefitReceiver"
                                        value={data.benefitReceiver || "N/A"}
                                        onSubmit={simpleEdit}
                                    >
                                        {(props) => {
                                            return (
                                                <TextField
                                                    name="benefitReceiver"
                                                    value={props.values.benefitReceiver}
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
                                    {data.benefitReceiver || "N/A"}
                                </TableCell>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <strong>Property owner and benefit receiver relationship</strong>
                            </TableCell>
                            {AMS.includes(props.slug) ? (
                                <TableCell component="th" scope="row">
                                    <OnTextEditInput
                                        name="relationProperty"
                                        value={data.relationProperty || "N/A"}
                                        onSubmit={simpleEdit}
                                    >
                                        {(props) => {
                                            return (
                                                <TextField
                                                    name="relationProperty"
                                                    value={props.values.relationProperty}
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
                                    {data.relationProperty || "N/A"}
                                </TableCell>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <strong>Can they get benefits letter for survey</strong>
                            </TableCell>
                            {AMS.includes(props.slug) ? (
                                <TableCell component="th" scope="row">
                                    <OnTextEditInput
                                        name="benefitsLetter"
                                        value={data.benefitsLetter || "N/A"}
                                        onSubmit={simpleEdit}
                                    >
                                        {(props) => {
                                            return (
                                                <TextField
                                                    name="benefitsLetter"
                                                    value={props.values.benefitsLetter}
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
                                    {data.benefitsLetter || "N/A"}
                                </TableCell>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <strong>Proof of residency (utility bill within 3 months) for survey</strong>
                            </TableCell>
                            {AMS.includes(props.slug) ? (
                                <TableCell component="th" scope="row">
                                    <OnTextEditInput
                                        name="proofOfResidency"
                                        value={data.proofOfResidency || "N/A"}
                                        onSubmit={simpleEdit}
                                    >
                                        {(props) => {
                                            return (
                                                <TextField
                                                    name="proofOfResidency"
                                                    value={props.values.proofOfResidency}
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
                                    {data.proofOfResidency || "N/A"}
                                </TableCell>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <strong>Driving License, Passport for survey</strong>
                            </TableCell>
                            {AMS.includes(props.slug) ? (
                                <TableCell component="th" scope="row">
                                    <OnTextEditInput
                                        name="proofOfId"
                                        value={data.proofOfId || "N/A"}
                                        onSubmit={simpleEdit}
                                    >
                                        {(props) => {
                                            return (
                                                <TextField
                                                    name="proofOfId"
                                                    value={props.values.proofOfId}
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
                                    {data.proofOfId || "N/A"}
                                </TableCell>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <strong>Property comes under what council</strong>
                            </TableCell>
                            {AMS.includes(props.slug) ? (
                                <TableCell component="th" scope="row">
                                    <OnTextEditInput
                                        name="propertyCouncil"
                                        value={data.propertyCouncil || "N/A"}
                                        onSubmit={simpleEdit}
                                    >
                                        {(props) => {
                                            return (
                                                <TextField
                                                    name="propertyCouncil"
                                                    value={props.values.propertyCouncil}
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
                                    {data.propertyCouncil || "N/A"}
                                </TableCell>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <strong>Estimated total household income</strong>
                            </TableCell>
                            {AMS.includes(props.slug) ? (
                                <TableCell component="th" scope="row">
                                    <OnTextEditInput
                                        name="householdIncome"
                                        value={data.householdIncome || "N/A"}
                                        onSubmit={simpleEdit}
                                    >
                                        {(props) => {
                                            return (
                                                <TextField
                                                    name="householdIncome"
                                                    value={props.values.householdIncome}
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
                                    {data.householdIncome || "N/A"}
                                </TableCell>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <strong>Any previous government funding? If yes, list the work done</strong>
                            </TableCell>
                            {AMS.includes(props.slug) ? (
                                <TableCell component="th" scope="row">
                                    <OnTextEditInput
                                        name="prevGovFunding"
                                        value={data.prevGovFunding || "N/A"}
                                        onSubmit={simpleEdit}
                                    >
                                        {(props) => {
                                            return (
                                                <TextField
                                                    name="prevGovFunding"
                                                    value={props.values.prevGovFunding}
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
                                    {data.prevGovFunding || "N/A"}
                                </TableCell>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <strong>When was the funding done approximately</strong>
                            </TableCell>
                            {AMS.includes(props.slug) ? (
                                <TableCell component="th" scope="row">
                                    <OnTextEditInput
                                        name="approxFunding"
                                        value={data.approxFunding || "N/A"}
                                        onSubmit={simpleEdit}
                                    >
                                        {(props) => {
                                            return (
                                                <TextField
                                                    name="approxFunding"
                                                    value={props.values.approxFunding}
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
                                    {data.approxFunding || "N/A"}
                                </TableCell>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <strong>Are they happy with removal of old heating systems (Gas Fires, Storage/Panel Heaters)</strong>
                            </TableCell>
                            {AMS.includes(props.slug) ? (
                                <TableCell component="th" scope="row">
                                    <OnTextEditInput
                                        name="heatingSystem"
                                        value={data.heatingSystem || "N/A"}
                                        onSubmit={simpleEdit}
                                    >
                                        {(props) => {
                                            return (
                                                <TextField
                                                    name="heatingSystem"
                                                    value={props.values.heatingSystem}
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
                                    {data.heatingSystem || "N/A"}
                                </TableCell>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <strong>Has loft got insulation? Approx how much and is it boarded?</strong>
                            </TableCell>
                            {AMS.includes(props.slug) ? (
                                <TableCell component="th" scope="row">
                                    <OnTextEditInput
                                        name="loftGotInsulation"
                                        value={data.loftGotInsulation || "N/A"}
                                        onSubmit={simpleEdit}
                                    >
                                        {(props) => {
                                            return (
                                                <TextField
                                                    name="loftGotInsulation"
                                                    value={props.values.loftGotInsulation}
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
                                    {data.loftGotInsulation || "N/A"}
                                </TableCell>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <strong>Have they got cavity wall insulation? And when it was done</strong>
                            </TableCell>
                            {AMS.includes(props.slug) ? (
                                <TableCell component="th" scope="row">
                                    <OnTextEditInput
                                        name="cavityWallInsulation"
                                        value={data.cavityWallInsulation || "N/A"}
                                        onSubmit={simpleEdit}
                                    >
                                        {(props) => {
                                            return (
                                                <TextField
                                                    name="cavityWallInsulation"
                                                    value={props.values.cavityWallInsulation}
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
                                    {data.cavityWallInsulation || "N/A"}
                                </TableCell>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <strong>What make/model is the boiler, how old it is? Under warranty?</strong>
                            </TableCell>
                            {AMS.includes(props.slug) ? (
                                <TableCell component="th" scope="row">
                                    <OnTextEditInput
                                        name="boilerModal"
                                        value={data.boilerModal || "N/A"}
                                        onSubmit={simpleEdit}
                                    >
                                        {(props) => {
                                            return (
                                                <TextField
                                                    name="boilerModal"
                                                    value={props.values.boilerModal}
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
                                    {data.boilerModal || "N/A"}
                                </TableCell>
                            )}
                        </TableRow>

                    </TableBody>
                </Table>
            </TableContainer>

            <Grid item md={12} xs={12} style={{ paddingBottom: 0, marginTop: 30 }}>
                <h3>For Benefit - ESTC completely filled ticked, signed and dated</h3>
            </Grid>
            <TableContainer component={Paper}>
                <Table aria-label="caption table" >
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <strong>Benefit letter (required if DWP comes back Unmatched on Unverified)</strong>
                            </TableCell>
                            <TableCell>
                                {data.benefitLetter ?
                                    <ViewFile commentFor='admin' attachments={[{ value: data.benefitLetter, name: 'Benefit Letter' }]} ></ViewFile>
                                    : 'N/A'
                                }
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <strong>Council Tax Bill</strong>
                            </TableCell>
                            <TableCell>
                                {data.councilTaxBill ?
                                    <ViewFile commentFor='admin' attachments={[{ value: data.councilTaxBill, name: 'Council Tax Bill' }]} ></ViewFile>
                                    : 'N/A'
                                }
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <strong>Utility Bill</strong>
                            </TableCell>
                            <TableCell>
                                {data.utilityBill ?
                                    <ViewFile commentFor='admin' attachments={[{ value: data.utilityBill, name: 'Utility Bill' }]} ></ViewFile>
                                    :
                                    'N/A'
                                }
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <Grid item md={12} xs={12} style={{ paddingBottom: 0, marginTop: 30 }}>
                <h3>For Child Benefit - ESTC completely filled ticked, signed and dated</h3>
            </Grid>
            <TableContainer component={Paper}>
                <Table aria-label="caption table" >
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <strong>Photo of the child benefit award letter (CBAN)</strong>
                            </TableCell>
                            <TableCell>
                                {data.childBenefit ?
                                    <ViewFile commentFor='admin' attachments={[{ value: data.childBenefit, name: 'Child Benefit Award Letter' }]} ></ViewFile>
                                    : 'N/A'
                                }
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <strong>Evidence: the last 3 months payslips alongside bank statements for the last 3 months<br /> from all accounts receiving an income, or the most recent year's P60.</strong>
                            </TableCell>
                            <TableCell>
                                {data.evidence ?
                                    <ViewFile commentFor='admin' attachments={[{ value: data.evidence, name: 'Evidence' }]} ></ViewFile>
                                    : 'N/A'
                                }
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <strong>Council tax letter showing the number of adults residing at the address.</strong>
                            </TableCell>
                            <TableCell>
                                {data.councilTaxLetter ?
                                    <ViewFile commentFor='admin' attachments={[{ value: data.councilTaxLetter, name: 'Council tax letter' }]} ></ViewFile>
                                    : 'N/A'
                                }
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <Grid item md={12} xs={12} style={{ paddingBottom: 0, marginTop: 30 }}>
                <h3>For LA Flex Low Income Route - Application completely filled, route ticked, signed and dated and evidence for that route collected.</h3>
            </Grid>
            <TableContainer component={Paper}>
                <Table aria-label="caption table" >
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <strong>Benefit letter all pages, where the customer doesn’t have a benefit letter,<br /> we can accept a P60 or P45 of all residents over 18 years old living at the property.</strong>
                            </TableCell>
                            <TableCell>
                                {data.benefitLetter2 ?
                                    <ViewFile commentFor='admin' attachments={[{ value: data.benefitLetter2, name: 'Benefit letter' }]} ></ViewFile>
                                    : 'N/A'
                                }
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <strong>Bank statements, 3 months consecutive without any missing transactions<br /> of all residents over 18 years old living at the property.</strong>
                            </TableCell>
                            <TableCell>
                                {data.bankStatements ?
                                    <ViewFile commentFor='admin' attachments={[{ value: data.bankStatements, name: 'Bank statements' }]} ></ViewFile>
                                    : 'N/A'
                                }
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <strong>Payslips, 3 months for same month as bank statements of all residents<br /> over 18 years old living at the property.</strong>
                            </TableCell>
                            <TableCell>
                                {data.payslips ?
                                    <ViewFile commentFor='admin' attachments={[{ value: data.payslips, name: 'Payslips' }]} ></ViewFile>
                                    : 'N/A'
                                }
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <strong>Council Tax Bill</strong>
                            </TableCell>
                            <TableCell>
                                {data.councilTaxBill2 ?
                                    <ViewFile commentFor='admin' attachments={[{ value: data.councilTaxBill2, name: 'Council Tax Bill' }]} ></ViewFile>
                                    : 'N/A'
                                }
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <strong>Utility Bill</strong>
                            </TableCell>
                            <TableCell>
                                {data.utilityBill2 ?
                                    <ViewFile commentFor='admin' attachments={[{ value: data.utilityBill2, name: 'Utility Bill' }]} ></ViewFile>
                                    : 'N/A'
                                }
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <Grid item md={12} xs={12} style={{ paddingBottom: 0, marginTop: 30 }}>
                <h3>For LA Flex NHS Referrals Route - Application completely filled, route ticked, signed and dated and evidence for that route collected.</h3>
            </Grid>
            <TableContainer component={Paper}>
                <Table aria-label="caption table" >
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <strong>Letter from NHS Trust or GP or NHS Primary Care Trust or Health Board</strong>
                            </TableCell>
                            <TableCell>
                                {data.NhsTrustLetter ?
                                    <ViewFile commentFor='admin' attachments={[{ value: data.NhsTrustLetter, name: 'Letter from NHS Trust' }]} ></ViewFile>
                                    : 'N/A'
                                }
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <strong>Council Tax Bill</strong>
                            </TableCell>
                            <TableCell>
                                {data.councilTaxBill3 ?
                                    <ViewFile commentFor='admin' attachments={[{ value: data.councilTaxBill3, name: 'Council Tax Bill' }]} ></ViewFile>
                                    : 'N/A'
                                }
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <strong>Utility Bill</strong>
                            </TableCell>
                            <TableCell>
                                {data.utilityBill3 ?
                                    <ViewFile commentFor='admin' attachments={[{ value: data.utilityBill3, name: 'Utility Bill' }]} ></ViewFile>
                                    : 'N/A'
                                }
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={state.openMsg}
                autoHideDuration={4000}
                onClose={() => setState({ ...state, openMsg: false })}
                message={state.resMsg}
                action={
                    <React.Fragment>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={() => setState({ ...state, openMsg: false })}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                }
            />
        </div >
    );
}