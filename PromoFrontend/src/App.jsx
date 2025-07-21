import { useState, useEffect } from 'react';
import { PromoTable } from './PromoTable';
import { AddPromoBtn } from './AddPromoBtn';
import './css/App.css';
import { ResetIcon, ExportIcon } from './Icons';
import * as XLSX from "xlsx";

const downloadPromoCSV = (promotions, filename = "promotions.xls") => {
  if (!promotions || promotions.length === 0) {
    console.log("No promotions to download.");
    return;
  }

  const xlData = promotions.map(promo => ({
    promoId: promo.promoId,
    items: promo.items?.map(i => i.name).join(', ') || '',
    stores: promo.stores?.map(s => s.name).join(', ') || '',
    startDate: promo.startDate || '',
    endDate: promo.endDate || '',
    tactic: promo.tactic?.type || ''
  }));


  const worksheet = XLSX.utils.json_to_sheet(xlData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Promotions");
  XLSX.writeFile(workbook, filename);
  console.log(`Excel written to ${filename} is Successfuly Done👍`);
};

const App = () => {
  const [promotions, setPromotions] = useState([]);
  const [addPromoStatus, setAddPromoStatus] = useState(false);
  const [options, setOptions] = useState(null);
  const [sortBy, setSortBy] = useState("promoId");
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchPromotions = async (field = sortBy, order = sortOrder, filters = []) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    try {
      const response = await fetch(`${baseUrl}/api/promotion/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sortBy: field,
          sortOrder: order,
          filters
        })
      });

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

        <div className="add-export-container">
          <AddPromoBtn
            promoStatus={addPromoStatus}
            setAddPromoStatus={setAddPromoStatus}
            onPromoSave={fetchPromotions}
            options={options}
          />
          <button onClick={() => downloadPromoCSV(promotions)}>{ExportIcon}Export</button>
        </div>

        <ResetIcon
          className="reset-btn"
          onClick={() => window.location.reload()}
        />
      </div>

      <PromoTable
        promotions={promotions}
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
