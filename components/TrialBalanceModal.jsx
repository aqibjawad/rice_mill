"use client";
import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import styles from "../styles/modal.module.css";
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
      
      // Alternative: if you want to pass it as a route parameter
      // router.push(`/trial-balance/${formData.season_id}`);
    } else {
      setError("Please select a season first.");
    }
  };

  useEffect(() => {
    fetchSeasons();
  }, []);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Trial Balance</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.modalBody}>
          {error && <div className="error-message">{error}</div>}
          <div className="mt-5">
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

        <div className={styles.modalFooter}>
          <button className={styles.cancelButton} onClick={onClose}>
            Close
          </button>
          <button 
            className={styles.proceedButton} 
            onClick={handleProceed}
            disabled={!formData.season_id}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrialBalanceModal;