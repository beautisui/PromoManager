import { useState } from 'react';

const dbg = (x) => {
    console.log("--------------------->", x);
    return x;
}

const ItemSelector = ({ items, selectedItems, setSelectedItems }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleItem = (id) => {
        setSelectedItems(prev =>
            dbg(prev).includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const getItemNames = () => {
        return items
            .filter(item => selectedItems.includes(item.Id))
            .map(item => item.Name)
            .join(', ');
    };

    return (
        <div className="dropdown">
            <label>Items:</label>
            <div className="dropdown-box" onClick={() => setShowDropdown(!showDropdown)}>
                {getItemNames() || "Select Items"}
            </div>
            {showDropdown ? (
                <div className="dropdown-list">
                    {items.map(item => (
                        <div key={item.Id}>
                            <input
                                type="checkbox"
                                id={`item-${item.Id}`}
                                checked={selectedItems.includes(item.Id)}
                                onChange={() => toggleItem(item.Id)}
                            />
                            <label htmlFor={`item-${item.Id}`}>{item.Name}</label>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
};

export default ItemSelector;
