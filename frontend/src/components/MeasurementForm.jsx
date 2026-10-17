import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { createCustomer } from '../services/api';

const MeasurementForm = ({ isOpen, onClose, onCustomerCreated }) => {
  const [gender, setGender] = useState('Male');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [measurements, setMeasurements] = useState({});
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (field, val) => {
    setMeasurements((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await createCustomer({
        full_name: fullName,
        phone_number: phoneNumber,
        notes,
        gender,
        measurements,
      });
      onCustomerCreated(res.data.data.id);
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving client profile');
    } finally {
      setSaving(false);
    }
  };

  const maleFields = [
    { key: 'neck', label: 'Neck' },
    { key: 'chest', label: 'Chest' },
    { key: 'shoulder', label: 'Shoulder' },
    { key: 'sleeve', label: 'Sleeve Length' },
    { key: 'shirt_length', label: 'Shirt / Top Length' },
    { key: 'waist', label: 'Waist' },
    { key: 'trouser_length', label: 'Trouser Length' },
    { key: 'thigh', label: 'Thigh Circumference' },
  ];

  const femaleFields = [
    { key: 'bust', label: 'Bust' },
    { key: 'under_bust', label: 'Under Bust' },
    { key: 'waist', label: 'Waist' },
    { key: 'hip', label: 'Hip' },
    { key: 'gown_length', label: 'Gown Length' },
    { key: 'skirt_length', label: 'Skirt Length' },
    { key: 'sleeve', label: 'Sleeve Length' },
    { key: 'shoulder', label: 'Shoulder' },
  ];

  const activeFields = gender === 'Male' ? maleFields : femaleFields;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl text-neutral-100">
        <div className="flex justify-between items-center pb-4 border-b border-neutral-800">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">Client Registration</h2>
            <p className="text-xs text-neutral-400">Add client credentials and bespoke measurements</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-neutral-800 text-neutral-400 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1.5">Full Name</label>
              <input
                required
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ibrahim Babangida"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm text-neutral-100"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1.5">Phone Number</label>
              <input
                required
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="080XXXXXXXX"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm text-neutral-100 font-mono"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setGender('Male')}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition ${
                gender === 'Male'
                  ? 'bg-amber-500 text-neutral-950'
                  : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:bg-neutral-800'
              }`}
            >
              Men's Bespoke
            </button>
            <button
              type="button"
              onClick={() => setGender('Female')}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition ${
                gender === 'Female'
                  ? 'bg-amber-500 text-neutral-950'
                  : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:bg-neutral-800'
              }`}
            >
              Women's Bespoke
            </button>
          </div>

          <div>
            <span className="text-xs font-semibold text-neutral-400 block mb-2">
              Body Measurements (Inches)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {activeFields.map((f) => (
                <div key={f.key} className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
                  <label className="text-[11px] text-neutral-400 block truncate">{f.label}</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    onChange={(e) => handleInputChange(f.key, e.target.value)}
                    className="w-full bg-transparent mt-1 text-sm font-bold font-mono text-amber-400 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1.5">Fitting & Style Notes</label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Prefers slim fit cuffs, relaxed trousers..."
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm outline-none focus:ring-1 focus:ring-amber-500 text-neutral-200"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold rounded-xl transition shadow-lg shadow-amber-500/20 active:scale-98"
          >
            {saving ? 'Creating Profile...' : 'Save Bespoke Client Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MeasurementForm;