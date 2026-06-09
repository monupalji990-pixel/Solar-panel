import React, { useState } from 'react';
import Grid from "@material-ui/core/Grid";
import CircularProgress from '@material-ui/core/CircularProgress';
import SyncIcon from '@material-ui/icons/Sync';
import Button from '@material-ui/core/Button';
import Select from 'react-select';
import { QuoteServicesForDropdown, SubServiceOptions } from 'sharedUtils/globalHelper/constantValues';
import { useDispatch } from 'react-redux';
import { quoteAction } from 'projects/quote/redux/quote';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

export default function QuoteBoardHeader(props) {

    const dispatch = useDispatch();
    const [selectedService, setSelectedService]: any = useState(null);
    const [selectedSubService, setSelectedSubService]: any = useState(null);

    const customStyles = {
        control: styles => ({ ...styles, color: '#000000', }),
        placeholder: styles => ({ ...styles, color: '#000000', }),
        singleValue: (styles) => ({ ...styles, color: '#000000', }),
        input: styles => ({ ...styles, color: '#000000', }),
    }

    const handleChangeService = (options) => {
        setSelectedService(options)
        props.setSelectedServiceOpt(options.value)
        const filterObject: any = {}
        if (options.value) filterObject.ServicesArray = [options.value]
        dispatch(quoteAction.LoaderStart(false));
        dispatch(quoteAction.FilterData(filterObject));
    }

    const handleChangeSubService = (options) => {
        setSelectedSubService(options)
        props.setSelectedSubServiceOpt(options.value)
        const filterObject: any = {}
        if (options.value) filterObject.SubServicesArray = [options.value]
        dispatch(quoteAction.LoaderStart(false));
        dispatch(quoteAction.FilterData(filterObject));
    }

    const refreshData = () => {
        const h: any = {};
        h.limit = 100;
        dispatch(quoteAction.LoaderStart(false));
        dispatch(quoteAction.BasicActions({ quoteCount: -1 }));
        dispatch(quoteAction.ChangeLimit(h));
    }

    const backToQuote = () => {
        window.location.reload()
    }

    return (
        <div className="task_board_header">
            <Grid container spacing={3} style={{ alignItems: 'center' }}>
                <Grid item>
                    <span className="task_board_title">Quote Board</span>
                </Grid>

                <Grid item md={2} sm={12} xs={12}>
                    <Select
                        id="service"
                        styles={customStyles}
                        className="WidhtFull100"
                        placeholder="Select Service"
                        value={selectedService}
                        margin="normal"
                        aria-describedby="service-number-error"
                        onChange={handleChangeService}
                        name="service"
                        isClearable={true}
                        options={QuoteServicesForDropdown}
                        classNamePrefix="select"
                    />
                </Grid>

                {selectedService?.value === "Eco" &&
                    <Grid item md={2} sm={12} xs={12}>
                        <Select
                            id="subservice"
                            styles={customStyles}
                            className="WidhtFull100"
                            placeholder="Select Sub Service"
                            value={selectedSubService}
                            margin="normal"
                            aria-describedby="service-number-error"
                            onChange={handleChangeSubService}
                            name="subservice"
                            isClearable={true}
                            options={SubServiceOptions}
                            classNamePrefix="select"
                        />
                    </Grid>
                }

                <Grid item style={{ marginLeft: 'auto' }}>
                    <Button color="primary" style={{ minWidth: 'auto' }} onClick={backToQuote}>
                        <ArrowBackIcon />
                    </Button>
                </Grid>

                <Grid item>
                    <Button color="primary" style={{ minWidth: 'auto' }} onClick={refreshData}>
                        <SyncIcon />
                    </Button>
                </Grid>

                {!props.loader &&
                    <Grid item>
                        <CircularProgress />
                    </Grid>
                }
            </Grid>
        </div>
    )
}