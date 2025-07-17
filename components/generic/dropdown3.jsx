// DropDown3.jsx
import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

const DropDown3 = ({ title, options, onChange, value, name }) => {
  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.label}
      value={value}
      onChange={(event, newValue) => onChange(name, newValue)}
      disablePortal
      disableClearable
      freeSolo={false}
      openOnFocus={true}
      renderInput={(params) => (
        <TextField 
          {...params} 
          label={title}
          InputProps={{
            ...params.InputProps,
            readOnly: true,
          }}
          inputProps={{
            ...params.inputProps,
            readOnly: true,
            onKeyDown: (e) => e.preventDefault(),
            onInput: (e) => e.preventDefault(),
            onPaste: (e) => e.preventDefault(),
          }}
        />
      )}
    />
  );
};

export default DropDown3;