// DropDown.jsx
import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

const DropDown = ({ title, options, onChange, value, name }) => {
  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.label}
      value={value}
      onChange={(event, newValue) => onChange(name, newValue)}
      renderInput={(params) => <TextField {...params} label={title} />}
    />
  );
};

export default DropDown;
