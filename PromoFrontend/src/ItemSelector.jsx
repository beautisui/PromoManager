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
        const itemNames = items
            .filter(item => selectedItems.includes(item.id))
            .map(item => item.name)


        const formatedItems = itemNames.length > 3
            ? `${itemNames.slice(0, 3).join(', ')} ...`
            : itemNames.join(', ');


        return { formatedItems, allItems: itemNames }
    };

    const { formatedItems, allItems } = getItemNames();

    return (
        <div className="dropdown">
            <label>Items:</label>

            <div className="dropdown-box"
                onClick={() => setShowDropdown(!showDropdown)}
                data-tooltip-id="itemTooltip"
                data-tooltip-content={allItems}
            >
                {formatedItems || "Select Items"}
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
