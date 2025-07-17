import { useState } from 'react';
import { Tooltip } from 'react-tooltip';

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
            .filter(item => selectedItems.includes(item.id))
            .map(item => item.name)
            .join(', ');
    };

    return (
        <div className="dropdown">
            <label>Items:</label>

            <div className="dropdown-box"
                onClick={() => setShowDropdown(!showDropdown)}
                data-tooltip-id="itemTooltip"
                data-tooltip-content={getItemNames()}
            >
                {getItemNames() || "Select Items"}
            </div>
            <Tooltip id="itemTooltip" />

            {showDropdown ? (
                <div className="dropdown-list">
                    {items.map(item => (
                        <div key={item.id}>
                            <input
                                type="checkbox"
                                id={`item-${item.id}`}
                                checked={selectedItems.includes(item.id)}
                                onChange={() => toggleItem(item.id)}
                            />
                            <label htmlFor={`item-${item.id}`}>{item.name}</label>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
};

export default ItemSelector;
