# Promotion Management System

A simple web application for managing product promotions, allowing users to view, add, edit, short and delete promotion details.

## Features

* **View Promotions:** Display a tabular list of all existing promotions, including Promo ID, Item, Store, Start Date, End Date, and Tactic.
* **Add Promotion:** Create new promotion entries with specified details.
* **Edit Promotion:** Modify existing promotion details.
* **Delete Promotion:** Remove promotions from the system.
* **Column base sorting:** By Default, the table data will be stored in the descending order of the promo ID.

## Technologies Used

* **Backend:** C# (.NET)
    * Architecture: MVC with Controller -> Service -> Repository pattern
    * Testing: NUnit (Test-Driven Development)
* **Database:** SQLite
* **Frontend:** (css, vite, js, react)

## Getting Started

### Prerequisites

* .NET SDK (version 8)
* (Any specific frontend build tools if applicable, e.g., Node.js/npm)

## API Endpoints

| **Path**             | **Method** | **Description**              |
|----------------------|------------|------------------------------|
| `/api/promotion`     | `GET`      | Retrieve all promotions      |
| `/api/promotion`     | `POST`     | Create a new promotion       |
| `/api/promotion/{id}` | `PATCH`    | Update an existing promotion |
| `/api/promotion/{id}` | `DELETE`   | Delete a promotion           |


## Testing

* Run backend unit tests: `dotnet test` (from the test project directory)

## Future Enhancements

* User authentication and authorization (User ID integration).

-------

Here is the **Acceptance Criteria** from the image in text format:

---

**Acceptance Criteria:**

1. Display a list view of all promotions
2. List of columns:
   a. Promo ID
   b. Item (Items can be more than one)
   c. Store(Store can be more than one)
   d. Start date
   e. End date
   f. Tactic
   g. Action (Edit, Delete)
3. Default sorting to be done by Promo ID (Descending)
4. Sorting and Filtering to be support for each column

---


---
## **_STEPS_**

### 1. Create an ASP.NET Core MVC Project
- Use `dotnet new mvc` or create a new MVC project.
---

### 2. Backend Implementation
- Add data in Db by curl request
---

### 4. Frontend Implementation
- Assume some fake data is present and try to render the data in a Tabular form.


# 📋 Promotions Database Design

## 🟦 Promo Table

| Column     | Example   |
|------------|-----------|
| PromoID    | 1         |
| StartDate  | 11-11-25  |
| EndDate    | 11-12-25  |
| TacticID   | 2         |

---

## 🟦 Store Table

| Column     | Example     |
|------------|-------------|
| StoreID    | 1           |
| StoreName  | Store 1     |
|            | 2 - Store 2 |

---

## 🟦 Item Table

| Column     | Example     |
|------------|-------------|
| ItemID     | 1           |
| ItemName   | Pen         |
|            | 2 - Paper   |

---

## 🟦 Tactic Table

| Column     | TacticType     |
|------------|----------------|
| 1          | 25% off        |
| 2          | 1$ off         |
| 3          | BOGO Free      |

---

## 🟦 PromoStore Table

| PromoID | StoreID |
|---------|---------|
| 1       | 2       |
| 1       | 3       |
| 2       | 1       |

---

## 🟦 PromoItem Table

| PromoID | ItemID |
|---------|--------|
| 2       | 3      |
| 3       | 1      |
| 1       | 1      |



# PromoManager - Promotion Creation Flow

## Steps

- Modified the `Promotions` table structure to support normalization.
- Created `PromoStore` and `PromoItem` tables to handle many-to-many relationships.
- Created a DTO (Data Transfer Object) to receive data from the frontend.
- Added supporting API endpoints to fetch required IDs.

---

## API Endpoints

| Method | Path                  | Description                       |
|--------|-----------------------|-----------------------------------|
| GET    | `/api/lookup/items`   | Fetches list of available items   |
| GET    | `/api/lookup/stores`  | Fetches list of available stores  |
| GET    | `/api/lookup/tactics` | Fetches list of promotion tactics |

---

## Example Request Payload

This is the data format expected from the frontend when creating a promotion:

```json
{
  "itemIds": [1, 2, 3],
  "storeIds": [2, 4],
  "startDate": "2025-06-20T00:00:00",
  "endDate": "2025-06-30T00:00:00",
  "tacticId": 3
}
```


**Response Of all Promo**

```json
[
  {
    "promoId": 1,
    "items": [
      {
        "id": 1,
        "name": "Pen"
      },
      {
        "id": 2,
        "name": "Pencil"
      }
    ],
    "stores": [
      {
        "id": 1,
        "name": "store1"
      },
      {
        "id": 2,
        "name": "store2"
      }
    ],
    "startTime": "2025-06-20",
    "endTime": "2025-06-30",
    "tactic": [
      {
        "tacticId": 1,
        "tactic": "BOGO Free"
      }
    ]
  },
  {
    "promoId": 2,
    "items": [
      {
        "id": 1,
        "name": "Pen"
      },
      {
        "id": 2,
        "name": "Pencil"
      }
    ],
    "stores": [
      {
        "id": 1,
        "name": "store1"
      },
      {
        "id": 2,
        "name": "store2"
      }
    ],
    "startTime": "2025-06-20",
    "endTime": "2025-06-30",
    "tactic": [
      {
        "tacticId": 1,
        "tactic": "BOGO Free"
      }
    ]
  }
]
```
# Useful SQL Queries

Click the code block below to copy all important SQL queries:

````sql
--  Basic Table Queries
SELECT * FROM Promotions;
SELECT * FROM PromoItems;
SELECT * FROM PromoStores;
SELECT * FROM Items;
SELECT * FROM Stores;

--  Get Item Names per Promotion
SELECT pi.PromoId, i.ItemName
FROM PromoItems pi
JOIN Items i ON pi.ItemId = i.ItemId;

-- Get Store Names per Promotion
SELECT ps.PromoId, s.StoreName
FROM PromoStores ps
JOIN Stores s ON ps.StoreId = s.StoreId;

--  Get Tactic Type per Promotion
SELECT p.PromoId, t.TacticType
FROM Promotions p
JOIN Tactics t ON p.TacticId = t.TacticId;

--  Full Promotion View with Items, Stores, and Tactic
SELECT
    p.PromoId,
    GROUP_CONCAT(DISTINCT i.ItemName) AS Items,
    GROUP_CONCAT(DISTINCT s.StoreName) AS Stores,
    p.StartDate,
    p.EndDate,
    t.TacticType AS Tactic
FROM Promotions p
JOIN PromoItems pi ON p.PromoId = pi.PromoId
JOIN Items i ON pi.ItemId = i.ItemId
JOIN PromoStores ps ON p.PromoId = ps.PromoId
JOIN Stores s ON ps.StoreId = s.StoreId
JOIN Tactics t ON p.TacticId = t.TacticId
GROUP BY p.PromoId;

---
