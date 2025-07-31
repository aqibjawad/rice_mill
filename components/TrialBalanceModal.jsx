"use client";
import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import DropDown3 from "@/components/generic/dropdown3";
import { seasons } from "../networkApi/Constants";
import APICall from "../networkApi/APICall";

const TrialBalanceModal = ({ isOpen, onClose }) => {
  const api = new APICall();
  const router = useRouter();

  const [seasonsList, setSeasons] = useState([]);
  const [loadingSeasons, setLoadingSeasons] = useState(true);
  const [error, setError] = useState("");

  // State for dropdown values
  const [dropdownValues, setDropdownValues] = useState({
    season_id: null,
  });

  // State for form data
  const [formData, setFormData] = useState({
    season_id: null,
  });

  // Handle dropdown change
  const handleDropdownChange = (name, selectedOption) => {
    console.log(`Selected ${name}:`, selectedOption);
    console.log(`Selected Season ID: ${selectedOption.id}`);

    setDropdownValues((prev) => ({
      ...prev,
      [name]: selectedOption,
    }));

    setFormData((prev) => ({
      ...prev,
      [name]: selectedOption.id,
    }));
  };

  const fetchSeasons = async () => {
    try {
      setLoadingSeasons(true);
      const response = await api.getDataWithToken(seasons);
      const filteredProducts = response.data.map((item, index) => ({
        label: item.name,
        index: index,
        id: item.id,
      }));
      setSeasons(filteredProducts);

      // Auto-select the last season
      if (filteredProducts.length > 0) {
        const lastSeason = filteredProducts[filteredProducts.length - 1];
        setDropdownValues((prev) => ({
          ...prev,
          season_id: lastSeason,
        }));
        setFormData((prev) => ({
          ...prev,
          season_id: lastSeason.id,
        }));

        // Log the auto-selected season ID
        console.log("Auto-selected Season ID:", lastSeason.id);
      }
    } catch (error) {
      console.error("Error fetching seasons:", error);
      setError("Failed to fetch seasons. Please try again.");
    } finally {
      setLoadingSeasons(false);
    }
  };

  // Handle redirect to trial balance page
  const handleProceed = () => {
    if (formData.season_id) {
      // Close modal first
      onClose();
      
      // Redirect to trial balance page with season ID
      router.push(`/trialBalance?season_id=${formData.season_id}`);
    } else {
      setError("Please select a season first.");
    }
  };

  useEffect(() => {
    fetchSeasons();
  }, []);

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }} 
      onClick={onClose}
    >
      <div 
        style={{
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          width: '90%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px 16px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: 600,
            color: '#1f2937'
          }}>
            Trial Balance
          </h2>
          <button 
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.2rem',
              color: '#6b7280',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              transition: 'all 0.2s ease'
            }}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.target.style.color = '#374151';
              e.target.style.backgroundColor = '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#6b7280';
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <FaTimes />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              padding: '12px 16px',
              borderRadius: '6px',
              border: '1px solid #fecaca',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
          <div style={{ marginTop: '20px' }}>
            <DropDown3
              title="Select Season"
              options={seasonsList}
              onChange={handleDropdownChange}
              value={dropdownValues.season_id}
              name="season_id"
              loading={loadingSeasons}
            />
          </div>
        </div>

        <div style={{
          padding: '16px 24px 24px',
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end',
          borderTop: '1px solid #e5e7eb'
        }}>
          <button 
            style={{
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              padding: '10px 20px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              minWidth: '80px'
            }}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#e5e7eb';
              e.target.style.borderColor = '#9ca3af';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#f3f4f6';
              e.target.style.borderColor = '#d1d5db';
            }}
          >
            Close
          </button>
          <button 
            style={{
              backgroundColor: formData.season_id ? '#3b82f6' : '#9ca3af',
              color: 'white',
              border: `1px solid ${formData.season_id ? '#3b82f6' : '#9ca3af'}`,
              padding: '10px 20px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: formData.season_id ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
              minWidth: '80px',
              opacity: formData.season_id ? 1 : 0.6
            }}
            onClick={handleProceed}
            disabled={!formData.season_id}
            onMouseEnter={(e) => {
              if (formData.season_id) {
                e.target.style.backgroundColor = '#2563eb';
                e.target.style.borderColor = '#2563eb';
              }
            }}
            onMouseLeave={(e) => {
              if (formData.season_id) {
                e.target.style.backgroundColor = '#3b82f6';
                e.target.style.borderColor = '#3b82f6';
              }
            }}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrialBalanceModal;