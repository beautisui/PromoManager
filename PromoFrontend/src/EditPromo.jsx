import { useState, useEffect, useRef } from 'react';
import ItemSelector from './ItemSelector';
import StoreSelector from './StoreSelector';
import TacticSelector from './TacticSelector';
import DateInput from './DateInput';
import "./css/AddPromo.css";

const areArraysEqual = (a, b) =>
    a.length === b.length && a.every((val, i) => val === b[i]);

const AddIfValueChanged = (changes, key, original, updated) => {
    if (Array.isArray(original) && Array.isArray(updated)) {
        if (!areArraysEqual(original, updated)) {
            changes[key] = updated;
        }
    } else if (original !== updated) {
        changes[key] = updated;
    }
    return changes;
};

const getOriginalPromoDetails = (promo) => {
    const originalItems = promo.items.map(i => i.id);
    const originalStores = promo.stores.map(s => s.id);
    const originalTactic = promo.tactic.tacticId;
    const originalStart = promo.startTime.slice(0, 10);
    const originalEnd = promo.endTime.slice(0, 10);

    return { originalItems, originalStores, originalTactic, originalEnd, originalStart }
}

const EditPromo = ({ promo, items, stores, tactics, onSave, onCancel }) => {
    const [selectedItems, setSelectedItems] = useState(promo.items.map(i => i.id));
    const [selectedStores, setSelectedStores] = useState(promo.stores.map(s => s.id));
    const [selectedTactic, setSelectedTactic] = useState(promo.tactic.tacticId);
    const [startDate, setStartDate] = useState(promo.startTime.slice(0, 10));
    const [endDate, setEndDate] = useState(promo.endTime.slice(0, 10));
    const [isChanged, setIsChanged] = useState(false);
    const [error, setError] = useState('');
    const [missing, setMissing] = useState({});

    const popupRef = useRef();
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                onCancel();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onCancel]);



    useEffect(() => {
        const { originalItems, originalStores, originalTactic, originalEnd, originalStart } = getOriginalPromoDetails(promo);

        const changed =
            !areArraysEqual(selectedItems, originalItems) ||
            !areArraysEqual(selectedStores, originalStores) ||
            selectedTactic !== originalTactic ||
            startDate !== originalStart ||
            endDate !== originalEnd;

        setIsChanged(changed);
    }, [selectedItems, selectedStores, selectedTactic, startDate, endDate, promo]);

    const handleSubmit = () => {
        const missingFields = {
            items: selectedItems.length === 0,
            stores: selectedStores.length === 0,
            tactic: !selectedTactic,
            startDate: !startDate,
            endDate: !endDate
        };

        setMissing(missingFields);
        if (Object.values(missingFields).some(Boolean)) {
            setError('All fields are required.');
            return;
        }
        setError('');
        setMissing({});

        const { originalItems, originalStores, originalTactic, originalEnd, originalStart } = getOriginalPromoDetails(promo);
        const updatedPromo = { promoId: promo.promoId };

        AddIfValueChanged(updatedPromo, 'itemIds', originalItems, selectedItems);
        AddIfValueChanged(updatedPromo, 'storeIds', originalStores, selectedStores);
        AddIfValueChanged(updatedPromo, 'tacticId', originalTactic, selectedTactic);
        AddIfValueChanged(updatedPromo, 'startDate', originalStart, startDate);
        AddIfValueChanged(updatedPromo, 'endDate', originalEnd, endDate);

        onSave(updatedPromo);
        onCancel();
    };

    return (
        <div className="promo-modal-overlay">
            <div className="edit-promo-modal">
                <div className="promo-modal" ref={popupRef}>
                    <h2>Edit Promotion</h2>

                    <div><strong>Promo ID:</strong> {promo.promoId}</div>

                    {error && <div className="field-error" style={{ marginBottom: 8 }}>{error}</div>}
                    <ItemSelector
                        items={items}
                        selectedItems={selectedItems}
                        setSelectedItems={setSelectedItems}
                    />
                    {missing.items && <div className="field-error">Please select at least one item.</div>}


                    <StoreSelector
                        stores={stores}
                        selectedStores={selectedStores}
                        setSelectedStores={setSelectedStores}
                    />
                    {missing.stores && <div className="field-error">Please select at least one store.</div>}


                    <TacticSelector
                        tactics={tactics}
                        selectedTactic={selectedTactic}
                        setSelectedTactic={setSelectedTactic}
                    />
                    {missing.tactic && <div className="field-error">Please select a tactic.</div>}


                    <DateInput
                        label="Start Date"
                        value={startDate}
                        onChange={setStartDate}
                        min={today}
                    />
                    {missing.startDate && <div className="field-error">Please select a start date.</div>}


                    <DateInput
                        label="End Date"
                        value={endDate}
                        onChange={setEndDate}
                        min={startDate}
                    />
                    {missing.endDate && <div className="field-error">Please select an end date.</div>}


                    <div className="btn-group">
                        <button onClick={onCancel}>Cancel</button>
                        <button onClick={handleSubmit} disabled={!isChanged}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditPromo;
