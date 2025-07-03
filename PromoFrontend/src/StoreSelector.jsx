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
            .filter(store => selectedStores.includes(store.id))
            .map(store => store.name)
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