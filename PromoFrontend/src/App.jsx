import { useState, useEffect } from 'react';
import { PromoTable } from './PromoTable';
import { AddPromoBtn } from './AddPromoBtn';
import './css/App.css';
import { ResetIcon, ExportIcon } from './Icons';

const downloadPromoCSV = (promotions, filename = "promotions.csv") => {
  if (!promotions || promotions.length === 0) {
    console.log("No promotions to download.");
    return;
  }

  console.log(promotions);

  const headers = Object.keys(promotions[0]);

  const csvRows = [];

  csvRows.push(headers.join(','));

  for (const promo of promotions) {
    const values = headers.map(header => {
      let val = promo[header];

      if ((header === "items" || header === "stores") && Array.isArray(val)) {
        val = val.map(i => i.name).join(', ');
      }
      else if (header === "tactic" && val && typeof val === 'object') {
        console.log('here it should come >>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        
        val = val.type;
      }

      if (val == null) val = "";

      return `"${String(val).replace(/"/g, '""')}"`;
    });

    csvRows.push(values.join(','));
  }

  const csvContent = csvRows.join('\n');

  console.log(`CSV written to ${filename}`);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
