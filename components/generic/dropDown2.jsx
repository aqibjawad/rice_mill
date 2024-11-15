// DropDown.jsx
import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

const DropDown2 = ({ title, options, onChange, value, name }) => {
  return (
    <Autocomplete
      freeSolo // Allow custom typing
      options={options}
      getOptionLabel={(option) => option.label || option} // Handles both typed values and option objects
      value={value}
      onChange={(event, newValue) => onChange(name, newValue)}
      renderInput={(params) => <TextField {...params} label={title} />}
    />
  );
};

export default DropDown2;
