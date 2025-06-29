import { useState } from 'react';
import ItemSelector from './ItemSelector';
import StoreSelector from './StoreSelector';
import TacticSelector from './TacticSelector';
import DateInput from './DateInput';
import "./css/AddPromo.css";

export const AddPromo = ({ items, stores, tactics, onSave, onCancel }) => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedStores, setSelectedStores] = useState([]);
    const [selectedTactic, setSelectedTactic] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const today = new Date().toISOString().split('T')[0];

    const [error, setError] = useState('');
    const [missing, setMissing] = useState({});

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
        onSave({
            itemIds: selectedItems,
            storeIds: selectedStores,
            tacticId: selectedTactic,
            startDate,
            endDate,
        });
    };

    return (
        <div className="promo-modal">
            <h2>Add Promotion</h2>
            {error && <div className="field-error" style={{ marginBottom: 8 }}>{error}</div>}
            <ItemSelector
                items={items}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                error={missing.items}
            />
            {missing.items && <div className="field-error">Please select at least one item.</div>}

            <StoreSelector
                stores={stores}
                selectedStores={selectedStores}
                setSelectedStores={setSelectedStores}
                error={missing.stores}
            />
            {missing.stores && <div className="field-error">Please select at least one store.</div>}

            <TacticSelector
                tactics={tactics}
                selectedTactic={selectedTactic}
                setSelectedTactic={setSelectedTactic}
                error={missing.tactic}
            />
            {missing.tactic && <div className="field-error">Please select a tactic.</div>}

            <DateInput
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                min={today}
                error={missing.startDate}
            />
            {missing.startDate && <div className="field-error">Please select a start date.</div>}

            <DateInput
                label="End Date"
                value={endDate}
                onChange={setEndDate}
                min={startDate}
                error={missing.endDate}
            />
            {missing.endDate && <div className="field-error">Please select an end date.</div>}

            <div className="btn-group">
                <button onClick={onCancel}>Cancel</button>
                <button onClick={handleSubmit}>Save Promotion</button>
            </div>
        </div>
    );
};
