import { useState } from 'react';
import FilterDropdown from './FilterDropdown';
import EditPromo from './EditPromo';
import './css/PromoTable.css';

const FilterIcon = ({ className = "" }) => (
    <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        height="24"
        width="24"
        fill="currentColor"
        viewBox="0 0 24 24"
    >
        <path d="M3 4h18l-7 10v5l-4 2v-7L3 4z" />
    </svg>
);

const separateByComma = (arr, key = 'name') =>
    arr
        .slice()
        .sort((a, b) => b[key].localeCompare(a[key]))
        .map(obj => obj[key])
        .join(', ');

const PromoRow = ({ promo, onDelete, onEdit }) => (
    <tr>
        <td>{promo.promoId}</td>
        <td>{separateByComma(promo.items)}</td>
        <td>{separateByComma(promo.stores)}</td>
        <td>{promo.startTime.slice(0, 10)}</td>
        <td>{promo.endTime.slice(0, 10)}</td>
        <td>{promo.tactic.type}</td>
        <td>
            <button onClick={() => onEdit(promo)}>Edit</button>
            <button onClick={() => onDelete(promo.promoId)}>Delete</button>
        </td>
    </tr>
);

export const PromoTable = ({
    promotions,
    setPromotions,
    onSave,
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
    options
}) => {
    const [activeFilterColumn, setActiveFilterColumn] = useState(null);
    const [filterOptions, setFilterOptions] = useState([]);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [activeFilterField, setActiveFilterField] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [editPromo, setEditPromo] = useState(null);

    const handleSorting = async (field) => {
        const newSortOrder = (sortBy === field && sortOrder === "desc") ? "asc" : "desc";
        setSortBy(field);
        setSortOrder(newSortOrder);

        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        if (!activeFilterField) {
            onSave(field, newSortOrder);
            return;
        }

        try {
            const optionsForField = selectedOptions[activeFilterField] || [];
            const queryParams = optionsForField.map(encodeURIComponent).join(',');

            const url = `${baseUrl}/api/promotion/filter?field=${activeFilterField}&values=${queryParams}&sortBy=${field}&sortOrder=${newSortOrder}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to sort on ${field}`);
            const data = await response.json();
            setPromotions(data);
        } catch (error) {
            console.error("Error in filtered sorting:", error);
        }
    };

    const handleDeletePromo = async (promoId) => {
        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL;
            const res = await fetch(`${baseUrl}/api/promotion/${promoId}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Delete failed");
            onSave();
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    const handleEditSave = async (updatedPromo) => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        try {
            const res = await fetch(`${baseUrl}/api/promotion`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedPromo),
            });

            if (!res.ok) throw new Error("Failed to update promo");

            setEditPromo(null);
            onSave();
        } catch (err) {
            console.error("Edit save failed:", err);
        }
    };

    const extractFilterOptions = async (field) => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        try {
            if (field === 'startTime' || field === 'endTime') return;
            const response = await fetch(`${baseUrl}/api/lookup/filterOptions?field=${field}`);
            if (!response.ok) throw new Error("Failed to fetch filter options");

            const options = await response.json();
            switch (field) {
                case 'promoId': return options.map(o => o.id.toString());
                case 'items': return options.map(i => i.name);
                case 'stores': return options.map(s => s.name);
                case 'tactic': return options.map(t => t.type);
                default: return [];
            }
        } catch (error) {
            console.error("Error fetching filter options:", error);
            return [];
        }
    };

    const handleFilterClick = async (field, e) => {
        const options = await extractFilterOptions(field);
        const rect = e.target.getBoundingClientRect();
        setDropdownPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
        setFilterOptions(options);
        setActiveFilterColumn(field);
    };

    const handleApplyFilter = async (field, optionsSelected) => {
        if (!field || !optionsSelected || optionsSelected.length === 0) {
            setActiveFilterField(null);
            setSelectedOptions(prev => ({ ...prev, [field]: [] }));
            onSave();
            return;
        }
        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL;
            const queryParams = optionsSelected.map(encodeURIComponent).join(',');
            const url = `${baseUrl}/api/promotion/filter?field=${field}&values=${queryParams}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed during applying filter on ${field}`);
            const data = await response.json();
            setPromotions(data);
            setActiveFilterField(field);
            setSelectedOptions(prev => ({ ...prev, [field]: optionsSelected }));
        } catch (error) {
            console.error("Error applying filter:", error);
        }
    };

    const renderSortIndicator = (field) => {
        if (sortBy !== field) return '';
        return sortOrder === 'asc' ? ' 🔼 ' : ' 🔽 ';
    };

    return (
        <>
            {editPromo && (
                <EditPromo
                    promo={editPromo}
                    items={options?.items}
                    stores={options?.stores}
                    tactics={options?.tactics}
                    onSave={handleEditSave}
                    onCancel={() => setEditPromo(null)}
                />
            )}

            {activeFilterField && (
                <div className="active-filter-info">
                    Filtering based on: <strong>{activeFilterField}</strong>
                </div>
            )}

            <table className="promo-table">
                <thead>
                    <tr>
                        {["promoId", "items", "stores", "startTime", "endTime", "tactic"].map(field => (
                            <th key={field}>
                                <span onClick={() => handleSorting(field)}>
                                    {field.charAt(0).toUpperCase() + field.slice(1)}
                                    {renderSortIndicator(field)}
                                </span>
                                <span onClick={(e) => handleFilterClick(field, e)}>
                                    <FilterIcon className="my-filter-icon" />
                                </span>
                            </th>
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {promotions.map(promo => (
                        <PromoRow
                            key={promo.promoId}
                            promo={promo}
                            onDelete={() => handleDeletePromo(promo.promoId)}
                            onEdit={setEditPromo}
                        />
                    ))}
                </tbody>
            </table>

            {activeFilterColumn && (
                <FilterDropdown
                    field={activeFilterColumn}
                    options={filterOptions}
                    onApply={handleApplyFilter}
                    onClose={() => { setActiveFilterColumn(null); }}
                    position={dropdownPosition}
                    selectedOptions={selectedOptions}
                    setSelectedOptions={setSelectedOptions}
                    setActiveFilterField={setActiveFilterField}
                />
            )}
        </>
    );
};
