import { useState, useEffect } from 'react';
import { PromoTable } from './PromoTable';
import { AddPromoBtn } from './AddPromoBtn';
import "./css/App.css"

const App = () => {
  const [promotions, setPromotions] = useState([]);
  const [addPromoStatus, setAddPromoStatus] = useState(false);
  const [options, setOptions] = useState(null);

  const fetchPromotions = async () => {
    const response = await fetch("/api/promotion");
    const data = await response.json();
    setPromotions(data);
  };

  useEffect(() => {
    fetch("/api/lookup/availableOptions")
      .then((res) => res.json())
      .then((data) => setOptions(data))
      .catch((err) => console.error("Failed to fetch options", err));
  }, []);


  useEffect(() => {
    fetchPromotions();
  }, []);

  return (
    <main>
      <h1>Promo Manager</h1>
      <AddPromoBtn
        promoStatus={addPromoStatus}
        setAddPromoStatus={setAddPromoStatus}
        onPromoSave={fetchPromotions}
        options={options}
      />
      <PromoTable
        promotions={promotions}
        setPromotions={setPromotions}
        fetchPromotions={fetchPromotions} />
    </main >
  );
};

export default App;