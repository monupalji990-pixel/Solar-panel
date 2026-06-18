import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";
import * as Yup from "yup";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import OnTextEditInput from "../../../sharedUtils/sharedComponents/editHelpers2/onTextEditHelper";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import Select2 from '../../../sharedUtils/sharedComponents/editHelpers2/editHelperSelectGlobal';
import { campaignAction, selectCampaignState } from "../redux/campaign";
import Lodash from 'lodash';
import { Button } from "@material-ui/core";

const useStyles = makeStyles(() => ({
    Spacing: {
        marginBottom: "15px",
    },
    TopHeading: {
        position: "absolute",
        top: "1.8rem",
        left: "12rem",
        "@media(max-width:480px)": {
            position: "static",
            fontSize: "1.1rem",
            fontWight: 500,
        },
    },
    heading: {
        fontSize: "1.3rem",
        fontWight: 700,
    },
    marginSpacing: {
        marginTop: 10,
        marginBottom: 5,
    },
    paddingSpacing: {
        padding: 15,
    },
}));

export default function ManageCompany(props) {
    return (
        <MyDrawer
            drawerSize="1260px"
            iconName="Campaign"
            open={props.open === "manageCampaignDrawer"}
            onClose={props.onClose.bind(this)}
        >
            <ManageCampaignLogic {...props} />
        </MyDrawer>
    );
}

function ManageCampaignLogic(props) {
    const [dummyOne, setDummyOne] = useState("hello");

    useEffect(() => {
        props._isLoadingData(true);
        props._slugUpdate(props);
        props._viewSingle({ id: props.data?.id });
        setDummyOne("changedAgain");
    }, []);

    const classes = useStyles();
    const campaignState = useSelector(selectCampaignState);
    const currentCampaign = campaignState.currentCampaign;

    const dispatch = useDispatch();

    const simpleEdit = (value, closeEdit, setSubmitting) => {
        const cu = value;
        if (value.creditScoreDate) cu.creditScoreDate = value.creditScoreDate;

        let so = {
            id: currentCampaign.id,
            ...value
        };

        if (value.lists) {
            const recipients = {
                listIds: value.lists.map(e => e.value)
            }
            so.recipients = recipients;
            const { lists, ...other } = so;
            so = other;
        }
        props._edit({ data: so, fbag: { closeEdit, setSubmitting } });
    };

    const currentProps = props;
    const {
        name,
        type,
        status,
        sender,
        createdAt,
        modifiedAt,
        recipients,
        statistics,
        subject
    } = currentCampaign || {};
    const { globalStats, campaignStats } = statistics || {};

    const [recipientslists, setRecipientlists] = useState([]);

    useEffect(() => {
        const newlist = recipients?.lists && recipients?.lists.map(e => ({ label: e.name, value: e.id }))
        setRecipientlists(newlist)
    }, [recipients?.lists])

    const contctlistsState = campaignState.contactlists;

    useEffect(() => {
        if (contctlistsState.list?.length <= 0)
            dispatch(campaignAction.listContactList(null));
    }, [])

    function handleSearchContactlists(payload) {
        dispatch(campaignAction.changeSearchlistContactList({ search: payload.search }));
    }

    const delayedHandleSearchContactlists = useCallback(
        Lodash.debounce((payload) => {
            handleSearchContactlists(payload);
        }, 500),
        []
    );

    function handleScolldownContactlists() {
        dispatch(campaignAction.changePagelistContactList({ skip: contctlistsState.skip + contctlistsState.count, limit: contctlistsState.limit }))
    }

    const [contactlistsOption, setContactlistsOption] = useState([]);

    useEffect(() => {
        const list = contctlistsState.list.map(e => ({ value: e.id, label: e.name }));
        setContactlistsOption(list)

    }, [contctlistsState.list])

    if (props.isLoadingData) {
        return (
            <Grid container direction="row" justify="center" alignItems="center">
                <CircularProgress />
            </Grid>
        );
    }

    function handleSendCampaign() {
        dispatch(campaignAction.sendCampaign({ id: currentCampaign?.id }))
    }
    return (
        <Grid container spacing={2} className="txt-uppercase">
            <Grid item xs={12} md={12}>
                <Typography variant="h5" gutterBottom className={classes.TopHeading}>
                    {name}
                </Typography>
            </Grid>

            <>
                <Grid item md={12} xs={12}>
                    <TableContainer component={Paper}>
                        <Table aria-label="caption table">
                            <TableBody>

                                <TableRow>
                                    <TableCell>
                                        <strong>Name</strong>
                                    </TableCell>

                                    {["admin", "management"].includes(
                                        currentProps.slug
                                    ) ? (
                                        <TableCell component="th" scope="row">
                                            <OnTextEditInput
                                                name="name"
                                                value={name || "N/A"}
                                                onSubmit={simpleEdit}
                                                validateIt={Yup.object().shape({
                                                    name: Yup.string().required("Required"),
                                                })}
                                            >
                                                {(props) => {
                                                    return (
                                                        <TextField
                                                            error={
                                                                !!(
                                                                    props.errors.name &&
                                                                    props.touched.name
                                                                )
                                                            }
                                                            className="profile-pic"
                                                            name="name"
                                                            value={props.values.name}
                                                            helperText={!props.errors.name}
                                                            onChange={props.handleChange}
                                                            onBlur={props.handleBlur}
                                                            margin="normal"
                                                        />
                                                    );
                                                }}
                                            </OnTextEditInput>
                                        </TableCell>
                                    ) : (
                                        <TableCell>{name || "N/A"}</TableCell>
                                    )}
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        <strong>Subject</strong>
                                    </TableCell>

                                    {["admin", "management"].includes(
                                        currentProps.slug
                                    ) ? (
                                        <TableCell component="th" scope="row">
                                            <OnTextEditInput
                                                name="subject"
                                                value={subject || "N/A"}
                                                onSubmit={simpleEdit}
                                                validateIt={Yup.object().shape({
                                                    subject: Yup.string().required("Required"),
                                                })}
                                            >
                                                {(props) => {
                                                    return (
                                                        <TextField
                                                            error={
                                                                !!(
                                                                    props.errors.subject &&
                                                                    props.touched.subject
                                                                )
                                                            }
                                                            className="profile-pic"
                                                            type="text"
                                                            name='subject'
                                                            value={props.values.subject}
                                                            helperText={!props.errors.subject}
                                                            onChange={props.handleChange}
                                                            onBlur={props.handleBlur}
                                                            margin="normal"
                                                        />
                                                    );
                                                }}
                                            </OnTextEditInput>
                                        </TableCell>
                                    ) : (
                                        <TableCell>{subject || "N/A"}</TableCell>
                                    )}
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        <strong>Type</strong>
                                    </TableCell>
                                    <TableCell>{type || "N/A"}</TableCell>

                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        <strong>Status</strong>
                                    </TableCell>
                                    <TableCell>
                                        <Grid container spacing={4} style={{ alignItems: 'center' }}>
                                            <Grid item>

                                                {status || "N/A"}
                                            </Grid>
                                            <Grid item>

                                                {
                                                    status === 'draft' ?
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={handleSendCampaign}
                                                        >Save Draft</Button>
                                                        : null
                                                }
                                            </Grid>
                                        </Grid>

                                    </TableCell>

                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        <strong>Sender Name</strong>
                                    </TableCell>
                                    <TableCell>{sender?.name || "N/A"}</TableCell>

                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <strong>Sender Email</strong>
                                    </TableCell>
                                    <TableCell>{sender?.email || "N/A"}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        <strong>Recipient lists</strong>
                                    </TableCell>
                                    {["admin", "management"].includes(
                                        currentProps.slug
                                    ) ? (
                                        <TableCell component="th" scope="row">

                                            <Select2
                                                clickable={false}
                                                reactSelect={true}
                                                name="lists"
                                                value={recipientslists}
                                                onSubmit={simpleEdit}
                                                validateIt={Yup.object().shape({
                                                    lists: Yup.array()
                                                        .required("recipient is required")
                                                        .nullable(),
                                                })}
                                                options={contactlistsOption}
                                                data={contctlistsState}
                                                isSearchable={false}
                                                handleScrollDown={handleScolldownContactlists}
                                                delayedSearch={delayedHandleSearchContactlists}
                                                isMulti={true}
                                            />
                                        </TableCell>
                                    ) : (
                                        <TableCell>{recipients?.lists && recipients?.lists[0] || "N/A"}</TableCell>
                                    )}
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                <Grid item xs={12} md={12}>
                    <Typography variant="h3" gutterBottom className={classes.heading}>
                        Statistics
                    </Typography>
                </Grid>
                <Grid item md={4} xs={12}>
                    <TableContainer component={Paper}>
                        <Table aria-label="caption table">
                            <TableBody>

                                <TableRow style={{ fontSize: 18, backgroundColor: '#edeff3' }}>
                                    <TableCell >
                                        <strong >GlobalStats</strong>
                                    </TableCell>
                                    <TableCell></TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        <strong>Unique Click</strong>
                                    </TableCell>
                                    <TableCell>{globalStats?.uniqueClicks}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        <strong>Clickers</strong>
                                    </TableCell>
                                    <TableCell>{globalStats?.clickers}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        <strong>Complaints</strong>
                                    </TableCell>
                                    <TableCell>{globalStats?.complaints}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        <strong>Delivered</strong>
                                    </TableCell>
                                    <TableCell>{globalStats?.delivered}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        <strong>Sent</strong>
                                    </TableCell>
                                    <TableCell>{globalStats?.sent}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        <strong>SoftBounces</strong>
                                    </TableCell>
                                    <TableCell>{globalStats?.softBounces}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        <strong>hardBounces</strong>
                                    </TableCell>
                                    <TableCell>{globalStats?.hardBounces}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        <strong>UniqueViews</strong>
                                    </TableCell>
                                    <TableCell>{globalStats?.uniqueViews}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        <strong>Unsubscriptions</strong>
                                    </TableCell>
                                    <TableCell>{globalStats?.unsubscriptions}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        <strong>Viewed</strong>
                                    </TableCell>
                                    <TableCell>{globalStats?.viewed}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                {statistics?.campaignStats?.length > 0 ? <Grid item md={4} xs={12}>
                    <TableContainer component={Paper}>
                        <Table aria-label="caption table">
                            <TableBody>
                                {
                                    statistics?.campaignStats?.map((e, ind) => (MakeCard(`campaignStats-${ind}`, e, 18)))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                    : null
                }
                {statistics?.statsByDomain && Object.keys(statistics?.statsByDomain).length > 0 ?
                    <Grid item md={4} xs={12}>
                        <TableContainer component={Paper}>
                            <Table aria-label="caption table">
                                <TableBody>
                                    {
                                        MakeCard(`statsByDomain`, statistics?.statsByDomain, 18)
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    : null
                }

                {statistics?.statsByDevice && Object.keys(statistics?.statsByDevice).length > 0 ?
                    <Grid item md={4} xs={12}>
                        <TableContainer component={Paper}>
                            <Table aria-label="caption table">
                                <TableBody>
                                    {
                                        MakeCard(`statsByDevice`, statistics?.statsByDevice, 18)
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    : null
                }

                {statistics?.statsByBrowser && Object.keys(statistics?.statsByBrowser).length > 0 ?
                    <Grid item md={4} xs={12}>
                        <TableContainer component={Paper}>
                            <Table aria-label="caption table">
                                <TableBody>
                                    {
                                        MakeCard(`statsByBrowser`, statistics?.statsByBrowser, 18)
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid> : null
                }

                <Grid item md={4} xs={12}>
                    <TableContainer component={Paper}>
                        <Table aria-label="caption table">
                            <TableBody>
                                <TableRow style={{ fontSize: 18, backgroundColor: '#edeff3' }}>
                                    <TableCell>
                                        <strong >Other</strong>
                                    </TableCell>
                                    <TableCell></TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        <strong>mirrorClick</strong>
                                    </TableCell>
                                    <TableCell>{statistics?.mirrorClick}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        <strong> Remaining</strong>
                                    </TableCell>
                                    <TableCell>{statistics?.remaining}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </>
        </Grid>
    );
}

function MakeCard(keyName: string, data: any, fontSize: any) {

    const style: any = {}

    if (fontSize >= 18) {
        style.backgroundColor = '#edeff3'
    }

    else if (fontSize >= 16) {
        style.backgroundColor = '#f2f4f7';
    }

    if (typeof data === 'object' && data !== null) {
        const arr: any = [

            <TableRow style={{ fontSize: fontSize, ...style }}>
                <TableCell>
                    <strong >{keyName}</strong>
                </TableCell>
                <TableCell></TableCell>
            </TableRow>
        ];

        Object.keys(data).forEach(key => {
            arr.push(
                MakeCard(key, data[key], fontSize - 2)
            )
        })
        return arr;
    }

    else if ((typeof data === 'string' || typeof data === 'number') && data !== null) {
        const a = <TableRow>
            <TableCell>
                <strong>{keyName}</strong>
            </TableCell>
            <TableCell>{data}</TableCell>
        </TableRow>
        return a
    }
    return null
}