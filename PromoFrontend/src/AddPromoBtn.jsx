import { AddPromo } from './AddPromo';

const addPromoPopup = (handleSavePromotion, closeCreatePromoPopup, options) => {
    return <div className="promo-modal-overlay">
        <div>
            <AddPromo
                items={options.items}
                stores={options.stores}
                tactics={options.tactics}
                onSave={handleSavePromotion}
                onCancel={closeCreatePromoPopup} />
        </div>
    </div>;
};

export const AddPromoBtn = ({ promoStatus, setAddPromoStatus, onPromoSave, options }) => {
    const openCreatePromoPopup = () => setAddPromoStatus(true);
    const closeCreatePromoPopup = () => setAddPromoStatus(false);
    const handleSavePromotion = async (promoData) => {
        try {            
            const baseUrl = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${baseUrl}/api/promotion`, {
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
            {promoStatus ? addPromoPopup(handleSavePromotion, closeCreatePromoPopup, options) : null}
        </>
    );
};