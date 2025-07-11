import { useState } from 'react';
import FilterDropdown from './FilterDropdown';
import EditPromo from './EditPromo';
import './css/PromoTable.css';
import { FilterIcon } from './Icons';

const createFilterBody = (selectedOptions) => {
    return Object.entries(selectedOptions)
        .filter(([field, values]) => field && field !== "null" && values && values.length > 0)
        .map(([field, values]) => ({
            field,
            values
        }));
};

const separateByComma = (arr, key = 'name') =>
    arr
        .slice()
        .sort((a, b) => b[key].localeCompare(a[key]))
        .map(obj => obj[key])
        .join(', ');

const extractFilterOptions = async (field) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    try {
        if (field === 'startDate' || field === 'endDate') return;

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

const PromoRow = ({ promo, onDelete, onEdit }) => (
    <tr>
        <td>{promo.promoId}</td>
        <td>{separateByComma(promo.items)}</td>
        <td>{separateByComma(promo.stores)}</td>
        <td>{promo.startDate.slice(0, 10)}</td>
        <td>{promo.endDate.slice(0, 10)}</td>
        <td>{promo.tactic.type}</td>
        <td>
            <button onClick={() => onEdit(promo)}>Edit</button>
            <button onClick={() => {
                const confirmDelete = window.confirm("Are you sure to delete the selected promotion?");
                if (confirmDelete) {
                    onDelete(promo.promoId);
                }
            }}>Delete</button>
        </td>
    </tr>
);

export const PromoTable = ({
    promotions,
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
    const [selectedOptions, setSelectedOptions] = useState({});
    const [tempSelectedOptions, setTempSelectedOptions] = useState({});
    const [editPromo, setEditPromo] = useState(null);

    const handleSorting = async (field) => {
        const newSortOrder = (sortBy === field && sortOrder === "desc") ? "asc" : "desc";
        setSortBy(field);
        setSortOrder(newSortOrder);

        if (Object.keys(selectedOptions).length === 0) {
            onSave(field, newSortOrder);
            return;
        }

        onSave(field, newSortOrder, createFilterBody(selectedOptions));
    }

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

            console.log("Updating promo:", updatedPromo);
            const res = await fetch(`${baseUrl}/api/promotion`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedPromo),
            });

            if (!res.ok) throw new Error("Failed to update promo");

            setEditPromo(null);
            onSave(sortBy, sortOrder, createFilterBody(selectedOptions));

        } catch (err) {
            console.error("Edit save failed:", err);
        }
    };

    const handleFilterClick = async (field, e) => {
        const options = await extractFilterOptions(field);
        const rect = e.target.getBoundingClientRect();
        setDropdownPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
        setFilterOptions(options);
        setActiveFilterColumn(field);
        setTempSelectedOptions(prev => ({
            ...prev,
            [field]: selectedOptions[field] || []
        }));
    };

    const handleApplyFilter = async (field, optionsSelected) => {
        if (!field || !optionsSelected || optionsSelected.length === 0) {
            setSelectedOptions(prev => {
                const updated = { ...prev };
                delete updated[field];
                return updated;
            });
            onSave(sortBy, sortOrder, createFilterBody(tempSelectedOptions));
            return;
        }

        try {
            setSelectedOptions(prev => ({ ...prev, [field]: optionsSelected }));

            onSave(sortBy, sortOrder, createFilterBody({
                ...selectedOptions,
                [field]: optionsSelected
            }));

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

            {Object.values(selectedOptions).some(v => v && v.length > 0) && (
                <div className="active-filter-info">
                    Filtering based on: <strong>
                        {Object.entries(selectedOptions)
                            .filter(([k, v]) => v && v.length > 0)
                            .map(([k]) => k)
                            .join(", ")}
                    </strong>
                </div>
            )}


            <table className="promo-table">
                <thead>
                    <tr>
                        {["promoId", "items", "stores", "startDate", "endDate", "tactic"].map(field => (
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
                    onClose={() => setActiveFilterColumn(null)}
                    position={dropdownPosition}
                    setSelectedOptions={setSelectedOptions}
                    tempSelectedOptions={tempSelectedOptions}
                    setTempSelectedOptions={setTempSelectedOptions}
                />

            )}
        </>
    );

}