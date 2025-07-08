# 📊 Promotion Manager - Acceptance Criteria

This document compiles all acceptance criteria for the key promotion features.

---

## ✅ 1. View All Promotions in List View

### **Acceptance Criteria**

1. Display a list view of all promotions.
2. List of columns:
    - **Promo ID**
    - **Items** (a promotion can have multiple items)
    - **Stores** (a promotion can have multiple stores)
    - **Start date**
    - **End date**
    - **Tactic**
    - **Action** (Edit, Delete)
3. Default sorting to be done by **Promo ID (Descending)**.
4. Sorting and filtering to be supported for each column.

---

## ✅ 2. Create a New Promotion

### **Acceptance Criteria**

1. An icon to launch the **Create popup**.
2. Provide fields to capture below details:

    - **Item** (Multi select, Dropdown with 10 items listed):
        - Pencil
        - Eraser
        - Sharpener
        - Pen
        - Notebook
        - Ruler
        - Crayon
        - Glue stick
        - Scissors
        - Pencil box

    - **Store** (Dropdown with 6 stores listed):
        - Store 1
        - Store 2
        - Store 3
        - Store 4
        - Store 5
        - Store 6

---

## ✅ 3. Update an Existing Promotion

### **Acceptance Criteria**

1. Provide an option to edit a promotion from **List view**.
2. Upon selecting the edit option, open the Promotion details screen with below details:
    - **Promo ID** (Read only)
    - **Item**
    - **Store**
    - **Start date**
    - **End date**
    - **Tactic**
3. Existing values to be **pre-populated**.
4. User can **modify** the values as needed against each field.
5. Upon making any change, users should be able to **Save** them. Otherwise, the button should be **greyed out**.
6. Users can **discard** the changes by clicking on **Cancel** and get back to List view.

---

## ✅ 4. Delete an Existing Promotion

### **Acceptance Criteria**

1. Provide an option to delete a promotion from **List view**.
2. Upon clicking the delete icon, users should see a **confirmation popup**, which reads:

   > "Are you sure to delete the selected promotion?"

3. Users should be able to see two options in the popup:
    - **Yes** – clicking which should delete the promotion and return to list view.
    - **No** – closes the popup and returns to list view.

---