import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import CustomerCard from '../components/CustomerCard';
import MeasurementForm from '../components/MeasurementForm';
import { getCustomerDetails } from '../services/api';
import { Scissors, Sparkles, UserSearch } from 'lucide-react';

const Dashboard = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectCustomer = async (id) => {
    try {
      const res = await getCustomerDetails(id);
      setSelectedCustomer(res.data.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  return (
    <div>
      <SearchBar
        onSelectCustomer={handleSelectCustomer}
        onOpenNewCustomerModal={() => setIsModalOpen(true)}
      />

      {selectedCustomer ? (
        <CustomerCard
          customerData={selectedCustomer}
          onNewOrder={(id) => alert(`Initiate Bespoke Order for Client ID: ${id}`)}
        />
      ) : (
        <div className="text-center py-24 border border-dashed border-neutral-800 rounded-3xl bg-neutral-900/40 backdrop-blur-sm max-w-3xl mx-auto">
          <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-center text-amber-400 shadow-xl">
            <UserSearch className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No Client Selected</h3>
          <p className="text-sm text-neutral-400 max-w-md mx-auto">
            Search for an existing bespoke client above or click <b>"New Client"</b> to register measurements.
          </p>
        </div>
      )}

      <MeasurementForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCustomerCreated={handleSelectCustomer}
      />
    </div>
  );
};

export default Dashboard;