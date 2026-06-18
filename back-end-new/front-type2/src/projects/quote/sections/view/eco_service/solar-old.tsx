import React, { useState } from 'react';
import * as Yup from 'yup';
import TextField from '@material-ui/core/TextField';
import Select from 'react-select';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import OnTextEditInput from '../../../../../sharedUtils/sharedComponents/editHelpers2/onTextEditHelper';
import { CustomerTypeOptions, CoverTypesOptions, RoofStructureOptions, AMS } from '../../../../../sharedUtils/globalHelper/constantValues'
import Grid from '@material-ui/core/Grid';

export default function Solar(props) {

    const [isChecked, setIsChecked] = useState(props.currentQuote.isActive === 1);
    const [isDeleteCheck, setIsDelete] = useState(props.currentQuote.isDelete === 1);
    const { service } = props.currentQuote;

    let Solar: any = {}
    if (service && service.eco?.subservice?.solar) {
        Solar = { ...service.eco?.subservice?.solar }
    }

    const simpleEdit = (value, closeEdit, setSubmitting) => {
        const qu = Solar;
        if (value.isActive) qu.isActive = isChecked ? 1 : 2;
        if (value.isDelete) qu.isDelete = isDeleteCheck ? 1 : 2;

        if (value.name) qu.name = value.name;
        if (value.access_to_site) qu.access_to_site = value.access_to_site;
        if (value.address) qu.address = value.address;
        if (value.electricity_supplier) qu.electricity_supplier = value.electricity_supplier;
        if (value.email) qu.email = value.email;
        if (value.estimated_roof_area) qu.estimated_roof_area = value.estimated_roof_area;
        if (value.fuse_band_location) qu.fuse_band_location = value.fuse_band_location;
        if (value.mobile) qu.mobile = value.mobile;
        if (value.obtained_permission) qu.obtained_permission = value.obtained_permission;
        if (value.orientation_of_roof) qu.orientation_of_roof = value.orientation_of_roof;
        if (value.property_age) qu.property_age = value.property_age;
        if (value.property_conservation_area) qu.property_conservation_area = value.property_conservation_area;
        if (value.property_desc) qu.property_desc = value.property_desc;
        if (value.property_occupy_people) qu.property_occupy_people = value.property_occupy_people;
        if (value.proposed_inverter_site) qu.proposed_inverter_site = value.proposed_inverter_site;
        if (value.rcd_protected) qu.rcd_protected = value.rcd_protected;
        if (value.remedial_required) qu.remedial_required = value.remedial_required;
        if (value.roof_condition) qu.roof_condition = value.roof_condition;
        if (value.roof_pitch) qu.roof_pitch = value.roof_pitch;
        if (value.shading) qu.shading = value.shading;
        if (value.sought_permission) qu.sought_permission = value.sought_permission;
        if (value.structural_servey_required) qu.structural_servey_required = value.structural_servey_required;
        if (value.suitable_access_loft) qu.suitable_access_loft = value.suitable_access_loft;
        if (value.telephone) qu.telephone = value.telephone;
        if (value.voltage_optimiser_installed) qu.voltage_optimiser_installed = value.voltage_optimiser_installed;
        if (value.customerType) qu.customerType = value.customerType;
        if (value.roof_structure) qu.roof_structure = value.roof_structure;
        if (value.types_of_cover) qu.types_of_cover = value.types_of_cover;

        const quoteUpdate: any = {
            quoteId: props.currentQuote._id,
            serviceTypeName: 'eco',
            service: {
                eco: {
                    subservice: {
                        ...service?.eco?.subservice,
                        solar: qu
                    }
                }
            }
        }

        props._isLoadingData(true, props.type);
        props._editQuote(quoteUpdate, props.type)

        closeEdit(null);
        setSubmitting(false);
    };

    return (
        <Grid container spacing={3} className="eco_service_table">
            <Grid item xs={12} md={12} style={{ padding: '20px 12px' }}>

                <TableRow>
                    <TableCell>
                        <strong style={{ color: '#2a00b8' }}>Contact Details</strong>
                    </TableCell>
                    <TableCell>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>
                        <strong>Name</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="name"
                                value={Solar.name}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    name: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.name &&
                                                    props.touched.name
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="name"
                                            value={props.values.name}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.name}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Solar.name}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Address</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="address"
                                value={Solar.address}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    address: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.address &&
                                                    props.touched.address
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="address"
                                            value={props.values.address}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.address}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Solar.address}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Telephone</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="telephone"
                                value={Solar.telephone}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    telephone: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.telephone &&
                                                    props.touched.telephone
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="telephone"
                                            type='number'
                                            value={props.values.telephone}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.telephone}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Solar.telephone}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Mobile</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="mobile"
                                value={Solar.mobile}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    mobile: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.mobile &&
                                                    props.touched.mobile
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="mobile"
                                            type='number'
                                            value={props.values.mobile}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.mobile}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Solar.mobile}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Email</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="email"
                                value={Solar.email}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    email: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.email &&
                                                    props.touched.email
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="email"
                                            value={props.values.email}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.email}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Solar.email}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Customer type</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="customerType"
                                value={Solar.customerType?.value ? Solar.customerType?.value : Solar.customerType}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    customerType: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <Select
                                            error={
                                                props.errors.customerType &&
                                                    props.touched.customerType
                                                    ? true
                                                    : false
                                            }
                                            className="basic-multi-select WidhtFull100"
                                            name="customerType"
                                            value={{
                                                label: props.values.customerType,
                                                value: props.values.customerType,
                                            }}
                                            options={CustomerTypeOptions}
                                            helperText={!props.errors.customerType}
                                            onChange={(e) => {
                                                props.setFieldValue("customerType", e.value);
                                            }}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Solar.customerType}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong style={{ color: '#2a00b8' }}>Project Details</strong>
                    </TableCell>
                    <TableCell>
                    </TableCell>
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Property description</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="property_desc"
                                value={Solar.property_desc}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    property_desc: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.property_desc &&
                                                    props.touched.property_desc
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="property_desc"
                                            value={props.values.property_desc}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.property_desc}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Solar.property_desc}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Approx age of property</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="property_age"
                                value={Solar.property_age}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    property_age: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.property_age &&
                                                    props.touched.property_age
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="property_age"
                                            value={props.values.property_age}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.property_age}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Solar.property_age}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Is property in conservation area?</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="property_conservation_area"
                                value={Solar.property_conservation_area}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    property_conservation_area: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.property_conservation_area &&
                                                    props.touched.property_conservation_area
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="property_conservation_area"
                                            value={props.values.property_conservation_area}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.property_conservation_area}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Solar.property_conservation_area}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>How many people occupy the property?</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="property_occupy_people"
                                value={Solar.property_occupy_people}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    property_occupy_people: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.property_occupy_people &&
                                                    props.touched.property_occupy_people
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="property_occupy_people"
                                            value={props.values.property_occupy_people}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.property_occupy_people}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Solar.property_occupy_people}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Is planning permission to be sought?</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="sought_permission"
                                value={Solar.sought_permission}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    sought_permission: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.sought_permission &&
                                                    props.touched.sought_permission
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="sought_permission"
                                            value={props.values.sought_permission}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.sought_permission}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Solar.sought_permission}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Has planning permission been obtained?</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="obtained_permission"
                                value={Solar.obtained_permission}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    obtained_permission: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.obtained_permission &&
                                                    props.touched.obtained_permission
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="obtained_permission"
                                            value={props.values.obtained_permission}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.obtained_permission}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Solar.obtained_permission}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong style={{ color: '#2a00b8' }}>Supply Details</strong>
                    </TableCell>
                    <TableCell>
                    </TableCell>
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Voltage/boiler optimiser installed</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="voltage_optimiser_installed"
                                value={Solar.voltage_optimiser_installed}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    voltage_optimiser_installed: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.voltage_optimiser_installed &&
                                                    props.touched.voltage_optimiser_installed
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="voltage_optimiser_installed"
                                            value={props.values.voltage_optimiser_installed}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.voltage_optimiser_installed}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Solar.voltage_optimiser_installed}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Electricity Supplier</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="electricity_supplier"
                                value={Solar.electricity_supplier}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    electricity_supplier: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.electricity_supplier &&
                                                    props.touched.electricity_supplier
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="electricity_supplier"
                                            value={props.values.electricity_supplier}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.electricity_supplier}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Solar.electricity_supplier}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Location of Fuse Band</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="fuse_band_location"
                                value={Solar.fuse_band_location}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    fuse_band_location: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.fuse_band_location &&
                                                    props.touched.fuse_band_location
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="fuse_band_location"
                                            value={props.values.fuse_band_location}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.fuse_band_location}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Solar.fuse_band_location}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>RCD protected</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="rcd_protected"
                                value={Solar.rcd_protected}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    rcd_protected: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.rcd_protected &&
                                                    props.touched.rcd_protected
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="rcd_protected"
                                            value={props.values.rcd_protected}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.rcd_protected}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Solar.rcd_protected}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Estimated roof area</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="estimated_roof_area"
                                value={Solar.estimated_roof_area}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    estimated_roof_area: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.estimated_roof_area &&
                                                    props.touched.estimated_roof_area
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="estimated_roof_area"
                                            value={props.values.estimated_roof_area}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.estimated_roof_area}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Solar.estimated_roof_area}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Roof pitch (°)</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="roof_pitch"
                                value={Solar.roof_pitch}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    roof_pitch: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.roof_pitch &&
                                                    props.touched.roof_pitch
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="roof_pitch"
                                            value={props.values.roof_pitch}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.roof_pitch}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Solar.roof_pitch}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Orientation of roof (° from N)</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="orientation_of_roof"
                                value={Solar.orientation_of_roof}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    orientation_of_roof: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.orientation_of_roof &&
                                                    props.touched.orientation_of_roof
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="orientation_of_roof"
                                            value={props.values.orientation_of_roof}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.orientation_of_roof}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Solar.orientation_of_roof}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Shading</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="shading"
                                value={Solar.shading}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    shading: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.shading &&
                                                    props.touched.shading
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="shading"
                                            value={props.values.shading}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.shading}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Solar.shading}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Roof condition</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="roof_condition"
                                value={Solar.roof_condition}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    roof_condition: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.roof_condition &&
                                                    props.touched.roof_condition
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="roof_condition"
                                            value={props.values.roof_condition}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.roof_condition}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Solar.roof_condition}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Remedial electrical works required?</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="remedial_required"
                                value={Solar.remedial_required}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    remedial_required: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.remedial_required &&
                                                    props.touched.remedial_required
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="remedial_required"
                                            value={props.values.remedial_required}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.remedial_required}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Solar.remedial_required}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Structural survey required?</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="structural_servey_required"
                                value={Solar.structural_servey_required}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    structural_servey_required: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.structural_servey_required &&
                                                    props.touched.structural_servey_required
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="structural_servey_required"
                                            value={props.values.structural_servey_required}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.structural_servey_required}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Solar.structural_servey_required}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Proposed inverter site</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="proposed_inverter_site"
                                value={Solar.proposed_inverter_site}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    proposed_inverter_site: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.proposed_inverter_site &&
                                                    props.touched.proposed_inverter_site
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="proposed_inverter_site"
                                            value={props.values.proposed_inverter_site}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.proposed_inverter_site}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Solar.proposed_inverter_site}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Suitable access to loft</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="suitable_access_loft"
                                value={Solar.suitable_access_loft}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    suitable_access_loft: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.suitable_access_loft &&
                                                    props.touched.suitable_access_loft
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="suitable_access_loft"
                                            value={props.values.suitable_access_loft}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.suitable_access_loft}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Solar.suitable_access_loft}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Access to site</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="access_to_site"
                                value={Solar.access_to_site}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    access_to_site: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.access_to_site &&
                                                    props.touched.access_to_site
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="access_to_site"
                                            value={props.values.access_to_site}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.access_to_site}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Solar.access_to_site}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Identification Of Roof Structure</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="roof_structure"
                                value={Solar.roof_structure?.value ? Solar.roof_structure?.value : Solar.roof_structure}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    roof_structure: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <Select
                                            error={
                                                props.errors.roof_structure &&
                                                    props.touched.roof_structure
                                                    ? true
                                                    : false
                                            }
                                            className="basic-multi-select WidhtFull100"
                                            name="roof_structure"
                                            value={{
                                                label: props.values.roof_structure,
                                                value: props.values.roof_structure,
                                            }}
                                            options={RoofStructureOptions}
                                            helperText={!props.errors.roof_structure}
                                            onChange={(e) => {
                                                props.setFieldValue("roof_structure", e.value);
                                            }}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Solar.roof_structure}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Types Of Cover</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="types_of_cover"
                                value={Solar.types_of_cover?.value ? Solar.types_of_cover?.value : Solar.types_of_cover}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    types_of_cover: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <Select
                                            error={
                                                props.errors.types_of_cover &&
                                                    props.touched.types_of_cover
                                                    ? true
                                                    : false
                                            }
                                            className="basic-multi-select WidhtFull100"
                                            name="types_of_cover"
                                            value={{
                                                label: props.values.types_of_cover,
                                                value: props.values.types_of_cover,
                                            }}
                                            options={CoverTypesOptions}
                                            helperText={!props.errors.types_of_cover}
                                            onChange={(e) => {
                                                props.setFieldValue("types_of_cover", e.value);
                                            }}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Solar.types_of_cover}
                        </TableCell>
                    )}
                </TableRow>
            </Grid>
        </Grid>
    );
}
