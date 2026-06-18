import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import { selectPriceCommission } from "../redux/price_commission";
import { useSelector } from "react-redux";

const useStyles = makeStyles({
    root: {
        width: 300
    }
});

export default function RangeSlider(props) {

    const priceState = useSelector(selectPriceCommission);
    const classes = useStyles();
    const [value, setValue] = React.useState(props.range);

    useEffect(() => {
        if (priceState.isStatus) {
            setValue(0.1);
        }
    }, [priceState.isStatus])

    useEffect(() => {
        if (props.upliftValue) {
            const x = 'globalUplift'
            setValue(props.upliftValue);
            props.setrange(props.upliftValue, props?.data?._id, x);
        }

    }, [props.upliftValue])


    const handleRangeValue = (e, newValue) => {
        setValue(newValue);
        props.setrange(newValue, props?.data?._id);
    }

    const commission = () => {
        const comi = ((props?.priceState?.aq * value * props?.data?.duration) / 100);
        return comi.toFixed(5);
    }

    return (
        <div className={classes.root}>
            <Typography variant="subtitle1">
                {value.toFixed(5)}p
            </Typography>
            <Slider
                style={{ width: '100%' }}
                value={value}
                onChange={handleRangeValue}
                valueLabelDisplay="off"
                aria-labelledby="range-slider"
                step={0.1}
                min={0.1}
                max={1.5}
            />
            <Typography variant="subtitle1">
                £{commission()}
            </Typography>
        </div>
    );
}
