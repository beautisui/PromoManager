import { useState, useEffect } from 'react';
import './PromoTable.css'

const separateByComma = (arr, key = 'name') => arr.map(obj => obj[key]).join(', ');

const PromoRow = ({ promo }) => {
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
                <button>Delete</button>
            </td>
        </tr>
    );
};

export const PromoTable = () => {
    const [promotions, setPromotions] = useState([]);

    console.log("Inside PromoTable ---> ");

    useEffect(() => {
        fetch("/api/promotion")
            .then(response => response.json())
            .then(data => {
                setPromotions(data);
            })
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
                    <PromoRow key={promo.promoId} promo={promo} />
                ))}
            </tbody>
        </table>
    );
};



/*
  SELECT p.PromoId, p.StartDate, p.EndDate, t.TacticId, t.TacticType, i.ItemId, i.ItemName, s.StoreId, s.StoreName
    FROM Promotions p
    JOIN Tactics t ON p.TacticId = t.TacticId
    JOIN PromoItems pi ON pi.PromoId = p.PromoId
    JOIN Items i ON i.ItemId = pi.ItemId
    JOIN PromoStores ps ON ps.PromoId = p.PromoId
    JOIN Stores s ON s.StoreId = ps.StoreId
    ORDER BY p.PromoId DESC";
*/

/*
SELEECT p.PromoId, p.StartDate, p.EndDate, t.TacticId, t.TacticType
    FROM Promotions p
    JOIN Tactics t ON p.TacticId = t.TacticId
*/

/*
SELECT pi.PromoId, i.ItemId, i.ItemName
    FROM PromoItems pi
    JOIN Items i ON pi.ItemId = i.ItemId;
*/

/*
SELECT 
    ps.PromoId, s.StoreId, s.StoreName
    FROM PromoStores ps
    JOIN Stores s ON ps.StoreId = s.StoreId;
*/