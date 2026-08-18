# ONLINE FOOD ORDERING SYSTEM — NON-FUNCTIONAL REQUIREMENTS

* **NFR-01 (Security):** All passwords must be hashed using bcrypt/PBKDF2 before database persistence. All network communications must be encrypted over HTTPS/TLS 1.3. Payment card data must adhere to PCI-DSS standards.
* **NFR-02 (Performance):** Menu queries, search operations, and cart updates must return response payloads within 2.0 seconds under nominal network conditions.
* **NFR-03 (Usability):** The interface must be responsive, responsive across mobile and desktop viewports, enabling complete order placement within 4 clicks from restaurant selection.
* **NFR-04 (Reliability & Consistency):** Transactional consistency must be strictly enforced (ACID compliance) so that orders are confirmed only upon verified payment authorization.
* **NFR-05 (Availability):** The system must maintain 99.5% operational uptime during standard business operating hours.
* **NFR-06 (Maintainability & Modularity):** The codebase must follow a 3-tier Boundary-Control-Entity (BCE) architecture to allow independent module updates.
* **NFR-07 (Data Integrity):** Relational database constraints and foreign key cascades must prevent orphaned records across users, orders, line items, payments, and reviews.
