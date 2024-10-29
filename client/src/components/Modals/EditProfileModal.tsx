import React, { useState } from 'react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    username: string;
    phone: string;
    address: string;
    birthday: string;
    sex: string;
  };
  onSave: (updatedUser: any) => void; 
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  const [username, setUsername] = useState(user.username);
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState(user.address);
  const [birthday, setBirthday] = useState(user.birthday);
  const [sex, setSex] = useState(user.sex);

  const handleSubmit = () => {
    const updatedUser = { username, phone, address, birthday, sex };
    alert('Upated profile')
    onSave(updatedUser);
    onClose(); 
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border rounded w-full px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border rounded w-full px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border rounded w-full px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Date of Birth</label>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="border rounded w-full px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Sex</label>
          <select
            value={sex}
            onChange={(e) => setSex(e.target.value)}
            className="border rounded w-full px-3 py-2"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="flex justify-between">
          <button onClick={onClose} className="bg-gray-300 rounded px-4 py-2">Cancel</button>
          <button onClick={handleSubmit} className="bg-blue-500 text-white rounded px-4 py-2">Save</button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
