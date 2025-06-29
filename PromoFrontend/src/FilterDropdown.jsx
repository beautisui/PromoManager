import { useState, useEffect, useRef } from 'react';
import './css/FilterDropdown.css';

const FilterDropdown = ({ field, options, onApply, onClose, position }) => {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const dropdownRef = useRef(null);


    const handleOptionChange = (option) => {
        setSelectedOptions(prev =>
            prev.includes(option)
                ? prev.filter(o => o !== option)
                : [...prev, option]
        );
    };

    const handleApply = () => {
        console.log("Applied filters for", field, "=>", selectedOptions);
        onApply(field, selectedOptions);
        onClose();
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            console.log("dropdownRef.current", dropdownRef.current);
            console.log("dropdownRef.current.contains(e.target)", dropdownRef.current.contains(e.target));

            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                onClose();
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div
            className="filter-dropdown"
            ref={dropdownRef}
            style={{ top: position.top, left: position.left }}
        >
            <h4>Filter {field}</h4>
            {field === 'startTime' || field === 'endTime' ? (
                <div>
                    <label>
                        From:
                        <input
                            type="date"
                            onChange={(e) =>
                                setSelectedOptions([e.target.value, selectedOptions[1] || ""])
                            }
                        />
                    </label>
                    <label>
                        To:
                        <input
                            type="date"
                            onChange={(e) =>
                                setSelectedOptions([selectedOptions[0] || "", e.target.value])
                            }
                        />
                    </label>
                </div>
            ) : (
                <ul>
                    {options.map(option => (
                        <li key={option}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedOptions.includes(option)}
                                    onChange={() => handleOptionChange(option)}
                                />
                                {option}
                            </label>
                        </li>
                    ))}
                </ul>
            )}
            <div className="dropdown-actions">
                <button onClick={onClose}>Cancel</button>
                <button onClick={handleApply}>Apply</button>
            </div>
        </div>
    );
};

export default FilterDropdown;
