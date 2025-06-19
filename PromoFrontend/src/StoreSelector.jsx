import { useState } from 'react';

const StoreSelector = ({ stores, selectedStores, setSelectedStores }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleStore = (id) => {
        setSelectedStores(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const getStoreNames = () => {
        return stores
            .filter(store => selectedStores.includes(store.Id))
            .map(store => store.Name)
            .join(', ');
    };

    return (
        <div className="dropdown">
            <label>Stores:</label>
            <div className="dropdown-box" onClick={() => setShowDropdown(!showDropdown)}>
                {getStoreNames() || 'Select Stores'}
            </div>
            {showDropdown && (
                <div className="dropdown-list">
                    {stores.map(store => (
                        <div key={store.Id}>
                            <input
                                type="checkbox"
                                id={`store-${store.Id}`}
                                checked={selectedStores.includes(store.Id)}
                                onChange={() => toggleStore(store.Id)}
                            />
                            <label htmlFor={`store-${store.Id}`}>{store.Name}</label>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StoreSelector;