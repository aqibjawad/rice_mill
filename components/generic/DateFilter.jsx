import React, { useState, useEffect } from "react";
import Popover from "@mui/material/Popover";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
  subMonths,
  format,
} from "date-fns";
import { Calendar } from "lucide-react";

const DateFilters = ({ onDateChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState("Today");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [title, setTitle] = useState("Today");
  const [customRange, setCustomRange] = useState(false);

  const handleOptionClick = (option) => {
    const today = new Date();
    let start, end;

    switch (option) {
      case "Today":
        start = startOfDay(new Date());
        end = endOfDay(new Date());
        setCustomRange(false);
        setAnchorEl(null);
        break;

      case "This Month":
        start = startOfMonth(today);
        end = endOfMonth(today);
        setCustomRange(false);
        setAnchorEl(null);
        break;

      case "Last Month":
        const lastMonth = subMonths(today, 1);
        start = startOfMonth(lastMonth);
        end = endOfMonth(lastMonth);
        setCustomRange(false);
        setAnchorEl(null);
        break;

      case "Custom Range":
        setCustomRange(true);
        start = null;
        end = null;
        break;

      default:
        break;
    }

    setStartDate(start);
    setEndDate(end);
    setSelectedOption(option);
    setTitle(option);

    if (onDateChange && start && end) {
      const formattedStart = format(start, "yyyy-MM-dd");
      const formattedEnd = format(end, "yyyy-MM-dd");
      onDateChange(formattedStart, formattedEnd);
    }
  };

  useEffect(() => {
    handleOptionClick("Today");
  }, []);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleCustomRangeSubmit = () => {
    if (startDate && endDate && onDateChange) {
      const formattedStartDate = format(startDate, "yyyy-MM-dd");
      const formattedEndDate = format(endDate, "yyyy-MM-dd");
      onDateChange(formattedStartDate, formattedEndDate);
      setTitle(
        `${format(startDate, "MM/dd/yyyy")} - ${format(endDate, "MM/dd/yyyy")}`
      );
    }
    setAnchorEl(null);
    setCustomRange(false);
  };

  // Custom styles for the date picker
  const customDatePickerStyle = {
    width: "280px", // Increased width
    padding: "10px",
    fontSize: "14px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    "& .react-datepicker": {
      width: "100%",
      fontSize: "1rem",
    },
    "& .react-datepicker__month-container": {
      width: "100%",
    },
    "& .react-datepicker__day": {
      width: "2rem",
      lineHeight: "2rem",
      margin: "0.2rem",
    },
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200"
        style={{ minWidth: "200px" }}
      >
        <Calendar className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">{title}</span>
      </button>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          className: "mt-2 rounded-lg shadow-lg",
          style: { width: customRange ? 320 : 280 }, // Increased width
        }}
      >
        <div className="p-3">
          {" "}
          {/* Increased padding */}
          {["Today", "This Month", "Last Month", "Custom Range"].map(
            (option) => (
              <div
                key={option}
                onClick={() => handleOptionClick(option)}
                className={`
                px-4 py-3 mb-1 rounded-md cursor-pointer transition-colors duration-200
                ${
                  selectedOption === option
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }
              `}
              >
                {option}
              </div>
            )
          )}
          {customRange && (
            <div className="mt-4 space-y-4 p-3 border-t border-gray-200">
              {" "}
              {/* Increased spacing */}
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                placeholderText="Start Date"
                selectsStart
                startDate={startDate}
                endDate={endDate}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                calendarClassName="!w-full"
                wrapperClassName="!w-full"
                popperClassName="!w-full"
                style={customDatePickerStyle}
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                placeholderText="End Date"
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                calendarClassName="!w-full"
                wrapperClassName="!w-full"
                popperClassName="!w-full"
                style={customDatePickerStyle}
              />
              <button
                onClick={handleCustomRangeSubmit}
                disabled={!startDate || !endDate}
                className={`
                  w-full px-4 py-3 rounded-md text-sm font-medium text-white transition-colors duration-200
                  ${
                    !startDate || !endDate
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }
                `}
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </Popover>
    </div>
  );
};

DateFilters.propTypes = {
  onDateChange: PropTypes.func.isRequired,
};

export default DateFilters;
