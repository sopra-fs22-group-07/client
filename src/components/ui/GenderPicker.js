import Select from "react-select";
import React from "react";

//Options for Selector Element
const genderOptions = [
    {value: 'MALE', label: 'Male'},
    {value:  'FEMALE', label: 'Female'},
    {value: 'OTHER', label: 'Other'}
]

//Needed for styling of selector element
const customStyles = {
    option: (provided) => ({
        ...provided,
        borderBottom: '1px dotted black',
        color: 'black',
        padding: 10,
    }),
    singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = 'opacity 300ms';
        return { ...provided, opacity, transition };
    }
}

export const GenderPicker = props => (
    <Select
        {...props}
        styles={customStyles}
        options={genderOptions}
        {...props.children}
    />
);