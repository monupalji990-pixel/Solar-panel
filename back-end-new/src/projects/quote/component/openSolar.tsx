import { Grid, Paper, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import axios from 'axios';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import DescriptionIcon from '@material-ui/icons/Description';
import GetAppIcon from '@material-ui/icons/GetApp';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        maxWidth: 752,
    },
    demo: {
        backgroundColor: theme.palette.background.paper,
    },
    title: {
        margin: theme.spacing(4, 0, 2),
    },
}));

export default function openSolarApp(props) {

    const classes = useStyles();
    const [selectedTab, setSelectedTab] = useState('integration');
    const [loading, setLoading] = useState(false);
    const [projectData, setProjectData] = useState(null);

    const tabHandleChange = (event, value) => {
        setSelectedTab(value);
    }

    let baseURL;
    if (process.env.NODE_ENV === "development") {
        baseURL = "http://localhost:8087/api/";
    } else {
        baseURL = "/api/";
    }

    // console.log("OpenSolarProjectId", props.currentQuote.OpenSolarProjectId);
    // console.log("OpenSolarProjectUrl", props.currentQuote.OpenSolarProjectUrl);

    useEffect(() => {
        setLoading(true);
        const fetchProjectDetails = async () => {
            axios({
                method: 'POST',
                url: `${baseURL}quote/data-from-opensolar`,
                withCredentials: true,
                data: {
                    url: props.currentQuote.OpenSolarProjectUrl,
                },
            }).then((response) => {
                setLoading(false);
                setProjectData(response.data.data)
            }).catch((resp) => {
                setLoading(false);
                console.log("error-----", resp);
            });
        }

        fetchProjectDetails()
    }, [])

    const downloadDocument = (url) => {
        window.open(url);
    }

    return (
        <Grid container>
            <Grid item md={12} xs={12}>
                <Paper>
                    <Tabs
                        value={selectedTab}
                        onChange={tabHandleChange}
                        aria-label="simple tabs example"
                        textColor="primary"
                        indicatorColor="primary"
                    >
                        <Tab label="OpenSolar Integration" value="integration" />
                        <Tab label="OpenSolar Docs" value="docs" />
                    </Tabs>
                </Paper>

                {selectedTab === 'integration' && (
                    <iframe
                        src={`https://app.opensolar.com/#/projects/${props.currentQuote.OpenSolarProjectId}/info`}
                        width={'100%'}
                        height={'650px'}
                        allowFullScreen={true}
                    >
                    </iframe>
                )}

                {selectedTab === 'docs' && (
                    <Grid container spacing={2} justify='flex-start'>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" className={classes.title}>
                                Document Section
                            </Typography>
                            <div className={classes.demo}>
                                <List>
                                    {projectData?.private_files_data.length > 0 && projectData?.private_files_data.map((e, index) => (
                                        <Paper style={{ marginBottom: 15 }}>
                                            <ListItem key={index}>
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <DescriptionIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={e.title}
                                                    secondary={new Date(e.modified_date).toLocaleString()}
                                                />
                                                <ListItemSecondaryAction>
                                                    <IconButton edge="end" aria-label="download" onClick={() => downloadDocument(e.file_contents)}>
                                                        <GetAppIcon />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        </Paper>
                                    ))}
                                </List>
                            </div>
                        </Grid>
                    </Grid>
                )}
            </Grid>
        </Grid>
    )

}