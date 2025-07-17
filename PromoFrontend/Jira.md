**Designed and created normalized tables**: Stores, Items, Tactics, Promotions, PromoItems, and PromoStores. 
Inserted initial data for Stores, Items, and Tactics.
Connected backend to SQLite database using Dapper.
Implemented GET, POST, PUT, and DELETE endpoints for Promotions.
Added validation logic for promotion StartDate and EndDate in the service layer.
Implemented business logic in service classes to handle creation, fetching, updating, and deletion of promotions. 
Added default sorting of promotions by Promo ID in descending order.
Implemented sorting by Promo ID, Start Date, End Date, Items, Stores, and Tactic columns.
Added filtering functionality for Items, Stores, and Tactic to enhance data navigation and user experience.

Wrote unit tests for the service layer to ensure correctness and coverage.

**Displayed promotion data in a table with columns**: Promo ID, Items, Stores, Start Date, End Date, Tactic, and Actions.
Hooked up frontend to backend to fetch and display real promotion data.
Implemented "Add Promotion" form with multi-select for items and stores.
Added client-side validation for Start Date and End Date.

**Enables delete option**: Enabled deletion of a promotion from the frontend table with confirmation popup for Yes and No options.

**Enables Edit option**: Implemented the ability to edit an existing promotion, including updating items, stores, tactic, and date range with pre-populated values in the edit popup. 

**Dockerize FrontEnd and Backend**: Created images for frontend and backend using Docker network.
