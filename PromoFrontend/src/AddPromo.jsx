import { useState } from 'react';
import "./AddPromo.css";
import ItemSelector from './ItemSelector';
import StoreSelector from './StoreSelector';
import TacticSelector from './TacticSelector';
import DateInput from './DateInput';

export const AddPromo = ({ items, stores, tactics, onSave, onCancel }) => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedStores, setSelectedStores] = useState([]);
    const [selectedTactic, setSelectedTactic] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = () => {
        onSave({
            items: selectedItems,
            stores: selectedStores,
            tacticId: selectedTactic,
            startDate,
            endDate,
        });
    };

    return (
        <div className="modal">
            <h2>Add Promotion</h2>

            <ItemSelector
                items={items}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
            />

            <StoreSelector
                stores={stores}
                selectedStores={selectedStores}
                setSelectedStores={setSelectedStores}
            />

            <TacticSelector
                tactics={tactics}
                selectedTactic={selectedTactic}
                setSelectedTactic={setSelectedTactic}
            />

            <DateInput label="Start Date" value={startDate} onChange={setStartDate} />
            <DateInput label="End Date" value={endDate} onChange={setEndDate} />

            <button onClick={onCancel}>Cancel</button>
            <button onClick={handleSubmit}>Save Promotion</button>
        </div>
    );
};