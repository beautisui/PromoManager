import { useState } from 'react';
import { PromoTable } from './PromoTable';
import { AddPromo } from './AddPromo';
import "./App.css"

const App = () => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSavePromotion = (promoData) => {
    console.log("Saving promo:", promoData);
    setShowModal(false);
  };

  return (
    <main>
      <h1>Promo Manager</h1>
      <button className="btn" onClick={handleOpenModal}><span>➕ Add Promotion</span></button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <AddPromo
              items={[
                { Id: 1, Name: 'paper' },
                { Id: 2, Name: 'paper' },
                { Id: 3, Name: 'Ice cream' }
              ]}
              stores={[
                { Id: 1, Name: 'Store1' },
                { Id: 2, Name: 'Store2' },
                { Id: 3, Name: 'Store3' }
              ]}
              tactics={[
                { tacticId: 1, type: '25% off' },
                { tacticId: 2, type: '$1 off' },
                { tacticId: 3, type: 'BOGO free' }
              ]}
              onSave={handleSavePromotion}
              onCancel={handleCloseModal}
            />
          </div>
        </div>
      )}
      <PromoTable />
    </main>
  );
};

export default App;
