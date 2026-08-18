# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
## ONLINE FOOD ORDERING SYSTEM

---

### Document Control
* **Project Name:** Online Food Ordering System
* **Course:** Object-Oriented Analysis and Design (OOAD) / Software Engineering
* **Phase:** Review 1 — Requirements Analysis and Foundation Specification
* **Target Environment:** Web & Mobile Food Delivery Platform

---

## 1. PROJECT OVERVIEW
The **Online Food Ordering System** is an interactive, multi-user web and mobile application designed to connect customers, restaurants, and delivery partners on a unified digital platform. The system streamlines the entire food ordering lifecycle: from discovering local restaurants and browsing menus, to placing orders, processing digital payments, managing real-time food preparation, coordinating doorstep delivery, and submitting customer reviews.

The platform provides a seamless digital workflow that enhances customer convenience, optimizes restaurant kitchen operations, and enables transparent order tracking.

---

## 2. PROBLEM STATEMENT
Traditional food ordering methods (such as direct phone calls, physical paper menus, and manual in-person pickups) suffer from significant operational inefficiencies:
1. **Communication Errors:** Verbal orders over the phone often lead to incorrect food choices, unrecorded customizations, and pricing disputes.
2. **Lack of Live Visibility:** Customers have no real-time insight into whether their order has been accepted, how long preparation takes, or the delivery partner's arrival time.
3. **Manual Order Handling for Restaurants:** Managing incoming orders manually during peak hours causes kitchen delays, menu stock discrepancies, and lost sales.
4. **Disorganized Delivery Coordination:** Delivery personnel lack direct digital routing and consolidated order handoff information.

The Online Food Ordering System addresses these problems by providing an automated, transparent, and role-based software solution.

---

## 3. PROJECT OBJECTIVES
* **Customer Convenience:** Allow users to search, customize, and order food from local restaurants with secure online payment options.
* **Streamlined Kitchen Management:** Enable restaurant staff to manage active menus, view incoming orders immediately, and communicate food preparation stages in real time.
* **Reliable Delivery Logistics:** Provide delivery partners with real-time pickup alerts, customer delivery address details, and status update capabilities.
* **Secure Financial Processing:** Integrate an external Payment Gateway to handle instant payment verification and automatic refund processing upon cancellations.
* **Quality Feedback Mechanism:** Enable verified customers to rate food quality and delivery service post-fulfillment.

---

## 4. SYSTEM SCOPE

### 4.1 In-Scope Features
* User registration, profile management, and secure role-based authentication.
* Restaurant discovery, interactive digital menu browsing, and keyword-based food search.
* Shopping cart operations: item addition, quantity adjustments, item removal, and subtotal calculation.
* Order placement and checkout workflow with digital payment gateway integration.
* Restaurant order acceptance, rejection, and preparation stage status updates.
* Delivery partner assignment, pickup confirmation, transit updates, and final delivery completion.
* Order cancellation with automated refund eligibility evaluation.
* Customer rating and review submission for delivered orders.

### 4.2 Out-of-Scope Features (For Review 1 Simplicity)
* Complex third-party table reservation systems.
* Multi-currency foreign exchange conversion.
* Drone or autonomous vehicle dispatch algorithms.
* Dynamic surge pricing and complex machine-learning recommendation models.

---

## 5. STAKEHOLDERS

| Stakeholder | Description & Role |
| :--- | :--- |
| **End Customers** | Individuals who use the platform to search for restaurants, order meals, and track delivery. |
| **Restaurant Owners & Staff** | Kitchen and front-desk personnel who maintain menus, accept incoming orders, and prepare food. |
| **Delivery Partners** | Independent or dedicated couriers responsible for picking up food from restaurants and delivering to customers. |
| **Payment Service Provider** | Third-party financial institution / payment gateway facilitating card, net banking, and UPI transactions. |
| **System Administrator** | Platform technical staff managing user accounts, platform health, and overall system policies. |

---

## 6. SYSTEM ACTORS & ROLES

The system defines exactly **four primary and supporting actors**:

```
+-------------------------------------------------------------------------+
|                               ACTORS                                    |
+--------------------+---------------------+--------------------+---------+
| 1. Customer        | 2. Restaurant Staff | 3. Delivery Partner| 4. PGW  |
|    (Primary User)  |    (Business User)  |    (Logistics User)| (System)|
+--------------------+---------------------+--------------------+---------+
```

### Actor Descriptions:
1. **Customer (Primary Human Actor):**
   * Registered user who browses menus, places food orders, pays online, tracks order delivery status, and writes reviews.
2. **Restaurant Staff (Primary Human Actor):**
   * Kitchen/management staff who log in to update menu items, review incoming orders, accept or reject requests, and mark preparation milestones.
3. **Delivery Partner (Primary Human Actor):**
   * Logistics personnel who view assigned orders, navigate to the restaurant, pick up the package, update transit status, and confirm final handover to the customer.
4. **Payment Gateway (Secondary / System Actor):**
   * External financial processing API that securely authorizes payment transactions, verifies payment status, and issues refunds.

---

## 7. FUNCTIONAL REQUIREMENTS (FR)

### 7.1 Customer Module Requirements

| Requirement ID | Description |
| :--- | :--- |
| **FR-01** | The system shall allow a new customer to register by providing name, email, password, phone number, and delivery address. |
| **FR-02** | The system shall allow registered customers to log in securely using their credentials. |
| **FR-03** | The system shall display a list of active restaurants with opening hours, cuisine types, and average ratings. |
| **FR-04** | The system shall allow customers to view the categorized digital menu of a selected restaurant. |
| **FR-05** | The system shall allow customers to search for food items by name, cuisine, or category. |
| **FR-06** | The system shall allow customers to view detailed food item information (description, price, dietary tags). |
| **FR-07** | The system shall allow customers to add selected food items with desired quantities to their active cart. |
| **FR-08** | The system shall allow customers to update the quantity of items already in the cart. |
| **FR-09** | The system shall allow customers to remove individual food items from the cart or clear the cart. |
| **FR-10** | The system shall calculate the order subtotal, taxes, delivery fee, and grand total upon checkout. |
| **FR-11** | The system shall allow logged-in customers with non-empty carts to place an order. |
| **FR-12** | The system shall allow customers to make payments online via credit/debit cards, UPI, or digital wallets. |
| **FR-13** | The system shall maintain and display historical orders placed by the customer. |
| **FR-14** | The system shall provide real-time order status tracking (Placed, Accepted, Preparing, Picked Up, Delivered). |
| **FR-15** | The system shall allow a customer to cancel an order before the restaurant starts food preparation. |
| **FR-16** | The system shall allow customers to submit star ratings and text feedback after an order is marked Delivered. |

---

### 7.2 Restaurant Staff Module Requirements

| Requirement ID | Description |
| :--- | :--- |
| **FR-17** | The system shall allow restaurant staff to log in securely with assigned restaurant credentials. |
| **FR-18** | The system shall allow restaurant staff to view and manage their digital menu items. |
| **FR-19** | The system shall allow restaurant staff to add new food items (name, description, price, category, availability). |
| **FR-20** | The system shall allow restaurant staff to update existing food item details and toggle availability (In Stock / Out of Stock). |
| **FR-21** | The system shall allow restaurant staff to remove/archive food items from the menu. |
| **FR-22** | The system shall display incoming orders in real time to the restaurant kitchen dashboard. |
| **FR-23** | The system shall allow restaurant staff to accept an incoming pending order. |
| **FR-24** | The system shall allow restaurant staff to reject an incoming order with a specified reason. |
| **FR-25** | The system shall allow restaurant staff to update food preparation status (`Preparing` $\rightarrow$ `Ready for Pickup`). |

---

### 7.3 Delivery Partner Module Requirements

| Requirement ID | Description |
| :--- | :--- |
| **FR-26** | The system shall allow delivery partners to log in using their registered courier credentials. |
| **FR-27** | The system shall allow delivery partners to view newly assigned delivery orders with restaurant pickup location. |
| **FR-28** | The system shall provide the delivery partner with customer delivery address, contact info, and delivery instructions. |
| **FR-29** | The system shall allow the delivery partner to confirm order pickup from the restaurant (`Out for Delivery`). |
| **FR-30** | The system shall allow the delivery partner to update transit delivery status in real time. |
| **FR-31** | The system shall allow the delivery partner to mark an order as successfully `Delivered`. |

---

### 7.4 Payment Gateway Module Requirements

| Requirement ID | Description |
| :--- | :--- |
| **FR-32** | The system shall securely transmit transaction details to the Payment Gateway for payment processing. |
| **FR-33** | The system shall receive and record payment approval responses (`Payment Success` with transaction reference ID). |
| **FR-34** | The system shall handle payment decline responses (`Payment Failure`) and notify the user with retry options. |
| **FR-35** | The system shall initiate an automated refund request to the Payment Gateway when a paid order is cancelled. |

---

## 8. NON-FUNCTIONAL REQUIREMENTS (NFR)

| Requirement ID | Category | Specification |
| :--- | :--- | :--- |
| **NFR-01** | **Security** | Passwords must be hashed using industry-standard hashing algorithms (e.g., bcrypt/SHA-256). Sensitive payment data must not be stored on application servers. |
| **NFR-02** | **Usability** | The interface shall provide intuitive navigation allowing a customer to complete an order in under 5 minutes. |
| **NFR-03** | **Performance** | Menu queries, search operations, and cart updates shall return responses within 2 seconds under standard load. |
| **NFR-04** | **Reliability** | The system shall ensure transactional consistency: an order is only confirmed if payment authorization succeeds. |
| **NFR-05** | **Availability** | The core application and ordering services shall maintain 99.5% operational uptime during business operating hours. |
| **NFR-06** | **Maintainability** | The software shall follow modular Object-Oriented principles (High Cohesion, Low Coupling) to enable easy feature additions. |
| **NFR-07** | **Data Integrity** | All database transactions affecting financial amounts, cart contents, and stock states must follow ACID properties. |

---

## 9. BUSINESS RULES (BR)

```
+-----------------------------------------------------------------------------------+
|                              CORE BUSINESS RULES                                  |
+--------+--------------------------------------------------------------------------+
| BR-01  | Customer Authentication: Must be logged in to place an order.            |
| BR-02  | Non-Empty Cart: Cart must contain >= 1 item before checkout.              |
| BR-03  | Order Acceptance: Restaurant must accept order before preparation starts.|
| BR-04  | Payment Authorization: Payment must succeed before order is confirmed.   |
| BR-05  | Cancellation Window: Customer can cancel ONLY before food is prepared.   |
| BR-06  | Delivery Scope: Partner can update status only for assigned orders.      |
| BR-07  | Review Eligibility: Customer can review order only after delivery.       |
| BR-08  | Price Computation: Total amount = sum(item price * qty) + tax + fee.     |
+--------+--------------------------------------------------------------------------+
```

* **BR-01 (Authentication Mandate):** An anonymous guest may browse restaurants and menus, but must be registered and authenticated before proceeding to checkout and placing an order.
* **BR-02 (Minimum Cart Requirement):** A checkout session cannot be initiated with an empty cart ($ItemCount \ge 1$). All items in a single checkout must belong to the same restaurant.
* **BR-03 (Kitchen Workflow Rule):** An order enters the `PLACED` state upon successful payment. Kitchen preparation (`PREPARING`) cannot start until restaurant staff explicitly clicks `Accept Order`.
* **BR-04 (Financial Pre-Condition):** An order status changes to `CONFIRMED` only after receiving an approved transaction token from the Payment Gateway.
* **BR-05 (Cancellation & Refund Window):** A customer may cancel an order while it is in `PLACED` or `ACCEPTED` status. Once the status transitions to `PREPARING`, customer cancellation is disabled. If a paid order is cancelled, a 100% refund is initiated automatically.
* **BR-06 (Courier Ownership Rule):** A delivery partner can view, pick up, and update transit status exclusively for orders that have been assigned to them by the system.
* **BR-07 (Review Post-Condition):** Review and rating forms become active only when the order status reaches `DELIVERED`.
* **BR-08 (Financial Calculation Formula):** 
  $$\text{Grand Total} = \sum (\text{FoodItem.price} \times \text{Quantity}) + \text{Tax} + \text{DeliveryFee} - \text{Discount}$$

---

## 10. SYSTEM ASSUMPTIONS & CONSTRAINTS

### 10.1 Assumptions
1. All users (Customers, Restaurant Staff, Delivery Partners) have access to internet-connected web or mobile devices.
2. Payment Gateway is a reliable external service accessible via REST APIs.
3. Delivery partners are within reasonable geographical proximity of the assigned restaurant.
4. Menu item prices and taxes are maintained in local currency.

### 10.2 Constraints
1. Orders can only be fulfilled during restaurant operating hours.
2. A single cart session can contain items from only **one restaurant at a time** to prevent multi-pickup routing complexity.
3. Cancellation is strictly governed by state transitions (disabled once cooking commences).

---

## 11. SYSTEM EVENTS & TRIGGERS (EV)

| Event ID | Event Name | Triggering Actor / Source | Target Component / Entity | Outcome |
| :--- | :--- | :--- | :--- | :--- |
| **EV-01** | `UserRegistered` | Customer | `AuthService` / `Customer` | New customer account created. |
| **EV-02** | `UserLoggedIn` | Customer / Staff / Partner | `AuthService` / `User` | Session token issued. |
| **EV-03** | `ItemAddedToCart` | Customer | `CartService` / `Cart` | Cart item added or quantity incremented. |
| **EV-04** | `CheckoutInitiated` | Customer | `OrderService` / `Checkout` | Order subtotal and delivery details calculated. |
| **EV-05** | `PaymentSubmitted` | Customer | `PaymentGateway` | Payment authorization request dispatched. |
| **EV-06** | `PaymentApproved` | Payment Gateway | `PaymentService` / `Order` | Order status updated to `CONFIRMED` / `PLACED`. |
| **EV-07** | `PaymentDeclined` | Payment Gateway | `PaymentService` / `Order` | User notified of payment failure; order pending. |
| **EV-08** | `OrderAccepted` | Restaurant Staff | `KitchenService` / `Order` | Order status changes to `ACCEPTED`. |
| **EV-09** | `OrderRejected` | Restaurant Staff | `KitchenService` / `Order` | Order status changes to `REJECTED`; refund triggered. |
| **EV-10** | `FoodPrepared` | Restaurant Staff | `KitchenService` / `Order` | Order status changes to `READY_FOR_PICKUP`. |
| **EV-11** | `DeliveryAssigned`| System Scheduler | `DeliveryService` / `Order`| Order linked to an available Delivery Partner. |
| **EV-12** | `OrderPickedUp` | Delivery Partner | `DeliveryService` / `Order`| Order status changes to `OUT_FOR_DELIVERY`. |
| **EV-13** | `OrderDelivered` | Delivery Partner | `DeliveryService` / `Order`| Order status changes to `DELIVERED`; review enabled. |
| **EV-14** | `OrderCancelled` | Customer | `OrderService` / `Payment` | Order status changes to `CANCELLED`; refund sent to PGW. |
| **EV-15** | `ReviewSubmitted`| Customer | `ReviewService` / `Review` | Rating and comments attached to Restaurant/Order. |

---

## 12. REQUIREMENTS TRACEABILITY MATRIX (PREVIEW FOR UML MODELING)

```
+------------------+---------------------+-------------------+---------------------+
| Functional Req   | Primary Actor       | Associated Entity | Future UML Diagram  |
+------------------+---------------------+-------------------+---------------------+
| FR-01, FR-02     | Customer            | User, Customer    | UC, Sequence, Class |
| FR-03 to FR-06   | Customer            | Restaurant, Food  | UC, Sequence, Class |
| FR-07 to FR-09   | Customer            | Cart, CartItem    | UC, Sequence, Class |
| FR-10 to FR-12   | Customer, PGW       | Order, Payment    | UC, Sequence, Act   |
| FR-13, FR-14     | Customer            | Order, Delivery   | UC, Sequence, State |
| FR-15            | Customer, PGW       | Order, Refund     | UC, Sequence, State |
| FR-16            | Customer            | Review, Rating    | UC, Sequence, Class |
| FR-17 to FR-21   | Restaurant Staff    | Menu, FoodItem    | UC, Class           |
| FR-22 to FR-25   | Restaurant Staff    | Order, Kitchen    | UC, Sequence, State |
| FR-26 to FR-31   | Delivery Partner    | Order, Delivery   | UC, Sequence, State |
| FR-32 to FR-35   | Payment Gateway     | Payment, Refund   | UC, Sequence, Comp  |
+------------------+---------------------+-------------------+---------------------+
```

---
*This SRS serves as the baseline specification for all subsequent OOAD models (Use Case, Domain Class, Sequence, Activity, Communication, State Machine, Component, and Deployment diagrams).*
