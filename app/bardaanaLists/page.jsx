"use client";
import React, { useState } from 'react';
// import BardanaReturnModal from './BardanaReturnModal';

// Updated Main Component with Modal Integration
export default function BardanaList() {
  const [activeTab, setActiveTab] = useState('Jamaa');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const bardanaData = [
    { id: '01', date: '01/12/2024', partyName: 'Abubakar Siddique', quantity: 500, type: 'Bori' },
    { id: '02', date: '01/02/2025', partyName: 'Aqib Ali', quantity: 1000, type: 'Tora' },
    { id: '03', date: '01/05/2025', partyName: 'M. Hamza', quantity: 1500, type: 'Tora' },
    { id: '04', date: '01/12/2024', partyName: 'Zeeshan', quantity: 1300, type: 'Tora' },
    { id: '05', date: '01/06/2023', partyName: 'Shehbaz', quantity: 500, type: 'Tora' },
    { id: '06', date: '01/12/2024', partyName: 'Aqib Ali', quantity: 800, type: 'Tora' },
    { id: '07', date: '01/02/2025', partyName: 'M. Hamza', quantity: 500, type: 'Bori' },
    { id: '08', date: '01/12/2024', partyName: 'Shehbaz', quantity: 500, type: 'Bori' },
    { id: '09', date: '01/02/2025', partyName: 'Aqib Ali', quantity: 2000, type: 'Tora' },
    { id: '10', date: '01/12/2024', partyName: 'Aqib Ali', quantity: 1800, type: 'Bori' },
  ];

  const tabs = [
    { id: 'Jamaa', label: 'Jamaa', active: true },
    { id: 'Return', label: 'Return', active: false },
    { id: 'Purchase', label: 'Purchase', active: false }
  ];

  const handleReturnClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="max-w-6xl mx-auto bg-white">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-2 p-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            style={{
              borderRadius: '8px',
              backgroundColor: activeTab === tab.id ? '#0075E2' : undefined
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="text-white py-4 px-6" style={{borderRadius: '15px 15px 0 0', backgroundColor: '#0075E2'}}>
        <h1 style={{fontWeight:"bold", fontSize:"24px"}}>Bardana List</h1>
      </div>

      {/* Table */}
      <div className="overflow-x-auto" style={{borderRadius: '0 0 15px 15px'}}>
        <table className="w-full" style={{borderRadius: '15px'}}>
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600" style={{fontSize:"18px"}}>Serial No.</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600" style={{fontSize:"18px"}}>Date</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600" style={{fontSize:"18px"}}>Party Name</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600" style={{fontSize:"18px"}}>Quantity</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600" style={{fontSize:"18px"}}>Type</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600" style={{fontSize:"18px"}}></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bardanaData.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 text-sm text-gray-600">{item.id}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.date}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.partyName}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.quantity}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.type}</td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => handleReturnClick(item)}
                    className="hover:opacity-90 text-white text-sm px-6 py-3 transition-colors" 
                    style={{borderRadius: '4px', backgroundColor: '#0075E2'}}
                  >
                    Return
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-96 max-w-md mx-4">
            {/* Header */}
            <div className="text-white py-4 px-6 rounded-t-lg" style={{backgroundColor: '#0075E2'}}>
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
                  value={selectedItem?.partyName || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date:
                </label>
                <input
                  type="text"
                  value={selectedItem?.date || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity:
                </label>
                <input
                  type="number"
                  defaultValue={selectedItem?.quantity || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    console.log('Return submitted');
                    closeModal();
                  }}
                  className="px-6 py-2 text-white rounded-md hover:opacity-90 transition-colors"
                  style={{backgroundColor: '#0075E2'}}
                >
                  Submit
                </button>
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}