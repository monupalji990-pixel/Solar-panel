import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { renewalAction, selectRenewalState } from "../Redux/renewal";
import { selectCompanyState } from "projects/company/redux/company";
import { selectAssigneeState } from "projects/assignee/redux/assignee";
import { Editable } from '../components/updateAssigneeForm'

const useStyles = makeStyles((theme) => ({
    Spacing: {
        marginTop: "10px",
        marginBottom: "10px",
    },
    TypoSpace: {
        padding: "10px",
    },
}));

export default function Assignee(props) {
    const classes = useStyles();
    const [selectedAssigneeId, setSelectedAssigneeId] = useState("");
    const renewalState = useSelector(selectRenewalState);
    const companyState = useSelector(selectCompanyState);
    const monthsOptions = [{ value: 6, label: 6 }, { value: 12, label: 12 }]
    const { Assignee } = renewalState.currentQuote;

    let AssigneeName = Assignee ? Assignee.name : "";

    const currentCompany = companyState.currentCompany;
    const assigneeState = useSelector(selectAssigneeState);

    const [al, setAl] = useState<any>([])
    const assignee = assigneeState.assigneeListForDropdown;

    const [AssigneeOptions, setAssigneeOptions] = useState([]);

    useEffect(() => {
        let AssigneeOptions1 = [];

        if (renewalState.currentQuote?.Company?.Assignee)
            AssigneeOptions1 = renewalState.currentQuote?.Company?.Assignee;
        if (renewalState.currentQuote?.Consumer?.Assignee)
            AssigneeOptions1 = renewalState.currentQuote?.Consumer?.Assignee;
        setAssigneeOptions(AssigneeOptions1)
    }, [renewalState.currentQuote])

    const [assigneeList, setAssigneeList] = useState([]);

    useEffect(() => {
        let tempArr = []
        AssigneeOptions.filter((s) => {
            if (s.isActive !== 0)
                tempArr.push({
                    label: s.name,
                    value: s.name,
                    id: s._id
                })
        })
        setAssigneeList(tempArr)
    }, [AssigneeOptions])

    const simpleEdit = (value, closeEdit, setSubmitting,) => {
        const updateAssignee = {
            RenewalID: renewalState.currentQuote._id,
            Assignee: value.assignee?.id,
            beforemonths: value.months?.value
        };

        props._isLoadingData(true);
        _updateAssignee(updateAssignee);
        if (!renewalState.isLoadingData) {
            closeEdit(null);
        }
        setSubmitting(false);
    };

    const dispatch = useDispatch()
    const _updateAssignee = (payload) =>
        dispatch(renewalAction.updateAssignee(payload));

    return (
        <Grid container spacing={3} className={classes.Spacing}>
            <Grid item xs={12} md={12}>
                <Paper>
                    <Typography variant="h6" className={classes.TypoSpace} gutterBottom>
                        Assignee
                    </Typography>
                    <Editable data={{ Assignee: Assignee, beforemonths: renewalState.currentQuote?.beforemonths }} assigneeList={assigneeList} onSubmit={simpleEdit} monthsOptions={monthsOptions} />
                </Paper>
            </Grid>
        </Grid>
    );
}