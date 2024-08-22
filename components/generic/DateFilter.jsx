import React, { useState } from "react";
import Popover from "@mui/material/Popover";
import PropTypes from "prop-types";
import styles from "../../styles/dateFilter.module.css";

const DateFilters = ({ onOptionChange, onDateChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [title, setTitle] = useState("Select Date");

  const handleOptionClick = (option) => {
    setSelectedOption(option);

    if (option !== "dateRange") {
      setStartDate(null);
      setEndDate(null);
      handleClose();
      if (typeof onOptionChange === "function") {
        onOptionChange(option, null, null);
      } else {
        console.error("onOptionChange is not a function");
      }
    }
    setTitle(option);
  };

  const handleStartDateChange = (event) => {
    const date = event.target.value;
    setStartDate(date);
    if (startDate !== undefined || endDate !== undefined) {
      if (typeof onDateChange === "function") {
        onDateChange(startDate, endDate);
      } else {
        console.error("onDateChange is not a function");
      }
    }
  };

  const handleEndDateChange = (event) => {
    const date = event.target.value;
    setEndDate(date);
    if (startDate !== undefined || endDate !== undefined) {
      setTitle(formatDate(startDate) + " - " + formatDate(endDate));
      if (typeof onDateChange === "function") {
        onDateChange(startDate, endDate);
      } else {
        console.error("onDateChange is not a function");
      }
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "date-filters-popover" : undefined;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options = { month: "long", year: "numeric", day: "2-digit" };
    return date.toLocaleDateString("en-GB", options);
  };

  return (
    <div>
      <button
        className={styles.datePicker}
        aria-describedby={id}
        variant="outlined"
        onClick={handleClick}
      >
        {title}
      </button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        PaperProps={{
          style: {
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "1rem",
          },
        }}
      >
        <div>
          <div
            className={styles.dateItem}
            onClick={() => handleOptionClick("today")}
          >
            Today
          </div>

          <div>
            <div
              className={styles.dateItem}
              style={{ border: "none" }}
              onClick={() => handleOptionClick("This Month")}
            >
              This Month
            </div>
          </div>
          <div>
            <div
              className={styles.dateItem}
              style={{ border: "none" }}
              onClick={() => handleOptionClick("This Year")}
            >
              This Year
            </div>
          </div>
          <div
            className={styles.dateItem}
            onClick={() => handleOptionClick("dateRange")}
          >
            Date Range
          </div>
          {selectedOption === "dateRange" && (
            <div className={styles.dateItem}>
              <input
                type="date"
                value={startDate || ""}
                onChange={handleStartDateChange}
              />
              <input
                type="date"
                value={endDate || ""}
                onChange={handleEndDateChange}
              />
            </div>
          )}
        </div>
      </Popover>
    </div>
  );
};

// Define prop types for DateFilters
DateFilters.propTypes = {
  onOptionChange: PropTypes.func.isRequired,
  onDateChange: PropTypes.func.isRequired,
};

// Default props if necessary
DateFilters.defaultProps = {
  onOptionChange: () => {},
  onDateChange: () => {},
};

export default DateFilters;