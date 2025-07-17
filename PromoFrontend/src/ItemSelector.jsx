import { useState } from 'react';
import { Tooltip } from 'react-tooltip';

const ItemSelector = ({ items, selectedItems, setSelectedItems }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleItem = (id) => {
        setSelectedItems(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const getItemNames = () => {
        return items
            .filter(item => selectedItems.includes(item.id))
            .map(item => item.name)
            .join(', ');
    };

    const handleSelectAll = () => {
        if (selectedItems.length === items.length) {
            setSelectedItems([]);
            return;
        }
        setSelectedItems(items.map(i => i.id));
    };

    return (
        <div className="dropdown">
            <label>Items:</label>

            <div
                className="dropdown-box"
                onClick={() => setShowDropdown(!showDropdown)}
                data-tooltip-id="itemTooltip"
                data-tooltip-content={getItemNames() || "Select Items"}
            >
                {getItemNames() || "Select Items"}
            </div>
            <Tooltip id="itemTooltip" />

            {showDropdown && (
                <div className="dropdown-list">
                    <div key="select-all">
                        <input
                            type="checkbox"
                            id="select-all"
                            checked={selectedItems.length === items.length && items.length > 0}
                            onChange={handleSelectAll}
                        />
                        <label htmlFor="select-all">Select All</label>
                    </div>

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
            )}
        </div>
    );
};

export default ItemSelector;