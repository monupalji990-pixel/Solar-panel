import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import makeStyles from '@material-ui/core/styles/makeStyles';
import API from '../redux/model/consumer'
import CircularProgress from "@material-ui/core/CircularProgress";
import { Typography, Tooltip, Avatar } from '@material-ui/core';
import { helperMethods } from 'sharedUtils/globalHelper/helperMethod';
import InfiniteScroll from 'react-infinite-scroll-component';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(1),
    },
    comment_pic: {
        margin: 'auto',
        marginRight: 'inherit',
        width: '30px',
        height: '30px',
        marginLeft: 0
    },
    borderLeft: {
        borderLeft: '2px solid'
    },
    SpacingRight: {
        marginRight: '10px'
    },
    SpacingLeft: {
        marginLeft: '10px'
    },
    Spacing: {
        paddingTop: '10px',
    }
}));

export default function addNotes(props) {

    const [startLoader, setStartLoader] = useState(false);
    const [commentList, setCommentList] = useState([]);
    const [hasMore, setHasMore] = useState(false)
    const [commentLoading, setIsCommentLoading] = useState(false);

    const classes = useStyles();

    useEffect(() => {
        const getTaskComments = async () => {
            setStartLoader(true);
            let obj: any = {}
            obj.skip = 0;
            obj.limit = 10;
            obj.Consumer = props.consumer?._id
            let data: any = await API.consumerTaskNotes(obj);
            if (data?.success) {
                setCommentList(data.data)
                setHasMore(data.isNext);
            }
            else {
                setCommentList([])
                setHasMore(false);
            }
            setStartLoader(false);
        }

        getTaskComments()
    }, []);

    const fetchMoreData = () => {

        setTimeout(async () => {
            try {
                setIsCommentLoading(true);
                let obj: any = {}
                obj.skip = commentList?.length;
                obj.limit = 10;
                obj.Consumer = props.consumer?._id
                let data: any = await API.consumerTaskNotes(obj);
                if (data?.success) {
                    setCommentList([...commentList, ...data.data]);
                    setHasMore(data.isNext);
                    setIsCommentLoading(false);
                } else {
                    setCommentList([])
                    setIsCommentLoading(false);
                }
            } catch (error) {
                setHasMore(false);
                setCommentList([])
                setIsCommentLoading(false);
            }
        }, 1500);
    }

    if (startLoader) {
        return (
            <Grid container direction="row" justify="center" alignItems="center" style={{ marginTop: 20 }}>
                <CircularProgress />
            </Grid>
        );
    }

    return (
        <Grid style={{ marginTop: 20 }}>
            <InfiniteScroll
                dataLength={commentList?.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={<CircularProgress />}
                height={600}
            >
                {commentList && commentList.map((x) => (
                    <Grid item md={12} sm={12} direction="row" justify="flex-end" style={{ marginBottom: 10 }}>
                        <Card variant="outlined">
                            <CardContent>
                                <Grid container spacing={1} style={{ justifyContent: 'space-between' }}>
                                    <Grid item>
                                        <Typography variant="subtitle2" gutterBottom>
                                            <strong>Added on</strong> <span>{helperMethods.ConvertDateAndTime(x.Comments?.timestamps)}</span>
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        {x.Comments?.CommentedBy &&
                                            <Tooltip title={x.Comments?.CommentedBy[0] ? `${x.Comments?.CommentedBy[0].name}` : ''}>
                                                <Avatar className={classes.comment_pic} src={x.Comments?.CommentedBy[0] ? `${x.Comments?.CommentedBy[0].avatar}` : ''} >{x.Comments?.CommentedBy[0] ? x.Comments?.CommentedBy[0].name.charAt(0).toUpperCase() : ''}</Avatar>
                                            </Tooltip>
                                        }
                                    </Grid>
                                </Grid>
                                <pre style={{ marginTop: 10 }}>
                                    {x.Comments?.Description}
                                </pre>
                                <h4 style={{ marginTop: 10 }}>
                                    {x.Comments?.History}
                                </h4>

                                <Grid container spacing={1} style={{ justifyContent: 'space-between', marginTop: 10 }}>
                                    <Grid item>
                                        <Tooltip title="Task Title">
                                            <span>{x?.Title}</span>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item>
                                        <Tooltip title="Task Date">
                                            <span>{helperMethods.ConvertDateAndTime(x.Time)}</span>
                                        </Tooltip>
                                    </Grid>
                                </Grid>

                                <Grid container spacing={1} style={{ justifyContent: 'space-between' }}>
                                    <Grid item style={{ marginTop: 10 }}>
                                        <Tooltip title="Task CreatedBy">
                                            <span>{x?.createdBy.map((x) => x.name)}</span>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item style={{ marginTop: 10 }}>
                                        {x.Assignee.map((x) => (
                                            <Tooltip title="Assignee">
                                                <span style={{ marginRight: 5, display: 'block' }}>
                                                    {x.name}
                                                </span>
                                            </Tooltip>
                                        ))}
                                    </Grid>
                                </Grid>

                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </InfiniteScroll >
        </Grid>
    );
}