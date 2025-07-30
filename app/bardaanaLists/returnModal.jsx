import React, { useState, useEffect } from "react";
import APICall from "@/networkApi/APICall";
import { purchaseBook } from "../../networkApi/Constants";

const BardanaReturnModal = ({ isOpen, onClose, selectedItem, onSubmit }) => {
  const api = new APICall();

  const [quantity, setQuantity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quantityError, setQuantityError] = useState("");

  console.log(selectedItem);

  useEffect(() => {
    if (selectedItem) {
      // remaining_bardaana_qty se quantity set kar dete hain
      setQuantity(selectedItem.remaining_bardaana_qty || "");
      setQuantityError(""); // Clear any previous errors
      console.log("Selected Item:", selectedItem);
    }
  }, [selectedItem]);

  // Real-time quantity validation
  const handleQuantityChange = (e) => {
    const value = e.target.value;
    setQuantity(value);

    // Clear error when user starts typing
    if (quantityError) {
      setQuantityError("");
    }

    // Real-time validation
    if (value && parseInt(value) > (selectedItem?.remaining_bardaana_qty || 0)) {
      setQuantityError(`Maximum allowed quantity is ${selectedItem?.remaining_bardaana_qty || 0}`);
    } else if (value && parseInt(value) <= 0) {
      setQuantityError("Quantity must be greater than 0");
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async () => {
    // Reset error state
    setQuantityError("");

    // Validate quantity
    if (!quantity || quantity <= 0) {
      setQuantityError("Please enter a valid quantity");
      if (window.Swal) {
        window.Swal.fire({
          icon: 'warning',
          title: 'Invalid Quantity!',
          text: 'Please enter a valid quantity',
          confirmButtonColor: '#0075E2'
        });
      } else {
        alert("Please enter a valid quantity");
      }
      return;
    }

    // Check if quantity is greater than remaining quantity
    if (parseInt(quantity) > (selectedItem?.remaining_bardaana_qty || 0)) {
      setQuantityError(`Maximum allowed quantity is ${selectedItem?.remaining_bardaana_qty || 0}`);
      if (window.Swal) {
        window.Swal.fire({
          icon: 'warning',
          title: 'Invalid Quantity!',
          text: `Quantity cannot be greater than remaining quantity (${selectedItem?.remaining_bardaana_qty || 0})`,
          confirmButtonColor: '#0075E2'
        });
      } else {
        alert(`Quantity cannot be greater than remaining quantity (${selectedItem?.remaining_bardaana_qty || 0})`);
      }
      return;
    }

    if (!selectedItem?.id) {
      if (window.Swal) {
        window.Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Purchase book ID not found',
          confirmButtonColor: '#0075E2'
        });
      } else {
        alert("Purchase book ID not found");
      }
      return;
    }

    setIsSubmitting(true);
    
    try {
      const requestData = {
        purchase_book_id: selectedItem.id,
        bardaana_quantity: parseInt(quantity)
      };

      // API call to bardaana/return endpoint
      const response = await api.postFormDataWithToken(`${purchaseBook}/bardaana/return`, requestData);
            
      if (response.status === "success") {
        // Show SweetAlert success message
        if (window.Swal) {
          window.Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: response.message || 'Bardaana Return Added Successfully.',
            confirmButtonColor: '#0075E2',
            timer: 2000,
            showConfirmButton: true
          }).then(() => {
            onSubmit(); // Call parent callback
            onClose(); // Close modal
          });
        } else {
          alert(response.message || "Bardana return submitted successfully!");
          onSubmit(); // Call parent callback
          onClose(); // Close modal
        }
      } else {
        // Show SweetAlert error message
        if (window.Swal) {
          window.Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: response.message || 'Failed to submit bardana return. Please try again.',
            confirmButtonColor: '#0075E2'
          });
        } else {
          alert(response.message || "Failed to submit bardana return. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error submitting bardana return:", error);
      // Show SweetAlert error message for catch block
      if (window.Swal) {
        window.Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'An error occurred while submitting. Please try again.',
          confirmButtonColor: '#0075E2'
        });
      } else {
        alert("An error occurred while submitting. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modal and reset state
  const handleClose = () => {
    setQuantityError("");
    setQuantity("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-96 max-w-md mx-4">
        {/* Header */}
        <div
          className="text-white py-4 px-6 rounded-t-lg"
          style={{ backgroundColor: "#0075E2" }}
        >
          <h2 className="text-xl font-bold">Bardana Return</h2>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Party Name:
            </label>
            <input
              type="text"
              value={selectedItem?.party?.person_name || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purchase Date:
            </label>
            <input
              type="text"
              value={selectedItem?.date || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Return Quantity: <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                quantityError 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="Enter quantity to return"
              min="1"
              max={selectedItem?.remaining_bardaana_qty || 0}
              disabled={isSubmitting}
            />
            
            {/* Helper text showing remaining quantity */}
            <div className="mt-1 flex justify-between items-start">
              <p className="text-xs text-gray-500">
                Available: {selectedItem?.remaining_bardaana_qty || 0}
              </p>
            </div>
            
            {/* Error message */}
            {quantityError && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {quantityError}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || quantityError}
              className="px-6 py-2 text-white rounded-md hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#0075E2" }}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BardanaReturnModal