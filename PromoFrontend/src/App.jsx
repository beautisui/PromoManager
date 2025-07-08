import { useState, useEffect } from 'react';
import { PromoTable } from './PromoTable';
import { AddPromoBtn } from './AddPromoBtn';
import './css/App.css';

const ResetIcon = ({ width = "20", height = "20", className = "", onClick }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={width}
    height={height}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    onClick={onClick}
  >
    <path d="M21 2v6h-6" />
    <path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 6.36 2.64L21 8" />
    <path d="M21 12a9 9 0 1 1-9-9" />
  </svg>
);

const App = () => {
  const [promotions, setPromotions] = useState([]);
  const [addPromoStatus, setAddPromoStatus] = useState(false);
  const [options, setOptions] = useState(null);
  const [sortBy, setSortBy] = useState("promoId");
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchPromotions = async (field = sortBy, order = sortOrder) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    try {
      const response = await fetch(`${baseUrl}/api/promotion?sortBy=${field}&sortOrder=${order}`);

      const data = await response.json();
      setPromotions(data);
    } catch (error) {
      console.error("Failed to fetch promotions:", error);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    fetch(`${baseUrl}/api/lookup/availableOptions`)
      .then((res) => res.json())
      .then((data) => setOptions(data))
      .catch((err) => console.error("Failed to fetch options", err));
  }, []);

  return (
    <main>
      <h1>Promo Manager</h1>

      <div className="button-reset-container">
        <AddPromoBtn
          promoStatus={addPromoStatus}
          setAddPromoStatus={setAddPromoStatus}
          onPromoSave={fetchPromotions}
          options={options}
        />

        <ResetIcon
          className="reset-btn"
          onClick={() => window.location.reload()}
        />
      </div>

      <PromoTable
        promotions={promotions}
        setPromotions={setPromotions}
        onSave={fetchPromotions}
        sortBy={sortBy}
        sortOrder={sortOrder}
        setSortBy={setSortBy}
        setSortOrder={setSortOrder}
        options={options}
      />
    </main>
  );
};

export default App;
