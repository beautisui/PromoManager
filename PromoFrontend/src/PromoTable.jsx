import { useEffect } from 'react';
import './css/PromoTable.css'

const separateByComma = (arr, key = 'name') => arr.map(obj => obj[key]).join(', ');

const PromoRow = ({ promo, onDelete }) => {
    return (
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
};

export const PromoTable = ({ promotions, setPromotions, fetchPromotions }) => {
    console.log("Inside PromoTable ---> ");

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


    useEffect(() => {
        fetch("/api/promotion")
            .then(response => response.json())
            .then(data => setPromotions(data))
            .catch(error => {
                console.error("error during fetching promotions:", error);
            });
    }, []);


    return (
        <table className="promo-table">
            <thead>
                <tr>
                    <th>Promo ID</th>
                    <th>Items</th>
                    <th>Stores</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Tactic</th>
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