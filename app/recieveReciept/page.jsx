import React from "react";

export default function Page() {
  return (
    <div className="mx-auto">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-8">
        {/* Logo and Company Info */}
        <div className="flex items-start space-x-3">
          {/* Logo placeholder - wheat/grain icon */}
          <div className="w-12 h-12 flex items-center justify-center">
            {/* <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L8 8h8l-4-6zm0 20l4-6H8l4 6zm-8-8l6-4v8l-6-4zm16 0l-6-4v8l6-4z"/>
            </svg> */}
            <img src="/logo.png" />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Ghulam Bari Rice Mills</h1>
            <p className="text-sm text-green-600 font-medium">Crafted With Precision</p>
            
            <div className="mt-3 text-xs text-gray-600 leading-relaxed">
              <p className="font-medium">Hujra Road, Near Ghala Mandi Chunian</p>
              <p>0300-5061234 (Accounts)</p>
            </div>
          </div>
        </div>
        
        {/* Receipt Title */}
        <div className="text-right">
          <h2 className="text-xl font-bold text-gray-800">Payment Receipt</h2>
        </div>
      </div>
      
      {/* Party Name and Receipt Info */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-700">Party Name:</span>
          <div className="border-b-2 border-black w-48 h-6"></div>
        </div>
        
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-700">Payment Date:</span>
            <div className="border-b-2 border-black w-32 h-6"></div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-700">Receipt No:</span>
            <div className="border-b-2 border-black w-32 h-6"></div>
          </div>
        </div>
      </div>
      
      {/* Cash Receipt Table */}
      <div className="mb-12">
        {/* Table Header */}
        <div className="bg-[#666666] text-white px-4 py-3">
          <h3 className="text-lg font-medium">Cash Receipt</h3>
        </div>
        
        {/* Table Content */}
        <div className="border-2 border-black">
          {/* Row 1 */}
          <div className="flex border-b-2 border-black">
            <div className="w-1/2 px-4 py-3 bg-gray-50 border-r-2 border-black font-medium text-gray-700">
              Payment Type
            </div>
            <div className="w-1/2 px-4 py-3 bg-white">
              Amount
            </div>
          </div>
          
          {/* Row 2 */}
          <div className="flex border-b-2 border-black">
            <div className="w-1/2 px-4 py-3 bg-gray-50 border-r-2 border-black font-medium text-gray-700">
              Bank Name
            </div>
            <div className="w-1/2 px-4 py-3 bg-white">
              Cheque No.
            </div>
          </div>
          
          {/* Row 3 */}
          <div className="flex">
            <div className="w-1/2 px-4 py-3 bg-gray-50 border-r-2 border-black font-medium text-gray-700">
              Transaction ID
            </div>
            <div className="w-1/2 px-4 py-3 bg-white">
            </div>
          </div>
        </div>
      </div>
      
      {/* Signature */}
      <div className="flex justify-end">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-700">Signature:</span>
          <div className="border-b-2 border-black w-48 h-6"></div>
        </div>
      </div>
    </div>
  );
}