import './css/PromoTable.css';
import { useState } from 'react';
import FilterDropdown from './FilterDropdown';

const separateByComma = (arr, key = 'name') =>
    arr
        .slice()
        .sort((a, b) => b[key].localeCompare(a[key]))
        .map(obj => obj[key])
        .join(', ');

const PromoRow = ({ promo, onDelete }) => (
    <tr>
        <td>{promo.promoId}</td>
        <td>{separateByComma(promo.items)}</td>
        <td>{separateByComma(promo.stores)}</td>
        <td>{promo.startTime.slice(0, 10)}</td>
        <td>{promo.endTime.slice(0, 10)}</td>
        <td>{promo.tactic.type}</td>
        <td>
            <button>Edit</button>
            <button onClick={() => onDelete(promo.promoId)}>Delete</button>
        </td>
    </tr>
);

export const PromoTable = ({ promotions, setPromotions, onSave, sortBy, sortOrder, setSortBy, setSortOrder }) => {
    const [activeFilterColumn, setActiveFilterColumn] = useState(null);
    const [filterOptions, setFilterOptions] = useState([]);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

    const handleSorting = (field) => {
        if (sortBy === field) {
            setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
            return;
        }
        setSortBy(field);
        setSortOrder("desc");
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

    const extractFilterOptions = async (field) => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        try {
            const response = await fetch(`${baseUrl}/api/lookup/availableOptions`);
            if (!response.ok) throw new Error("Failed to fetch filter options");
            const data = await response.json();

            switch (field) {
                case 'promoId':
                    const promoIdResponse = await fetch(`${baseUrl}/api/lookup/promoIds`);
                    const promoIds = await promoIdResponse.json();
                    return promoIds.map(id => id.toString());
                case 'items':
                    return data.items.map(i => i.Name);
                case 'stores':
                    return data.stores.map(s => s.Name);
                case 'tactic':
                    return data.tactics.map(t => t.Type);
                default:
                    return [];
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

    const handleApplyFilter = async (field, selectedOptions) => {
        console.log("Final selected filters for", field, "=>", selectedOptions);

        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL;
            const queryParams = selectedOptions.map(encodeURIComponent).join(',');
            const url = `${baseUrl}/api/promotion/filter?field=${field}&values=${queryParams}`;
            const response = await fetch(url);

            if (!response.ok) throw new Error(`Failed during applying filter on ${field}`);

            const data = await response.json();
            setPromotions(data);
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
            <table className="promo-table">
                <thead>
                    <tr>
                        <th>
                            <span onClick={() => handleSorting("promoId")}>Promo ID{renderSortIndicator("promoId")}</span>
                            <span onClick={(e) => handleFilterClick("promoId", e)}>☰</span>
                        </th>
                        <th>
                            <span onClick={() => handleSorting("items")}>Items{renderSortIndicator("items")}</span>
                            <span onClick={(e) => handleFilterClick("items", e)}>☰</span>
                        </th>
                        <th>
                            <span onClick={() => handleSorting("stores")}>Stores{renderSortIndicator("stores")}</span>
                            <span onClick={(e) => handleFilterClick("stores", e)}>☰</span>
                        </th>
                        <th>
                            <span onClick={() => handleSorting("startTime")}>Start Date{renderSortIndicator("startTime")}</span>
                            <span onClick={(e) => handleFilterClick("startTime", e)}>☰</span>
                        </th>
                        <th>
                            <span onClick={() => handleSorting("endTime")}>End Date{renderSortIndicator("endTime")}</span>
                            <span onClick={(e) => handleFilterClick("endTime", e)}>☰</span>
                        </th>
                        <th>
                            <span onClick={() => handleSorting("tactic")}>Tactic{renderSortIndicator("tactic")}</span>
                            <span onClick={(e) => handleFilterClick("tactic", e)}>☰</span>
                        </th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {promotions.map(promo => (
                        <PromoRow key={promo.promoId} promo={promo} onDelete={() => handleDeletePromo(promo.promoId)} />
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
                />
            )}
        </>
    );
};
