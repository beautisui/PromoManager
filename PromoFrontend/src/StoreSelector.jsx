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
        const storeNames = stores
            .filter(store => selectedStores.includes(store.id))
            .map(store => store.name);

        const formattedStores = storeNames.length > 3
            ? `${storeNames.slice(0, 3).join(', ')} ...`
            : storeNames.join(', ');

        return { formattedStores, allStores: storeNames.join(', ') };
    };

    const { formattedStores, allStores } = getStoreNames();

    return (
        <div className="dropdown">
            <label>Stores:</label>
            <div
                className="dropdown-box"
                onClick={() => setShowDropdown(!showDropdown)}
                data-tooltip-id="storeTooltip"
                data-tooltip-content={allStores}
            >
                {formattedStores || 'Select Stores'}
            </div>

            <Tooltip id="storeTooltip" />

            {showDropdown && (
                <div className="dropdown-list">
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
            )}
        </div>
    );
};

export default StoreSelector;