import { useState, useEffect } from 'react';

const separateByComma = (arr, key = 'name') => arr.map(obj => obj[key]).join(', ');

const PromoRow = ({ promo }) => {
    return (
        <tr>
            <td>{promo.promoId}</td>
            <td>{separateByComma(promo.items)}</td>
            <td>{separateByComma(promo.stores)}</td>
            <td>{promo.startTime}</td>
            <td>{promo.endTime}</td>
            <td>{separateByComma(promo.tactic, 'tactic')}</td>
            <td>
                <button>Edit</button>
                <button>Delete</button>
            </td>
        </tr>
    );
};

const getDummyPromotions = () => {
    return [
        {
            promoId: 1,
            items: [{ id: 1, name: 'Pen' }, { id: 2, name: 'Pencil' }],
            stores: [{ id: 1, name: 'store1' }, { id: 2, name: 'store2' }],
            startTime: '2025-06-20',
            endTime: '2025-06-30',
            tactic: [{ tacticId: 1, tactic: 'BOGO Free' }],
        },
        {
            promoId: 2,
            items: [{ id: 1, name: 'Ice cream' }, { id: 2, name: 'Paper' }],
            stores: [{ id: 1, name: 'store5' }, { id: 2, name: 'store1' }],
            startTime: '2025-06-20',
            endTime: '2025-06-30',
            tactic: [{ tacticId: 1, tactic: 'BOGO Free' }],
        },
    ];
}

export const PromoTable = () => {

    const [promotions, setPromotions] = useState([]);

    useEffect(() => {
        setPromotions(getDummyPromotions());
    }, []);

    return (
        <table border="1" cellPadding="10">
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

