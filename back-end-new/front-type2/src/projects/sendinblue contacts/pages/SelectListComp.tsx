import React from "react";
import Select from 'react-select'

export default function SelectListComp(props) {
    let options = [];
    if (props?.options?.length > 0) {
        options = props.options.map((e) => {
            return { label: e.name, value: e.id };
        })
    }
    return (
        <Select
            className="WidhtFull100 basic-multi-select"
            placeholder="List of Contact list"
            options={options}
        />
    )
}