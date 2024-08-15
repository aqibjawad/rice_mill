"use client";

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
        value={value}
        onChange={(event, newValue) => onChange(name, newValue)}
        renderInput={(params) => <TextField {...params} label={title} />}
        isOptionEqualToValue={(option, value) => option.id === value?.id}
      />
    </div>
  );
};

export default DropDown;