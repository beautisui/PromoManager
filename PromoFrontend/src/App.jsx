import { useState, useEffect } from 'react';
import { PromoTable } from './PromoTable';
import { AddPromoBtn } from './AddPromoBtn';
import "./css/App.css"

const App = () => {
  const [promotions, setPromotions] = useState([]);
  const [addPromoStatus, setAddPromoStatus] = useState(false);

  const fetchPromotions = async () => {
    const response = await fetch("/api/promotion");
    const data = await response.json();
    setPromotions(data);
  };

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
      />
      <PromoTable
        promotions={promotions}
        setPromotions={setPromotions} />
    </main >
  );
};

export default App;