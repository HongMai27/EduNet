import React, { useState } from 'react';

interface ReportModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmitReport: (reason: string) => void;
  reasons: string[];
}

const ReportModal: React.FC<ReportModalProps> = ({ isVisible, onClose, onSubmitReport, reasons }) => {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [otherReason, setOtherReason] = useState<string>('');  // State cho lý do "Other"

  if (!isVisible) return null;

  const handleRadioChange = (reason: string) => {
    setSelectedReason(reason);
    if (reason !== 'Other') {
      setOtherReason('');  // Nếu chọn không phải "Other", reset giá trị "Other"
    }
  };

  const handleOtherReasonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtherReason(e.target.value);
  };

  const handleSubmit = () => {
    const reasonToSubmit = selectedReason === 'Other' ? otherReason : selectedReason;
    if (!reasonToSubmit) {
      alert('Please provide a reason for reporting!');
      return;
    }
    onSubmitReport(reasonToSubmit);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-md w-full text-center">
        <h2 className="text-lg font-bold mb-4">Select Reason for Reporting</h2>
        
        {/* Render each reason */}
        {reasons.map((reason) => (
          <label key={reason} className="flex items-center space-x-2 mb-2">
            <input
              type="radio"
              name="reason"
              value={reason}
              checked={selectedReason === reason}
              onChange={() => handleRadioChange(reason)}
              className="form-radio"
            />
            <span>{reason}</span>
          </label>
        ))}
        
        {/* Show input field if "Other" is selected */}
        {selectedReason === 'Other' && (
          <div className="mt-4">
            <input
              type="text"
              value={otherReason}
              onChange={handleOtherReasonChange}
              placeholder="Please specify..."
              className="px-4 py-2 border rounded-lg w-full"
            />
          </div>
        )}

        <div className="mt-4 flex justify-center space-x-4">
          <button
            onClick={handleSubmit}
            disabled={!selectedReason || (selectedReason === 'Other' && !otherReason)}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          >
            Submit Report
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
