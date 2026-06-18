import { FormControlLabel, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@material-ui/core';
import React from 'react'
import Switch from '@material-ui/core/Switch';
import { AM } from 'sharedUtils/globalHelper/constantValues';
import { selectLoggedUser } from 'projects/authentication/redux/auth';
import { useSelector } from 'react-redux';

const CommissionCostApp = (props) => {

    const data = props.singleLead?.digitalDashboard
    const userData = useSelector(selectLoggedUser)

    const [state, setState] = React.useState({});

    const checkLeadGenerator = props.singleLead?.LeadGenerator?._id === userData?._id || AM.includes(props.slug)
    const AMCheck = AM.includes(props.slug)
    const checkLeadGeneratorSwitch = props.singleLead?.LeadGenerator?._id === userData?._id

    const handleChangeStatus = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
        const obj: any = {}
        obj.leadId = props.singleLead._id;
        obj.serviceType = props.singleLead.serviceType
        obj.digitalDashboard = {
            ...props.singleLead?.digitalDashboard,
            [event.target.name]: event.target.checked,
        }
        if (event.target.name) {
            props._leadUpdate({
                data: obj
            });
        }
    }

    return (
        <Grid container style={{ marginTop: 20 }}>
            <Grid item xs={12} md={12}>
                <TableContainer component={Paper}>
                    <Table aria-label="caption table" size="small">
                        <TableBody>
                            {AMCheck &&
                                <TableRow>
                                    <TableCell>
                                        <strong>Roofing Material Cost</strong>
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {data?.roofingMaterialCost || 0}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <FormControlLabel
                                            control={<Switch defaultChecked={data?.isPaidRoofingMaterialCost} disabled={checkLeadGeneratorSwitch} onChange={handleChangeStatus} name="isPaidRoofingMaterialCost" />}
                                            label={data?.isPaidRoofingMaterialCost ? "Paid" : "UnPaid"}
                                        />
                                    </TableCell>
                                </TableRow>
                            }
                            {AMCheck &&
                                <TableRow>
                                    <TableCell>
                                        <strong>Roofing Labour Cost</strong>
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {data?.roofingLabourCost || 0}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <FormControlLabel
                                            control={<Switch defaultChecked={data?.isPaidRoofingLaboutCost} disabled={checkLeadGeneratorSwitch} onChange={handleChangeStatus} name="isPaidRoofingLaboutCost" />}
                                            label={data?.isPaidRoofingLaboutCost ? "Paid" : "UnPaid"}
                                        />
                                    </TableCell>
                                </TableRow>
                            }
                            {AMCheck &&
                                <TableRow>
                                    <TableCell>
                                        <strong>Plumbing Material Cost</strong>
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {data?.plumbingMaterialCost || 0}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <FormControlLabel
                                            control={<Switch defaultChecked={data?.isPaidPlumbingMaterialCost} disabled={checkLeadGeneratorSwitch} onChange={handleChangeStatus} name="isPaidPlumbingMaterialCost" />}
                                            label={data?.isPaidPlumbingMaterialCost ? "Paid" : "UnPaid"}
                                        />
                                    </TableCell>
                                </TableRow>
                            }
                            {AMCheck &&
                                <TableRow>
                                    <TableCell>
                                        <strong>Plumbing Labour Cost</strong>
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {data?.plumbingLabourCost || 0}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <FormControlLabel
                                            control={<Switch defaultChecked={data?.isPaidPlumbingLabourCost} disabled={checkLeadGeneratorSwitch} onChange={handleChangeStatus} name="isPaidPlumbingLabourCost" />}
                                            label={data?.isPaidPlumbingLabourCost ? "Paid" : "UnPaid"}
                                        />
                                    </TableCell>
                                </TableRow>
                            }
                            {AMCheck &&
                                <TableRow>
                                    <TableCell>
                                        <strong>Scaffolding Cost</strong>
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {data?.scaffoldingCost || 0}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <FormControlLabel
                                            control={<Switch defaultChecked={data?.isPaidScaffoldingCost} disabled={checkLeadGeneratorSwitch} onChange={handleChangeStatus} name="isPaidScaffoldingCost" />}
                                            label={data?.isPaidScaffoldingCost ? "Paid" : "UnPaid"}
                                        />
                                    </TableCell>
                                </TableRow>
                            }
                            {checkLeadGenerator &&
                                <TableRow>
                                    <TableCell>
                                        <strong>Lead Generator Cost</strong>
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {data?.leadGeneratorCost || 0}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <FormControlLabel
                                            control={<Switch defaultChecked={data?.isPaidLeadGeneratorCost} disabled={checkLeadGeneratorSwitch} onChange={handleChangeStatus} name="isPaidLeadGeneratorCost" />}
                                            label={data?.isPaidLeadGeneratorCost ? "Paid" : "UnPaid"}
                                        />
                                    </TableCell>
                                </TableRow>
                            }
                            {AMCheck &&
                                <TableRow>
                                    <TableCell>
                                        <strong>Surveyor Cost</strong>
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {data?.surveyorCost || 0}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <FormControlLabel
                                            control={<Switch defaultChecked={data?.isPaidSurveyorCost} disabled={checkLeadGeneratorSwitch} onChange={handleChangeStatus} name="isPaidSurveyorCost" />}
                                            label={data?.isPaidSurveyorCost ? "Paid" : "UnPaid"}
                                        />
                                    </TableCell>
                                </TableRow>
                            }
                            {AMCheck &&
                                <TableRow>
                                    <TableCell>
                                        <strong>RC Cost</strong>
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {data?.RCCost || 0}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <FormControlLabel
                                            control={<Switch defaultChecked={data?.isPaidRCCost} disabled={checkLeadGeneratorSwitch} onChange={handleChangeStatus} name="isPaidRCCost" />}
                                            label={data?.isPaidRCCost ? "Paid" : "UnPaid"}
                                        />
                                    </TableCell>
                                </TableRow>
                            }
                            {AMCheck &&
                                <TableRow>
                                    <TableCell>
                                        <strong>ADDITIONAL COST</strong>
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {data?.additionalCost || 0}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <FormControlLabel
                                            control={<Switch defaultChecked={data?.isPaidAdditionalCost} disabled={checkLeadGeneratorSwitch} onChange={handleChangeStatus} name="isPaidAdditionalCost" />}
                                            label={data?.isPaidAdditionalCost ? "Paid" : "UnPaid"}
                                        />
                                    </TableCell>
                                </TableRow>
                            }
                            {AMCheck && data?.measuresBeingDone?.length > 0 ?
                                data?.measuresBeingDone.map((e, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <strong>Material Cost of {e.value}</strong>
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {data[`materialCost_${e.value.replace(' ', '')}`]}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <FormControlLabel
                                                control={<Switch defaultChecked={data[`isPaidMaterial${e.value}`]} disabled={checkLeadGeneratorSwitch} onChange={handleChangeStatus} name={`isPaidMaterial${e.value}`} />}
                                                label={data[`isPaidMaterial${e.value}`] ? "Paid" : "UnPaid"}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                                : ""
                            }

                            {AMCheck && data?.measuresBeingDone?.length > 0 ?
                                data?.measuresBeingDone.map((e, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <strong>Labour Cost of {e.value}</strong>
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {data[`labourCost_${e.value.replace(' ', '')}`]}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <FormControlLabel
                                                control={<Switch defaultChecked={data[`isPaidLabour${e.value}`]} disabled={checkLeadGeneratorSwitch} onChange={handleChangeStatus} name={`isPaidLabour${e.value}`} />}
                                                label={data[`isPaidLabour${e.value}`] ? "Paid" : "UnPaid"}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                                : ""
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    )

}

export default CommissionCostApp;