import { useState } from 'react';
import { Tooltip } from 'react-tooltip';

const StoreSelector = ({ stores, selectedStores, setSelectedStores }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleStore = (id) => {
        setSelectedStores(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const getStoreNames = () => {
        return stores
            .filter(store => selectedStores.includes(store.id))
            .map(store => store.name)
            .join(', ');
    };

    const handleSelectAll = () => {
        if (selectedStores.length === stores.length) {
            setSelectedStores([]);
            return;
        }
        setSelectedStores(stores.map(s => s.id));
    }

    return (
        <div className="dropdown">
            <label>Stores:</label>
            <div
                className="dropdown-box"
                onClick={() => setShowDropdown(!showDropdown)}
                data-tooltip-id="storeTooltip"
                data-tooltip-content={getStoreNames()}
            >
                {getStoreNames() || 'Select Stores'}
            </div>

            <Tooltip id="storeTooltip" />

            {showDropdown && (
                <div className="dropdown-list">
                    <div key="select-all">
                        <input type='checkbox'
                            id='select-all'
                            checked={selectedStores.length === stores.length && stores.length > 0}
                            onChange={handleSelectAll}
                        />
                        <label htmlFor="select-all">Select All</label>
                    </div>

                    {stores.map(store => (
                        <div key={store.id}>
                            <input
                                type="checkbox"
                                id={`store-${store.id}`}
                                checked={selectedStores.includes(store.id)}
                                onChange={() => toggleStore(store.id)}
                            />
                            <label htmlFor={`store-${store.id}`}>{store.name}</label>
                        </div>
                    ))}
                </div>
            )
            }
        </div >
    );
};

export default StoreSelector;