"use client";

import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const DropDown = ({ title, options = [], onChange }) => {
    const [selectedID, setSelectedID] = useState(null);

    return (
        <div>
            <Autocomplete
                disablePortal
                id="dropdown-select"
                options={options}
                getOptionLabel={(option) => option.label || ''}
                value={options.find(item => item.id === selectedID) || null}
                onChange={onChange}
                renderInput={(params) => (
                    <TextField {...params} label={title} />
                )}
            />
        </div>
    );
}

export default DropDown;