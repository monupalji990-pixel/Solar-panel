import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import AssignmentIcon from '@material-ui/icons/Assignment';

class DueTaskPopup extends React.Component <any, any>{
    constructor(props) {
        super(props);
        this.state= {
            open: true
        }
    }

    componentDidMount() {
        const { isShowModel}  = this.props;
        this.setState({ open: isShowModel })
    }

    onClose() {
        this.setState({ open: false })
    }

    ViewTask(id) {
        const { ViewDueTasks } = this.props;
        ViewDueTasks(id)
    }

    Cancel() {
        this.setState({ open: false })
    }

    render() {
        const { open } = this.state;
        const { dueTask } = this.props;
        return (
            <Grid container spacing={3}>
                <Dialog
                    open={open}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent style={{ textAlign: "center", margin: 0, padding: '3rem 0' }}>
                        <Grid container spacing={3} style={{ textAlign: "center", margin: 0, width: '100%' }}>

                            <Avatar className="DueTaskDialogStyle">
                                <AssignmentIcon />
                            </Avatar>
                            <Typography variant="h6" style={{ textAlign: "center", width: '100%' }}>You have due task today</Typography>
                            <Grid item xs={12} md={12}>
                                {dueTask && dueTask.map(d => {
                                    return <Button style={{ marginRight: '1rem', marginBottom:'1rem' }} onClick={() => this.ViewTask(d._id)} variant="contained" color="primary">{d.Title}</Button>
                                })}
                            </Grid>
                        </Grid>
                        <Button onClick={() => this.Cancel()} variant="outlined" color="primary">Cancel</Button>
                    </DialogContent>
                </Dialog>
            </Grid>
        );
    }
}

export default DueTaskPopup;
