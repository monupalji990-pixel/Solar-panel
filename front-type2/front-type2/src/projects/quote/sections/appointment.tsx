import React, { useState } from 'react';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import moment from 'moment';
import { AppointmentStatus } from "../../../sharedUtils/globalHelper/status";

export default function AppointmentDetail(props) {

    return (
        <React.Fragment>
            {props.data?.service?.eco?.surveyAppoinment?._id &&
                <TableContainer component={Paper} style={{ marginTop: 20 }}>
                    <Table>
                        <h4 style={{ margin: 15 }}>Survey Appointment</h4>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <strong>Booked By</strong>
                                </TableCell>
                                <TableCell>
                                    {props.data?.service?.eco?.surveyAppoinment?.Booker?.name || 'N/A'}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <strong>Assignee</strong>
                                </TableCell>
                                <TableCell>
                                    {props.data?.service?.eco?.surveyAppoinment?.Assignee?.name || 'N/A'}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <strong>Start Date & Time</strong>
                                </TableCell>
                                <TableCell>
                                    {props.data?.service?.eco?.surveyAppoinment?.startTime ? moment(props.data?.service?.eco?.surveyAppoinment?.startTime).format('MMMM Do YYYY, h:mm:ss a') : 'N/A'}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <strong>End Date & Time</strong>
                                </TableCell>
                                <TableCell>
                                    {props.data?.service?.eco?.surveyAppoinment?.endTime ? moment(props.data?.service?.eco?.surveyAppoinment?.endTime).format('MMMM Do YYYY, h:mm:ss a') : 'N/A'}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <strong>Status</strong>
                                </TableCell>
                                <TableCell>
                                    {AppointmentStatus[props.data?.service?.eco?.surveyAppoinment?.status]}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            }

            {props.data?.service?.eco?.scaffoldingAppoinment?._id &&
                <TableContainer component={Paper} style={{ marginTop: 20 }}>
                    <Table>
                        <h4 style={{ margin: 15 }}>Scaffolding Appointment</h4>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <strong>Booked By</strong>
                                </TableCell>
                                <TableCell>
                                    {props.data?.service?.eco?.scaffoldingAppoinment?.Booker?.name || 'N/A'}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <strong>Assignee</strong>
                                </TableCell>
                                <TableCell>
                                    {props.data?.service?.eco?.scaffoldingAppoinment?.Assignee?.name || 'N/A'}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <strong>Start Date & Time</strong>
                                </TableCell>
                                <TableCell>
                                    {props.data?.service?.eco?.scaffoldingAppoinment?.startTime ? moment(props.data?.service?.eco?.scaffoldingAppoinment?.startTime).format('MMMM Do YYYY, h:mm:ss a') : 'N/A'}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <strong>End Date & Time</strong>
                                </TableCell>
                                <TableCell>
                                    {props.data?.service?.eco?.scaffoldingAppoinment?.endTime ? moment(props.data?.service?.eco?.scaffoldingAppoinment?.endTime).format('MMMM Do YYYY, h:mm:ss a') : 'N/A'}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <strong>Status</strong>
                                </TableCell>
                                <TableCell>
                                    {AppointmentStatus[props.data?.service?.eco?.scaffoldingAppoinment?.status]}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            }

            {props.data?.service?.eco?.installationAppoinment?._id &&
                <TableContainer component={Paper} style={{ marginTop: 20 }}>
                    <Table>
                        <h4 style={{ margin: 15 }}>Installation Appointment</h4>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <strong>Booked By</strong>
                                </TableCell>
                                <TableCell>
                                    {props.data?.service?.eco?.installationAppoinment?.Booker?.name || 'N/A'}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <strong>Assignee</strong>
                                </TableCell>
                                <TableCell>
                                    {props.data?.service?.eco?.installationAppoinment?.Assignee?.name || 'N/A'}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <strong>Start Date & Time</strong>
                                </TableCell>
                                <TableCell>
                                    {props.data?.service?.eco?.installationAppoinment?.startTime ? moment(props.data?.service?.eco?.installationAppoinment?.startTime).format('MMMM Do YYYY, h:mm:ss a') : 'N/A'}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <strong>End Date & Time</strong>
                                </TableCell>
                                <TableCell>
                                    {props.data?.service?.eco?.installationAppoinment?.endTime ? moment(props.data?.service?.eco?.installationAppoinment?.endTime).format('MMMM Do YYYY, h:mm:ss a') : 'N/A'}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <strong>Status</strong>
                                </TableCell>
                                <TableCell>
                                    {AppointmentStatus[props.data?.service?.eco?.installationAppoinment?.status]}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            }

            {props.data?.service?.eco?.insulationAppoinment?._id &&
                <TableContainer component={Paper} style={{ marginTop: 20 }}>
                    <Table>
                        <h4 style={{ margin: 15 }}>Insulation Appointment</h4>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <strong>Booked By</strong>
                                </TableCell>
                                <TableCell>
                                    {props.data?.service?.eco?.insulationAppoinment?.Booker?.name || 'N/A'}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <strong>Assignee</strong>
                                </TableCell>
                                <TableCell>
                                    {props.data?.service?.eco?.insulationAppoinment?.Assignee?.name || 'N/A'}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <strong>Start Date & Time</strong>
                                </TableCell>
                                <TableCell>
                                    {props.data?.service?.eco?.insulationAppoinment?.startTime ? moment(props.data?.service?.eco?.insulationAppoinment?.startTime).format('MMMM Do YYYY, h:mm:ss a') : 'N/A'}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <strong>End Date & Time</strong>
                                </TableCell>
                                <TableCell>
                                    {props.data?.service?.eco?.insulationAppoinment?.endTime ? moment(props.data?.service?.eco?.insulationAppoinment?.endTime).format('MMMM Do YYYY, h:mm:ss a') : 'N/A'}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <strong>Status</strong>
                                </TableCell>
                                <TableCell>
                                    {AppointmentStatus[props.data?.service?.eco?.insulationAppoinment?.status]}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            }

            {props.data?.service?.eco?.ventilationAppoinment?._id &&
                <TableContainer component={Paper} style={{ marginTop: 20 }}>
                    <Table>
                        <h4 style={{ margin: 15 }}>Ventilation Appointment</h4>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <strong>Booked By</strong>
                                </TableCell>
                                <TableCell>
                                    {props.data?.service?.eco?.ventilationAppoinment?.Booker?.name || 'N/A'}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <strong>Assignee</strong>
                                </TableCell>
                                <TableCell>
                                    {props.data?.service?.eco?.ventilationAppoinment?.Assignee?.name || 'N/A'}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <strong>Start Date & Time</strong>
                                </TableCell>
                                <TableCell>
                                    {props.data?.service?.eco?.ventilationAppoinment?.startTime ? moment(props.data?.service?.eco?.ventilationAppoinment?.startTime).format('MMMM Do YYYY, h:mm:ss a') : 'N/A'}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <strong>End Date & Time</strong>
                                </TableCell>
                                <TableCell>
                                    {props.data?.service?.eco?.ventilationAppoinment?.endTime ? moment(props.data?.service?.eco?.ventilationAppoinment?.endTime).format('MMMM Do YYYY, h:mm:ss a') : 'N/A'}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <strong>Status</strong>
                                </TableCell>
                                <TableCell>
                                    {AppointmentStatus[props.data?.service?.eco?.ventilationAppoinment?.status]}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            }

            {props.data?.service?.eco?.heatingAppoinment?._id &&
                <TableContainer component={Paper} style={{ marginTop: 20 }}>
                    <Table>
                        <h4 style={{ margin: 15 }}>Heating Appointment</h4>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <strong>Booked By</strong>
                                </TableCell>
                                <TableCell>
                                    {props.data?.service?.eco?.heatingAppoinment?.Booker?.name || 'N/A'}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <strong>Assignee</strong>
                                </TableCell>
                                <TableCell>
                                    {props.data?.service?.eco?.heatingAppoinment?.Assignee?.name || 'N/A'}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <strong>Start Date & Time</strong>
                                </TableCell>
                                <TableCell>
                                    {props.data?.service?.eco?.heatingAppoinment?.startTime ? moment(props.data?.service?.eco?.heatingAppoinment?.startTime).format('MMMM Do YYYY, h:mm:ss a') : 'N/A'}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <strong>End Date & Time</strong>
                                </TableCell>
                                <TableCell>
                                    {props.data?.service?.eco?.heatingAppoinment?.endTime ? moment(props.data?.service?.eco?.heatingAppoinment?.endTime).format('MMMM Do YYYY, h:mm:ss a') : 'N/A'}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <strong>Status</strong>
                                </TableCell>
                                <TableCell>
                                    {AppointmentStatus[props.data?.service?.eco?.heatingAppoinment?.status]}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            }

            {props.data?.service?.eco?.solarRenewablesAppoinment?._id &&
                <TableContainer component={Paper} style={{ marginTop: 20 }}>
                    <Table>
                        <h4 style={{ margin: 15 }}>Solar Rnewables Appointment</h4>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <strong>Booked By</strong>
                                </TableCell>
                                <TableCell>
                                    {props.data?.service?.eco?.solarRenewablesAppoinment?.Booker?.name || 'N/A'}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <strong>Assignee</strong>
                                </TableCell>
                                <TableCell>
                                    {props.data?.service?.eco?.solarRenewablesAppoinment?.Assignee?.name || 'N/A'}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <strong>Start Date & Time</strong>
                                </TableCell>
                                <TableCell>
                                    {props.data?.service?.eco?.solarRenewablesAppoinment?.startTime ? moment(props.data?.service?.eco?.solarRenewablesAppoinment?.startTime).format('MMMM Do YYYY, h:mm:ss a') : 'N/A'}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <strong>End Date & Time</strong>
                                </TableCell>
                                <TableCell>
                                    {props.data?.service?.eco?.solarRenewablesAppoinment?.endTime ? moment(props.data?.service?.eco?.solarRenewablesAppoinment?.endTime).format('MMMM Do YYYY, h:mm:ss a') : 'N/A'}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <strong>Status</strong>
                                </TableCell>
                                <TableCell>
                                    {AppointmentStatus[props.data?.service?.eco?.solarRenewablesAppoinment?.status]}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            }
        </React.Fragment>
    )
}