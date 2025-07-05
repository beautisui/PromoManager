import { useEffect, useRef } from 'react';
import './css/FilterDropdown.css';
import DateInput from './DateInput';

const FilterDropdown = ({ field, options, onApply, onClose, position, selectedOptions, setSelectedOptions, setActiveFilterField }) => {
    const dropdownRef = useRef(null);

    const currentOptions = selectedOptions[field] || [];

    const handleOptionChange = (option) => {
        setSelectedOptions(prev => ({
            ...prev,
            [field]: prev[field]?.includes(option)
                ? prev[field].filter(o => o !== option)
                : [...(prev[field] || []), option]
        }));
    };

    const handleApply = () => {
        const optionsForField = selectedOptions[field] || [];
        if (optionsForField.length === 0) {
            setSelectedOptions(prev => ({ ...prev, [field]: [] }));
            setActiveFilterField(null);
            onApply(null, []);
            onClose();
            return;
        }
        onApply(field, optionsForField);
        setSelectedOptions(prev => ({ ...prev, [field]: optionsForField }));
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
                        value={currentOptions[0] || ''}
                        onChange={val => setSelectedOptions(prev => ({ ...prev, [field]: [val, currentOptions[1] || ''] }))}
                        max={currentOptions[1]}
                    />
                    <DateInput
                        label="To"
                        value={currentOptions[1] || ''}
                        onChange={val => setSelectedOptions(prev => ({ ...prev, [field]: [currentOptions[0] || '', val] }))}
                        min={currentOptions[0]}
                    />
                </div>
            ) : (
                <ul>
                    {options.map(option => (
                        <li key={option}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={currentOptions.includes(option)}
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
