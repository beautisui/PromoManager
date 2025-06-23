import { useState, useEffect } from 'react';
import './css/PromoTable.css';

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

export const PromoTable = () => {
    const [promotions, setPromotions] = useState([]);
    const [sortBy, setSortBy] = useState("promoId");
    const [sortOrder, setSortOrder] = useState("desc");

    const handleDelete = async (promoId) => {
        try {
            const res = await fetch(`/api/promotion/${promoId}`, {
                method: "DELETE"
            });

            if (!res.ok) throw new Error("Failed to delete promotion");
            await fetchPromotions();

        } catch (err) {
            console.error("Delete error:", err);
        }
    };


    const fetchPromotions = async (sortField = sortBy, order = sortOrder) => {
        const response = await fetch(`/api/promotion?sortBy=${sortField}&sortOrder=${order}`);
        const data = await response.json();
        setPromotions(data);
    };

    useEffect(() => {
        fetchPromotions();
    }, [sortBy, sortOrder]);

    const handleHeaderClick = (field) => {
        if (sortBy === field) {
            setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
            return;
        }

        setSortBy(field);
        setSortOrder("desc");
    };

    return (
        <table className="promo-table">
            <thead>
                <tr>
                    <th onClick={() => handleHeaderClick("promoId")}>Promo ID</th>
                    <th onClick={() => handleHeaderClick("items")}>Items</th>
                    <th onClick={() => handleHeaderClick("stores")}>Stores</th>
                    <th onClick={() => handleHeaderClick("startTime")}>Start Date</th>
                    <th onClick={() => handleHeaderClick("endTime")}>End Date</th>
                    <th onClick={() => handleHeaderClick("tactic")}>Tactic</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {promotions.map(promo => (
                    <PromoRow key={promo.promoId} promo={promo} onDelete={handleDelete} />

                ))}
            </tbody>
        </table>
    );
};
