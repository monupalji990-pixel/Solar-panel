import React, { useState, useCallback } from 'react';
import {
    Grid,
    CircularProgress,
    Button,
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { DropzoneArea } from 'material-ui-dropzone';
import Dialog from '@material-ui/core/Dialog';
import Api from '../redux/model/quote'
import LeadApi from '../../lead/redux/model/lead';
import TextField from "@material-ui/core/TextField";
import { globalConfigActions } from 'sharedUtils/sharedRedux/configuration';
import {
    leadAction,
} from "../../lead/redux/lead";

export default function photoGallery(props) {

    const [show, setShow] = useState(false);
    const [open, setOpen] = useState(false);
    const [overlayImage, setOverlayImage] = useState('');
    const [isTextTitle, setIsTextTitle] = useState('');
    const [fileUpload, setFileUpload]: any = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [initialLeadImages, setInitialLeadImages] = useState([]);

    React.useEffect(() => {
        if (props.singleLead?.gallery) {
            setInitialLeadImages(props.singleLead?.gallery);
        }
    }, [props.singleLead?.gallery]);

    const dispatch = useDispatch();

    const _isLoadingDataLead = (payload) =>
        dispatch(leadAction.LoaderAction(payload));
    const _leadDetail = (payload) => dispatch(leadAction.singleLead(payload));

    const handleShowUpload = () => {
        setShow(!show);
    }

    const handleFileUpload = (files) => {
        if (files[0]) {
            setIsUploading(true);
            const data = new FormData();
            data.append("image", files[0]);
            Api.uploadImages(data).then((response: any) => {
                if (response.success) {
                    setFileUpload(response.data.image[0].location);
                    setIsUploading(false);
                }
            })
        }
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpenImg = (img) => {
        setOpen(true);
        setOverlayImage(img);
    }

    const handleChangeTitle = (event) => {
        setIsTextTitle(event.target.value);
    }

    const handleSubmit = () => {
        setLoading(true);

        const data: any = {
            slug: props.slug
        }

        if (props.isFrom === 'lead') {
            let leadGallery: any = [
                ...initialLeadImages,
                {
                    title: isTextTitle,
                    image: fileUpload
                }
            ]

            const leadUpdate: any = {
                gallery: leadGallery,
                leadId: props.singleLead._id,
            }

            LeadApi.updateLead(data, leadUpdate).then((response: any) => {
                if (response.success) {
                    dispatch(globalConfigActions.enableFeedback('Image uploaded successfully'));
                    setIsTextTitle('');
                    setShow(false);
                    setFileUpload([]);
                    setLoading(false);
                    props._isLoadingDataLead(true);
                    props._leadDetail({
                        slug: props.slug,
                        leadId: props.singleLead._id,
                    });
                } else {
                    dispatch(globalConfigActions.enableFeedback(response.message));
                    setLoading(false);
                }
            })
        } else {
            let gallery: any = [
                ...props.currentQuote.gallery,
                {
                    title: isTextTitle,
                    image: fileUpload
                }
            ]
            const quoteUpdate: any = {
                quoteId: props.currentQuote._id,
                gallery: gallery,
            }
            Api.editQuote(data, quoteUpdate).then((response: any) => {
                if (response.success) {
                    dispatch(globalConfigActions.enableFeedback('Image uploaded successfully'));
                    setIsTextTitle('');
                    setShow(false);
                    setFileUpload([]);
                    setLoading(false);
                    props._isLoadingData(true, props.type);
                    props._viewSingleQuote({ quoteId: props.currentQuote._id });
                } else {
                    dispatch(globalConfigActions.enableFeedback(response.message));
                    setLoading(false);
                }
            })
        }
    }

    return (
        <React.Fragment>
            <Button
                size='medium'
                variant='contained'
                color='primary'
                onClick={handleShowUpload}
                style={{
                    margin: '15px 0',
                    width: '100%'
                }}
            >
                {isUploading ? 'Uploading files...' : 'Upload Files'}
            </Button>

            {show &&
                <React.Fragment>
                    <TextField
                        variant="outlined"
                        id="title"
                        name="title"
                        className="WidhtFull100"
                        label="Image Title"
                        margin="normal"
                        value={isTextTitle}
                        onChange={handleChangeTitle}
                        aria-describedby="title-error"
                    />
                    <div className='upload_img'>
                        <DropzoneArea
                            filesLimit={1}
                            maxFileSize={10485760}
                            acceptedFiles={['image/*']}
                            onChange={(files) => handleFileUpload(files)}
                        />
                    </div>
                    <Button
                        size='medium'
                        variant='contained'
                        color='primary'
                        onClick={handleSubmit}
                        style={{
                            margin: '15px 0',
                            width: '100%'
                        }}
                        disabled={isUploading}
                    >
                        SUBMIT {isLoading && <CircularProgress color="secondary" size={25} />}
                    </Button>
                </React.Fragment>
            }

            <Grid container>
                <ul className="image-gallery">
                    {props.isFrom == 'lead' ?
                        props.singleLead?.gallery?.length > 0
                            ?
                            props.singleLead?.gallery.map((x) => (
                                <li onClick={() => handleOpenImg(x.image)}>
                                    <img src={x.image} alt="" />
                                    <div className="overlay"><span>{x.title}</span></div>
                                </li>
                            )) :
                            <div style={{
                                width: '100%',
                                textAlign: 'center',
                                padding: 10
                            }}>
                                No Images Uploaded!
                            </div>
                        :
                        props.currentQuote?.gallery.length > 0
                            ?
                            props.currentQuote?.gallery.map((x) => (
                                <li onClick={() => handleOpenImg(x.image)}>
                                    <img src={x.image} alt="" />
                                    <div className="overlay"><span>{x.title}</span></div>
                                </li>
                            )) :
                            <div style={{
                                width: '100%',
                                textAlign: 'center',
                                padding: 10
                            }}>
                                No Images Uploaded!
                            </div>
                    }
                </ul>
            </Grid>

            <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
                <img src={overlayImage} />
            </Dialog>
        </React.Fragment >
    )
}
