import { AddPromo } from './AddPromo';

const addPromoPopup = (handleSavePromotion, closeCreatePromoPopup) => {
    return <div className="promo-modal-overlay">
        <div className="promo-modal">
            <AddPromo
                items={[
                    { Id: 1, Name: 'Pen' },
                    { Id: 2, Name: 'Pencil' },
                    { Id: 3, Name: 'Notebook' }
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
                onCancel={closeCreatePromoPopup} />
        </div>
    </div>;
};

export const AddPromoBtn = ({ promoStatus, setAddPromoStatus, onPromoSave }) => {
    const openCreatePromoPopup = () => setAddPromoStatus(true);
    const closeCreatePromoPopup = () => setAddPromoStatus(false);
    const handleSavePromotion = async (promoData) => {
        try {
            const response = await fetch("/api/promotion", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(promoData)
            });

            if (!response.ok) {
                throw new Error("Failed to save promotion");
            }
            setAddPromoStatus(false);

            if (onPromoSave) {
                onPromoSave();
            }

        }
        catch (err) {
            console.error("error => ", err.message);
        }
    };


    return (
        <>
            <button className="btn" onClick={openCreatePromoPopup}>
                <span>➕ Add Promotion</span>
            </button>
            {promoStatus ? addPromoPopup(handleSavePromotion, closeCreatePromoPopup) : null}
        </>
    );
};
