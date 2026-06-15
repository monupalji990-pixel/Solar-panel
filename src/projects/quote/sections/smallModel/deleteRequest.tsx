import React, { useState, Fragment } from 'react';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import Switch from '@material-ui/core/Switch';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import OnTextEditInput from '../../../../sharedUtils/sharedComponents/editHelpers2/onTextEditHelper';

export default function DeleteRequest(props) {

    const [isDeleteCheck, setIsDelete] = useState(props.currentQuote.isDelete);
    const { isDelete } = props.currentQuote;

    const sentDeleteRequest = (value, closeEdit, setSubmitting) => {
        const id = props.currentQuote._id;
        props._isLoadingData(true, props.type);
        if (isDeleteCheck) {
            const data = { id }
            props._sendRequest(data, props.type)
        } else {
            const data = {
                quoteId: id,
                isDelete: false
            }
            props._editQuote(data, props.type)
        }
        closeEdit(null);
        setSubmitting(false);
    };

    return (
        <TableRow>
            {['management', 'partner', 'sales_rep', 'Sales Rep'].includes(props.slug) &&
                <Fragment>
                    <TableCell><strong>Delete Request</strong></TableCell>
                    <TableCell component="th" scope="row">
                        <OnTextEditInput
                            name="checkedA"
                            value={isDelete ? 'Delete request sent' : 'Send delete request'}
                            onSubmit={sentDeleteRequest}
                            validateIt={Yup.object().shape({
                                checkedA: Yup.string().required('Required'),
                            })}
                        >
                            {props => {
                                return (
                                    <Switch
                                        checked={isDeleteCheck}
                                        onChange={event => { setIsDelete(event.target.checked) }}
                                        value={props.values.isDelete}
                                        name="checkedA"
                                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                                    />
                                );
                            }}
                        </OnTextEditInput>
                    </TableCell>
                </Fragment>}
        </TableRow>
    );
}