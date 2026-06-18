import React, { Suspense } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Common as UserTable } from '../../users/loadable/Common';
import { Common as CompanyTable } from '../../company/loadable/Common';
import { Common as ConsumerTable } from '../../consumer/loadable/Common';
import { Common as LeadTable } from '../../lead/loadable/Common';
import { Common as QuoteTable } from '../../quote/loadable/Common';
import { Common as RenewalTable } from '../../renewal/loadable/Common';
import { Common as TaskTable } from '../../task/loadable/Common';

export default function DeleteTables(props) {
  // All delete tables showing here under the admin dashboard
  const [selectedTab, setSelectedTab] = React.useState('company');

  const tabHandleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
        <Paper>
          <Tabs
            variant="scrollable"
            value={selectedTab}
            scrollButtons="auto"
            onChange={tabHandleChange}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Company" value="company" />
            <Tab label="Consumer" value="consumer" />
            <Tab label="Lead" value="lead" />
            <Tab label="Quote" value="quote" />
            <Tab label="Renewal" value="renewal" />
            <Tab label="Task" value="task" />
          </Tabs>
        </Paper>
      </Grid>

      {selectedTab === 'user' && (
        <Suspense fallback={<>Loading...</>}>
          <UserTable {...props} />
        </Suspense>
      )}
      {selectedTab === 'company' && (
        <Suspense fallback={<>Loading...</>}>
          <CompanyTable companyType="normal" {...props} />
        </Suspense>
      )}
      {selectedTab === 'consumer' && (
        <Suspense fallback={<>Loading...</>}>
          <ConsumerTable {...props} />
        </Suspense>
      )}
      {selectedTab === 'lead' && (
        <Suspense fallback={<>Loading...</>}>
          <LeadTable {...props} />
        </Suspense>
      )}
      {selectedTab === 'quote' && (
        <Suspense fallback={<>Loading...</>}>
          <QuoteTable {...props} type="quote" />
        </Suspense>
      )}
      {selectedTab === 'renewal' && (
        <Suspense fallback={<>Loading...</>}>
          <RenewalTable {...props} type="renewal" />
        </Suspense>
      )}
      {selectedTab === 'task' && (
        <Suspense fallback={<>Loading...</>}>
          <TaskTable {...props} />
        </Suspense>
      )}
    </Grid>
  );
}
