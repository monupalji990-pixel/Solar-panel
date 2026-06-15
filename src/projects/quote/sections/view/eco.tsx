import React, { useState, Suspense } from 'react';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { QuoteStatusNames, RenewalStatusNames } from '../../../../sharedUtils/globalHelper/status'
import DeleteRequest from '../smallModel/deleteRequest';
import { CommonSimple as ViewSimpleCompany } from "../../../company/loadable/CommonSimple";
import { CommonSimple as ViewSimpleConsumer } from '../../../consumer/loadable/CommonSimple';
import SolarView from '../view/eco_service/solar';
import BoilersView from '../view/eco_service/boilers';
import UFIView from '../view/eco_service/ufi';
import CavityWall from '../view/eco_service/cavitywall';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

export default function Eco(props) {

    const [isChecked, setIsChecked] = useState(props.currentQuote?.isActive === 1);
    const [isDeleteCheck, setIsDelete] = useState(props.currentQuote?.isDelete === 1);
    const [isShowCompany, setIsShowCompany] = React.useState(false);
    const [companyData, setCompanyData] = React.useState({});
    const [isShowConsumer, setIsShowConsumer] = React.useState(false);
    const [consumerData, setConsumerData] = React.useState({});
    const [selectedTab, setSelectedTab] = React.useState("");

    const { QuoteID, Company, service, Consumer, Site,
        RenewalID, quoteStatus, Status, } = props.currentQuote;

    let eco: any = {}
    if (service && service.eco) {
        eco = { ...service.eco }
    }

    const viewCompany = (data) => {
        setIsShowCompany(true)
        setCompanyData(data);
    }

    const viewConsumer = (data) => {
        setIsShowConsumer(true)
        setConsumerData(data);
    }

    const tabHandleChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    return (

        <Grid container spacing={3}>
            <Grid item md={12} xs={12}>
                <TableContainer component={Paper}>
                    <Table aria-label="caption table">
                        <TableBody>
                            <TableRow>
                                <TableCell> <strong>{props.type === 'quote' ? 'Quote ID' : 'Renewal ID'}</strong></TableCell>
                                <TableCell component="th" scope="row">{props.type === 'quote' ? QuoteID : RenewalID}</TableCell>
                            </TableRow>

                            {props.isCreatedFrom === undefined && props.currentQuote && props.currentQuote.Company !== undefined &&
                                <TableRow>
                                    <TableCell> <strong>Company Name</strong></TableCell>
                                    <TableCell component="th" scope="row" onClick={() => viewCompany(Company)} onMouseOver={(e) => { (e.target as HTMLElement).style.textDecoration = 'underline' }} onMouseLeave={(e) => { (e.target as HTMLElement).style.textDecoration = 'none' }}>
                                        {Company !== undefined && Company !== undefined && Company ? Company.businessName : ''} </TableCell>
                                </TableRow>
                            }

                            {props.isCreatedFrom === undefined && props.currentQuote && props.currentQuote.Consumer !== undefined &&
                                <TableRow>
                                    <TableCell> <strong>Consumer Name</strong></TableCell>
                                    <TableCell component="th" scope="row" onClick={() => viewConsumer(Consumer)} onMouseOver={(e) => { (e.target as HTMLElement).style.textDecoration = 'underline' }} onMouseLeave={(e) => { (e.target as HTMLElement).style.textDecoration = 'none' }}>{Consumer !== undefined && `${Consumer.firstName} ${Consumer.surName}`}</TableCell>
                                </TableRow>
                            }

                            {props.isCreatedFrom === undefined && props.currentQuote && props.currentQuote.Company !== undefined &&
                                <TableRow>
                                    <TableCell> <strong>Site Name</strong></TableCell>
                                    <TableCell component="th" scope="row">{Site && Site.siteName}</TableCell>
                                </TableRow>
                            }
                            <TableRow>
                                <TableCell> <strong>Status</strong></TableCell>
                                <TableCell component="th" scope="row">{props.type === 'quote' ? QuoteStatusNames[quoteStatus] : RenewalStatusNames[Status]}</TableCell>
                            </TableRow>
                            {props.currentQuote.Company && props.currentQuote.Company.postcode &&
                                <TableRow>
                                    <TableCell> <strong>Postcode</strong></TableCell>
                                    <TableCell component="th" scope="row">{props.currentQuote.Company.postcode}</TableCell>
                                </TableRow>
                            }

                            <Suspense fallback={<></>}><DeleteRequest {...props}></DeleteRequest></Suspense>
                        </TableBody>
                    </Table>
                </TableContainer>

                <h4 style={{ padding: '15px 13px 0 13px' }}>Sub Services</h4>
                <Grid container style={{ margin: '20px 0' }}>
                    <Grid item xs={12} md={12}>
                        <Paper>
                            <Tabs
                                value={selectedTab}
                                onChange={tabHandleChange}
                                aria-label="simple tabs example"
                                textColor="primary"
                                indicatorColor="primary"
                                scrollButtons="auto"
                                variant="scrollable"
                            >
                                {eco.subservice !== null && eco.subservice !== undefined && Object.keys(eco.subservice).length > 0 && Object.keys(eco.subservice).map((item) => (
                                    <Tab label={item} value={item} />
                                ))}
                            </Tabs>
                        </Paper>

                        {selectedTab === "solar" && (
                            <SolarView {...props} />
                        )}

                        {selectedTab === "boilers" && (
                            <BoilersView {...props} />
                        )}

                        {selectedTab === "ufiunderfloor" && (
                            <UFIView {...props} />
                        )}

                        {selectedTab === "cavitywall" && (
                            <CavityWall {...props} />
                        )}
                    </Grid>
                </Grid>
            </Grid>
            {isShowCompany && <ViewSimpleCompany {...props} companyData={companyData} isCloseCompany={() => { setIsShowCompany(false) }}> </ViewSimpleCompany>}
            {isShowConsumer && <ViewSimpleConsumer {...props} consumerData={consumerData} isCloseConsumer={() => { setIsShowConsumer(false) }}> </ViewSimpleConsumer>}
        </Grid >
    );
}
