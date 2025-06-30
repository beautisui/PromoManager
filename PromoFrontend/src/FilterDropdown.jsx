import { useState, useEffect, useRef } from 'react';
import './css/FilterDropdown.css';
import DateInput from './DateInput';

const FilterDropdown = ({ field, options, onApply, onClose, position }) => {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const dropdownRef = useRef(null);

    console.log(selectedOptions, "selectedOptions in FilterDropdown");


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
                    <DateInput
                        label="From"
                        value={selectedOptions[0] || ''}
                        onChange={val => setSelectedOptions([val, selectedOptions[1] || ''])}
                        max={selectedOptions[1]}
                    />
                    <DateInput
                        label="To"
                        value={selectedOptions[1] || ''}
                        onChange={val => setSelectedOptions([selectedOptions[0] || '', val])}
                        min={selectedOptions[0]}
                    />
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
