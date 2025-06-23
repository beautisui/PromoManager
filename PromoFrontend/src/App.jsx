import { useState, useEffect } from 'react';
import { PromoTable } from './PromoTable';
import { AddPromoBtn } from './AddPromoBtn';
import './css/App.css';

const App = () => {
  const [promotions, setPromotions] = useState([]);
  const [addPromoStatus, setAddPromoStatus] = useState(false);
  const [options, setOptions] = useState(null);
  const [sortBy, setSortBy] = useState("promoId");
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchPromotions = async (field = sortBy, order = sortOrder) => {
    try {
      const response = await fetch(`/api/promotion?sortBy=${field}&sortOrder=${order}`);
      const data = await response.json();
      setPromotions(data);
    } catch (error) {
      console.error("Failed to fetch promotions:", error);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, [sortBy, sortOrder]);

  useEffect(() => {
    fetch("/api/lookup/availableOptions")
      .then((res) => res.json())
      .then((data) => setOptions(data))
      .catch((err) => console.error("Failed to fetch options", err));
  }, []);



  return (
    <main>
      <h1>Promo Manager</h1>
      {options && (
        <AddPromoBtn
          promoStatus={addPromoStatus}
          setAddPromoStatus={setAddPromoStatus}
          onPromoSave={fetchPromotions}
          options={options}
        />
      )}
      <PromoTable
        promotions={promotions}
        onSave={fetchPromotions}
        sortBy={sortBy}
        sortOrder={sortOrder}
        setSortBy={setSortBy}
        setSortOrder={setSortOrder}
      />
    </main>
  );
};

export default App;
