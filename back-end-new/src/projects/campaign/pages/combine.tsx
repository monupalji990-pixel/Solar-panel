import React from 'react';
import { ManageCampaign } from '../loadable/manageCampaign';
import { Common } from '../../sendinblue contacts/loadable/Common'
import { Grid, Paper, Tabs, Tab } from '@material-ui/core';

export function Combine(props) {
    const [selectedTab, setSelectedTab] = React.useState("campaign");

    const tabHandleChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                    <Paper>
                        <Tabs
                            value={selectedTab}
                            onChange={tabHandleChange}
                            aria-label="simple tabs example"
                            textColor="primary"
                            variant="scrollable"
                            indicatorColor="primary"
                        >
                            <Tab label="Campaign" value="campaign" />
                            <Tab label="Contacts" value="contacts" />
                            
                        </Tabs>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={12}>
                    {
                        selectedTab === 'campaign' ?
                            <ManageCampaign {...props} /> : null
                    }
                    {
                        selectedTab === 'contacts' ?
                            <Common {...props} /> : null
                    }
                </Grid>
            </Grid>
        </>
    )
}