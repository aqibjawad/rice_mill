import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const DropDown = ({ title, options = [], onChange, value, name }) => {
  return (
    <div>
      <Autocomplete
        disablePortal
        id={`dropdown-select-${name}`}
        options={options}
        getOptionLabel={(option) => option.label || ""}
        value={options.find(option => option.value === value) || null}
        onChange={(event, newValue) => onChange(name, newValue)}
        renderInput={(params) => <TextField {...params} label={title} />}
        isOptionEqualToValue={(option, value) => option.value === value?.value}
      />
    </div>
  );
};

export default DropDown;
