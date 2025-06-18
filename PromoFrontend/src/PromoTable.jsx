import { useState, useEffect } from 'react';

export const PromoTable = () => {
    const [promotions, setPromotions] = useState([]);

    useEffect(() => {
        fetch('/api/promotion')
            .then((res) => res.json())
            .then((data) => setPromotions(data))
            .catch((err) => console.error('Error fetching data:', err));
    }, []);

    return (
        <table border="1" cellPadding="10">
            <thead>
                <tr>
                    <th>Promo ID</th>
                    <th>Item</th>
                    <th>Store</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Tactic</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {promotions.map((promo) => (
                    <tr key={promo.promoId}>
                        <td>{promo.promoId}</td>
                        <td>{promo.item}</td>
                        <td>{promo.store}</td>
                        <td>{promo.startDate.slice(0, 10)}</td>
                        <td>{promo.endDate.slice(0, 10)}</td>
                        <td>{promo.tactic}</td>
                        <td>
                            <button>Edit</button>
                            <button>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
