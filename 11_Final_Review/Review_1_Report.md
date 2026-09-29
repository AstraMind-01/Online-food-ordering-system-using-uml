# ACADEMIC PROJECT REVIEW 1 COMPREHENSIVE REPORT

---

## **ONLINE FOOD ORDERING SYSTEM**

* **Course Code & Title:** CS302 / IT302 — Object-Oriented Analysis and Design (OOAD)
* **Academic Degree:** Bachelor of Technology (B.Tech) in Computer Science & Engineering
* **Department:** Department of Computer Science & Engineering
* **Academic Milestone:** Project Review 1 Submission & Evaluation Portfolio
* **Modeling Standard:** Unified Modeling Language (UML 2.5 Specification)
* **Date of Submission:** August 2026

---

## 2. TEAM MEMBERS & PROJECT INFORMATION

| Roll Number / Student ID | Student Full Name | Assigned Module / Modeling Responsibility |
| :--- | :--- | :--- |
| **CSE-2026-01** | Student 1 (Lead Analyst) | Requirement Engineering, SRS, Event Modeling & Use Case Modeling |
| **CSE-2026-02** | Student 2 (System Architect) | Conceptual Domain Analysis & Software Design Class Modeling |
| **CSE-2026-03** | Student 3 (Behavioral Modeler) | Dynamic Interaction Modeling (Sequence & Activity Diagrams) |
| **CSE-2026-04** | Student 4 (Design & Deployment) | Detailed Object Design (BCE, State, Component, Deployment) |

* **Project Supervisor / Faculty Guide:** Course Instructor / Project Evaluation Committee

---

## 3. TABLE OF CONTENTS
1. [Cover Page](#academic-project-review-1-comprehensive-report)
2. [Team Members & Project Information](#2-team-members--project-information)
3. [Table of Contents](#3-table-of-contents)
4. [Introduction](#4-introduction)
5. [Problem Statement](#5-problem-statement)
6. [Objectives](#6-objectives)
7. [System Scope](#7-system-scope)
8. [Software Development Life Cycle (SDLC)](#8-software-development-life-cycle-sdlc)
9. [OOAD Methodology](#9-ooad-methodology)
10. [Stakeholders Analysis](#10-stakeholders-analysis)
11. [Functional Requirements](#11-functional-requirements)
12. [Non-Functional Requirements](#12-non-functional-requirements)
13. [Business Rules](#13-business-rules)
14. [System Event List](#14-system-event-list)
15. [System Event Table](#15-system-event-table)
16. [Use Case Model Overview](#16-use-case-model-overview)
17. [Use Case Diagram](#17-use-case-diagram)
18. [Detailed Use Case Specifications](#18-detailed-use-case-specifications)
19. [Domain Analysis](#19-domain-analysis)
20. [Conceptual Domain Class Diagram](#20-conceptual-domain-class-diagram)
21. [Software Design Class Diagram](#21-software-design-class-diagram)
22. [System Sequence Diagrams (SSDs)](#22-system-sequence-diagrams-ssds)
23. [High-Level Sequence Diagrams](#23-high-level-sequence-diagrams)
24. [Detailed Sequence Diagrams](#24-detailed-sequence-diagrams)
25. [Activity Diagrams](#25-activity-diagrams)
26. [Communication Diagrams](#26-communication-diagrams)
27. [Order State Machine Diagram](#27-order-state-machine-diagram)
28. [Component Diagram](#28-component-diagram)
29. [Deployment Diagram](#29-deployment-diagram)
30. [Boundary-Control-Entity (BCE) Architecture](#30-boundary-control-entity-bce-architecture)
31. [Conclusion & Review 2 Roadmap](#31-conclusion--review-2-roadmap)

---

## 4. INTRODUCTION
In the contemporary digital economy, on-demand food delivery platforms have become essential infrastructure for urban commerce. The **Online Food Ordering System** is a distributed, multi-tier software platform designed to bridge the gap between hungry customers, commercial food kitchens, independent delivery couriers, and financial payment gateways. 

The system automates the complete dining fulfillment lifecycle: from restaurant catalog browsing, shopping cart composition, and encrypted digital payment processing to real-time kitchen order dispatch, courier pickup tracking, and customer dining ratings.

---

## 5. PROBLEM STATEMENT
Traditional brick-and-mortar restaurant ordering relies on manual telephone calls, physical paper menus, and offline cash transactions. This traditional approach suffers from significant operational inefficiencies:
* **Order Inaccuracies:** Miscommunication during telephone ordering leads to wrong dish deliveries and food waste.
* **Lack of Real-Time Visibility:** Customers cannot track food preparation milestones or delivery courier locations.
* **Inefficient Kitchen Management:** Restaurant staff struggle to balance walk-in customers with phone orders during peak meal hours.
* **Restricted Discovery:** Smaller local eateries lack marketing channels to reach potential customers outside their immediate neighborhood.
* **Manual Financial Accounting:** Handling cash on delivery introduces reconciliation delays, theft risks, and difficult refund processes.

The **Online Food Ordering System** resolves these challenges by providing a centralized, automated digital platform with synchronized multi-stakeholder workflows.

---

## 6. OBJECTIVES
The core objectives of the system are:
1. **User Experience:** Enable customers to discover restaurants, filter food by cuisine, customize cart items, and complete orders within 4 clicks.
2. **Operational Automation:** Provide restaurant kitchens with an automated dashboard to accept orders, manage dish availability, and update cooking stages.
3. **Logistics Optimization:** Assign delivery couriers efficiently, provide pickup route instructions, and enable live transit milestones.
4. **Financial Security & Integrity:** Integrate third-party payment gateways for instant transaction authorization, automated ledgering, and 100% automated refund settlements.
5. **System Transparency:** Maintain real-time order tracking and verified post-delivery customer ratings.

---

## 7. SYSTEM SCOPE
The software scope encompasses four interconnected domains:
* **Customer Web & Mobile Portal:** Catalog browsing, search, cart management, checkout, digital payment, order tracking, cancellation, and reviews.
* **Restaurant Kitchen Portal:** Digital menu catalog CRUD operations, incoming order queue management, order acceptance/rejection, and cooking status updates.
* **Delivery Partner Handheld App:** Delivery assignment acceptance, restaurant pickup confirmation, customer navigation, and delivery handover verification.
* **Payment Gateway Integration:** Electronic fund authorization, decline handling, and automated refund dispatch.

*Exclusions from Review 1 Scope:* Advanced AI route optimization algorithms, third-party ERP inventory sync, and multi-country tax calculations.

---

## 8. SOFTWARE DEVELOPMENT LIFE CYCLE (SDLC)
The project adopts the **Iterative & Incremental Development Model** combined with the **Unified Process (UP)**:
* **Inception Phase:** Project feasibility analysis, business vision definition, and stakeholder identification.
* **Elaboration Phase (Current Review 1 Phase):** In-depth domain analysis, formal SRS specification, architectural baseline definition, and comprehensive structural and behavioral UML modeling.
* **Construction Phase (Review 2 Phase):** Iterative implementation of Boundary-Control-Entity classes, database schema construction, and API integration.
* **Transition Phase:** Beta testing, user acceptance testing (UAT), performance benchmarking, and production deployment.

---

## 9. OOAD METHODOLOGY
The project applies **Object-Oriented Analysis and Design (OOAD)** principles adhering to the **Unified Modeling Language (UML 2.5)** standard:
1. **Use Case Driven:** System functionality is derived strictly from actor goals and behavioral specifications.
2. **Architecture-Centric:** Built upon a 3-tier **Boundary-Control-Entity (BCE)** structural architecture for separation of concerns.
3. **Iterative & Refined:** Conceptual domain models are systematically refined into software design class diagrams with complete attributes, methods, visibilities, and multiplicities.

---

## 10. STAKEHOLDERS ANALYSIS

```
+-------------------------------------------------------------------------------+
|                             SYSTEM STAKEHOLDERS                               |
+-------------------+--------------------+------------------+-------------------+
| 1. Customer       | 2. Restaurant Staff| 3. Delivery      | 4. Payment        |
|    (Primary User) |    (Merchant User) |    Partner       |    Gateway        |
|    Discovers food,|    Manages menus,  |    (Logistics)   |    (External)     |
|    orders & pays  |    cooks orders    |    Delivers food |    Authorizes cash|
+-------------------+--------------------+------------------+-------------------+
```

---

## 11. FUNCTIONAL REQUIREMENTS

### 11.1 Customer Functions (`FR-01` to `FR-16`)
* **FR-01 (Register):** Allow new customers to register with name, email, password, phone, and delivery address.
* **FR-02 (Login):** Authenticate registered customers via email and password.
* **FR-03 (Browse Restaurants):** Display all open restaurants with average ratings and delivery estimates.
* **FR-04 (View Menu):** Display categorized dishes for any selected restaurant.
* **FR-05 (Search Food):** Enable keyword searching across dish names, descriptions, and cuisines.
* **FR-06 (View Food Details):** Show dish pricing, descriptions, and availability status.
* **FR-07 (Add to Cart):** Add food items with quantities to an active shopping cart.
* **FR-08 (Update Cart):** Modify line item quantities in the cart.
* **FR-09 (Remove from Cart):** Delete food items from the cart.
* **FR-10 (Checkout):** Validate cart items, confirm delivery address, and calculate bill subtotals, taxes, and grand total.
* **FR-11 (Place Order):** Instantiate an order in `PENDING_PAYMENT` status.
* **FR-12 (Make Payment):** Execute electronic payment authorization via cards, UPI, or wallets.
* **FR-13 (View Order History):** Access past order receipts and delivery statuses.
* **FR-14 (Track Order):** Display live order milestones and assigned courier details.
* **FR-15 (Cancel Order):** Allow order cancellation before cooking starts, triggering a 100% refund.
* **FR-16 (Give Rating/Review):** Submit 1–5 star ratings and comments on delivered orders.

### 11.2 Restaurant Staff Functions (`FR-17` to `FR-25`)
* **FR-17 (Login):** Authenticate restaurant staff into the kitchen portal.
* **FR-18 (Manage Menu):** View and organize the restaurant's menu items.
* **FR-19 (Add Food Item):** Create new dishes with pricing, descriptions, and categories.
* **FR-20 (Update Food Item):** Edit dish prices, descriptions, and availability.
* **FR-21 (Remove Food Item):** Delete discontinued dishes from the menu catalog.
* **FR-22 (View Orders):** Monitor incoming customer orders in real time.
* **FR-23 (Accept Order):** Accept orders and set estimated preparation time.
* **FR-24 (Reject Order):** Reject orders with a reason, triggering customer notification and auto-refund.
* **FR-25 (Update Prep Status):** Update preparation milestones (`Preparing` $\rightarrow$ `Ready for Pickup`).

### 11.3 Delivery Partner Functions (`FR-26` to `FR-31`)
* **FR-26 (Login):** Authenticate delivery couriers into the mobile app.
* **FR-27 (View Assigned Order):** View pickup order summary and restaurant location.
* **FR-28 (View Delivery Details):** Access pickup and drop-off addresses with customer contact info.
* **FR-29 (Pick Up Order):** Confirm parcel pickup at the restaurant (`OUT_FOR_DELIVERY`).
* **FR-30 (Update Delivery Status):** Update transit milestones and report delivery exceptions.
* **FR-31 (Mark Delivered):** Confirm physical handover to customer (`DELIVERED`).

### 11.4 Payment Gateway Functions (`FR-32` to `FR-35`)
* **FR-32 (Process Payment):** Process encrypted transaction authorization requests.
* **FR-33 (Payment Success):** Return authorization token and transaction reference ID.
* **FR-34 (Payment Failure):** Return decline codes and failure explanations.
* **FR-35 (Refund Payment):** Settle full electronic refunds for cancelled/rejected orders.

---

## 12. NON-FUNCTIONAL REQUIREMENTS
* **NFR-01 (Security):** Passwords hashed using bcrypt/PBKDF2; network traffic encrypted via TLS 1.3/HTTPS; PCI-DSS payment compliance.
* **NFR-02 (Performance):** Menu and search queries return responses within $\le 2.0$ seconds.
* **NFR-03 (Usability):** Intuitive web/mobile responsive interface allowing checkout completion within 4 clicks.
* **NFR-04 (Reliability & Consistency):** ACID-compliant transactional consistency across payment and order placement.
* **NFR-05 (Availability):** 99.5% operational uptime during business operating hours.
* **NFR-06 (Maintainability):** Modular 3-tier BCE architecture allowing decoupled subsystem updates.
* **NFR-07 (Data Integrity):** Foreign key cascades prevent orphaned line items and ledger discrepancies.

---

## 13. BUSINESS RULES
* **BR-01 (Authentication Mandate):** A user must be registered and authenticated before initiating checkout.
* **BR-02 (Single-Restaurant Cart):** A cart must contain $\ge 1$ item; all items in an active cart must originate from the same restaurant.
* **BR-03 (Kitchen Acceptance Gate):** A restaurant must accept an order before cooking preparation commences.
* **BR-04 (Financial Precondition):** Payment authorization must succeed before an order transitions to `CONFIRMED`.
* **BR-05 (Cancellation & Refund Policy):** Orders can be cancelled only while in `PLACED` or `ACCEPTED` status (disabled once status is `PREPARING`). Cancellations trigger an automatic 100% refund.
* **BR-06 (Courier Assignment Isolation):** Delivery partners can view and update transit milestones only for orders assigned to them.
* **BR-07 (Review Post-Condition):** Review and star ratings are unlocked only after an order is marked `DELIVERED`.
* **BR-08 (Bill Calculation Formula):**
  $$\text{Total Amount} = \sum (\text{Price} \times \text{Quantity}) + \text{Taxes} + \text{Delivery Fee} - \text{Discounts}$$

---

## 14. SYSTEM EVENT LIST
* **EV-01:** Customer Registration | **EV-02:** Customer Login | **EV-03:** Restaurant Selection
* **EV-04:** Food Search | **EV-05:** Food Selection | **EV-06:** Add Food to Cart
* **EV-07:** Checkout | **EV-08:** Place Order | **EV-09:** Payment Request
* **EV-10:** Payment Success | **EV-11:** Payment Failure | **EV-12:** Restaurant Accepts Order
* **EV-13:** Restaurant Rejects Order | **EV-14:** Food Preparation | **EV-15:** Order Pickup
* **EV-16:** Order Delivery | **EV-17:** Order Cancellation | **EV-18:** Food Review

---

## 15. SYSTEM EVENT TABLE

| Event ID | Event Name | Source | Trigger | Input Data | System Response | Output Data |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **EV-01** | Registration | Customer | Submits form | Name, email, password, phone, address | Validates, encrypts, creates user | Confirmation message |
| **EV-02** | Login | Customer/Staff/Courier | Submits credentials | Email, password | Authenticates hash, creates session | User dashboard |
| **EV-03** | Select Restaurant | Customer | Clicks restaurant card | Restaurant ID | Fetches menu and ratings | Restaurant menu view |
| **EV-04** | Food Search | Customer | Enters search term | Keyword string | Queries active food items | Matching food items list |
| **EV-05** | Food Selection | Customer | Clicks food item | Food ID | Fetches dish details | Food details modal |
| **EV-06** | Add to Cart | Customer | Clicks "Add to Cart" | Food ID, Quantity | Validates restaurant, adds item, recalculates total | Cart drawer, badge count |
| **EV-07** | Checkout | Customer | Clicks "Checkout" | Cart ID, Delivery Address | Validates items, calculates taxes and grand total | Checkout bill summary |
| **EV-08** | Place Order | Customer | Clicks "Place Order" | Cart ID, Address, Payment mode | Creates Order in `PENDING_PAYMENT` | Order ID, PGW redirect |
| **EV-09** | Payment Request | Customer / System | Submits payment info | Order ID, Amount, Card/UPI details | Transmits encrypted request to PGW | Gateway processing modal |
| **EV-10** | Payment Success | Payment Gateway | Transaction approved | Auth Token, Tx ID | Updates payment to `SUCCESS`, order to `CONFIRMED` | Payment receipt |
| **EV-11** | Payment Failure | Payment Gateway | Transaction declined | Decline Code, Reason | Updates payment to `FAILED`, preserves cart | Error message, retry option |
| **EV-12** | Accept Order | Restaurant Staff | Clicks "Accept Order" | Order ID, Prep Time | Updates status to `ACCEPTED`, alerts kitchen | Customer notification |
| **EV-13** | Reject Order | Restaurant Staff | Clicks "Reject Order" | Order ID, Reason | Sets status to `REJECTED`, triggers refund | Rejection & refund alert |
| **EV-14** | Food Preparation | Restaurant Staff | Clicks "Ready" | Order ID | Sets status to `READY_FOR_PICKUP`, alerts courier | Courier pickup alert |
| **EV-15** | Order Pickup | Delivery Partner | Clicks "Confirm Pickup" | Order ID, Courier ID | Sets status to `OUT_FOR_DELIVERY` | Transit update to customer |
| **EV-16** | Order Delivery | Delivery Partner | Clicks "Mark Delivered" | Order ID | Sets status to `DELIVERED`, unlocks review | Delivery receipt, review prompt |
| **EV-17** | Cancel Order | Customer | Clicks "Cancel Order" | Order ID, Reason | Validates pre-cooking status, triggers refund | Cancellation & refund receipt |
| **EV-18** | Food Review | Customer | Submits review | Order ID, Rating (1–5), Comment | Validates `DELIVERED` status, updates rating | Review confirmation |

---

## 16. USE CASE MODEL OVERVIEW
The Use Case model defines system boundaries and functional interactions across 4 actors:
* **`Customer`:** Primary human user driving ordering, payment, and feedback.
* **`Restaurant Staff`:** Merchant user managing food items and cooking operations.
* **`Delivery Partner`:** Logistics courier handling transit and handover.
* **`Payment Gateway`:** External system actor handling banking authorizations.

All use cases are grouped into 5 functional packages: *Customer & Cart*, *Order & Checkout*, *Restaurant Kitchen*, *Delivery Logistics*, and *Payment Gateway*.

---

## 17. USE CASE DIAGRAM
* **Diagram File:** [`02_Use_Case/Use_Case_Diagram.drawio`](file:///c:/soumya/soumya/UML%20Modeling%20of%20an%20Online%20Shopping%20System/Online_Food_Ordering_System/02_Use_Case/Use_Case_Diagram.drawio)
* **Explanation:** Visually depicts 29 functional use cases enclosed within the system boundary. Illustrates associations to the 4 actors, mandatory `<<include>>` relationships (`Place Order` $\rightarrow$ `Checkout` and `Make Payment`), and conditional `<<extend>>` relationships (`Cancel Order` $\rightarrow$ `Track Order`, `Refund Payment` $\rightarrow$ `Cancel Order`).

---

## 18. DETAILED USE CASE SPECIFICATIONS
Detailed behavioral specifications covering Preconditions, Main Success Scenarios, Alternative/Exception Flows, and Postconditions are fully documented in [`02_Use_Case/Use_Case_Specifications.md`](file:///c:/soumya/soumya/UML%20Modeling%20of%20an%20Online%20Shopping%20System/Online_Food_Ordering_System/02_Use_Case/Use_Case_Specifications.md) for all 16 major use cases (Register, Login, Browse, View Menu, Search Food, Add to Cart, Checkout, Place Order, Make Payment, Track Order, Cancel Order, Accept Order, Update Prep Status, Pick Up Order, Mark Delivered, Give Review).

---

## 19. DOMAIN ANALYSIS
Domain analysis identified the core conceptual entities, boundary interfaces, and control coordinators:
* **Entity Classes:** `User` (Abstract), `Customer`, `RestaurantStaff`, `DeliveryPartner`, `Restaurant`, `FoodItem`, `Category`, `Cart`, `CartItem`, `Order`, `OrderItem`, `Payment`, `Delivery`, `Review`.
* **Boundary Classes:** `LoginPage`, `FoodDiscoveryPage`, `RestaurantMenuPage`, `CheckoutPage`, `PaymentPage`, `OrderTrackingPage`, `Payment Gateway API`.
* **Control Classes:** `AuthController`, `RestaurantController`, `CartController`, `OrderController`, `PaymentController`, `DeliveryController`, `ReviewController`.

---

## 20. CONCEPTUAL DOMAIN CLASS DIAGRAM
* **Diagram File:** [`03_Domain_Class/Domain_Class_Diagram.drawio`](file:///c:/soumya/soumya/UML%20Modeling%20of%20an%20Online%20Shopping%20System/Online_Food_Ordering_System/03_Domain_Class/Domain_Class_Diagram.drawio)
* **Explanation:** Illustrates conceptual domain entities, business attributes, and structural multiplicities (`Customer` 1—1 `Cart`, `Cart` 1—* `CartItem`, `Customer` 1—* `Order`, `Order` 1—1..* `OrderItem`, `Order` 1—1 `Payment`, `Order` 1—1 `Delivery`) without implementation method signatures.

---

## 21. SOFTWARE DESIGN CLASS DIAGRAM
* **Diagram File:** [`03_Domain_Class/Class_Diagram.drawio`](file:///c:/soumya/soumya/UML%20Modeling%20of%20an%20Online%20Shopping%20System/Online_Food_Ordering_System/03_Domain_Class/Class_Diagram.drawio)
* **Explanation:** Complete static design model containing 14 classes with visibility markers (`-` private, `+` public), typed attributes, full method signatures, inheritance hierarchies (`User` $\leftarrow$ `Customer`, `Staff`, `Partner`), compositions (`Cart` $\blacklozenge$--- `CartItem`, `Order` $\blacklozenge$--- `OrderItem`), and associations.

---

## 22. SYSTEM SEQUENCE DIAGRAMS (SSDs)
System Sequence Diagrams model black-box system events where actors generate input events across the system boundary:
* `Customer` $\rightarrow$ `submitLogin(email, pwd)`
* `Customer` $\rightarrow$ `addItemToCart(foodId, qty)`
* `Customer` $\rightarrow$ `placeOrder(cartId, address)`
* `Customer` $\rightarrow$ `authorizePayment(orderId, cardInfo)`
* `Staff` $\rightarrow$ `acceptOrder(orderId, prepTime)`
* `Courier` $\rightarrow$ `confirmDelivery(orderId)`

---

## 23. HIGH-LEVEL SEQUENCE DIAGRAMS
High-level sequence diagrams model end-to-end user transactions across subsystems:
1. **Place Order Transaction:** Customer checkout initiation $\rightarrow$ Cart validation $\rightarrow$ Stock check $\rightarrow$ Order instantiation $\rightarrow$ Payment handoff.
2. **Payment Authorization Transaction:** Payment creation $\rightarrow$ Encrypted Gateway dispatch $\rightarrow$ Gateway authorization/decline $\rightarrow$ Ledger update.

---

## 24. DETAILED SEQUENCE DIAGRAMS
* **Diagram Files (6 Separate Models):**
  1. [`04_Sequence/Login.drawio`](file:///c:/soumya/soumya/UML%20Modeling%20of%20an%20Online%20Shopping%20System/Online_Food_Ordering_System/04_Sequence/Login.drawio) — Customer authentication & session creation.
  2. [`04_Sequence/Browse_Food.drawio`](file:///c:/soumya/soumya/UML%20Modeling%20of%20an%20Online%20Shopping%20System/Online_Food_Ordering_System/04_Sequence/Browse_Food.drawio) — Restaurant catalog search & food querying.
  3. [`04_Sequence/Add_To_Cart.drawio`](file:///c:/soumya/soumya/UML%20Modeling%20of%20an%20Online%20Shopping%20System/Online_Food_Ordering_System/04_Sequence/Add_To_Cart.drawio) — Food stock check, item creation & total recalculation.
  4. [`04_Sequence/Place_Order.drawio`](file:///c:/soumya/soumya/UML%20Modeling%20of%20an%20Online%20Shopping%20System/Online_Food_Ordering_System/04_Sequence/Place_Order.drawio) — Checkout validation, Order & OrderItem instantiation.
  5. [`04_Sequence/Payment.drawio`](file:///c:/soumya/soumya/UML%20Modeling%20of%20an%20Online%20Shopping%20System/Online_Food_Ordering_System/04_Sequence/Payment.drawio) — Payment processing with `alt` success/decline fragments.
  6. [`04_Sequence/Track_Order.drawio`](file:///c:/soumya/soumya/UML%20Modeling%20of%20an%20Online%20Shopping%20System/Online_Food_Ordering_System/04_Sequence/Track_Order.drawio) — Real-time order milestone & courier status query.
* **Explanation:** All diagrams strictly adhere to BCE architecture (`Actor` $\rightarrow$ `Boundary` $\rightarrow$ `Control` $\rightarrow$ `Entity`) with activation bars, synchronous call arrows, and dashed return messages.

---

## 25. ACTIVITY DIAGRAMS
* **Diagram Files (3 Separate Models):**
  1. [`05_Activity/Customer_Order.drawio`](file:///c:/soumya/soumya/UML%20Modeling%20of%20an%20Online%20Shopping%20System/Online_Food_Ordering_System/05_Activity/Customer_Order.drawio) — Customer food ordering workflow with `[Cart Valid?]` and `[Payment Successful?]` decision diamonds and retry loops.
  2. [`05_Activity/Restaurant_Order.drawio`](file:///c:/soumya/soumya/UML%20Modeling%20of%20an%20Online%20Shopping%20System/Online_Food_Ordering_System/05_Activity/Restaurant_Order.drawio) — Kitchen order receipt, acceptance/rejection decisions, food preparation, and courier notification.
  3. [`05_Activity/Order_Delivery.drawio`](file:///c:/soumya/soumya/UML%20Modeling%20of%20an%20Online%20Shopping%20System/Online_Food_Ordering_System/05_Activity/Order_Delivery.drawio) — Courier pickup, address navigation, `[Customer Available?]` decision, delivery handover, and review enablement.
* **Explanation:** Uses standard UML activity notations: initial nodes, action rounded rectangles, decision diamonds with guards, control flow arrows, and activity final nodes.

---

## 26. COMMUNICATION DIAGRAMS
* **Diagram Files (3 Separate Models):**
  1. [`06_Communication/Add_To_Cart.drawio`](file:///c:/soumya/soumya/UML%20Modeling%20of%20an%20Online%20Shopping%20System/Online_Food_Ordering_System/06_Communication/Add_To_Cart.drawio) — Numbered message sequence (`1: selectFood()`, `2: addToCart()`, etc.) emphasizing object links.
  2. [`06_Communication/Place_Order.drawio`](file:///c:/soumya/soumya/UML%20Modeling%20of%20an%20Online%20Shopping%20System/Online_Food_Ordering_System/06_Communication/Place_Order.drawio) — Structural messaging across `Customer`, `CheckoutPage`, `OrderController`, `Cart`, `Order`, `OrderItem`, and `FoodItem`.
  3. [`06_Communication/Payment.drawio`](file:///c:/soumya/soumya/UML%20Modeling%20of%20an%20Online%20Shopping%20System/Online_Food_Ordering_System/06_Communication/Payment.drawio) — Structural messaging between `Customer`, `PaymentPage`, `PaymentController`, `Payment`, `PaymentGateway`, and `Order`.

---

## 27. ORDER STATE MACHINE DIAGRAM
* **Diagram File:** [`07_State/Order_State_Diagram.drawio`](file:///c:/soumya/soumya/UML%20Modeling%20of%20an%20Online%20Shopping%20System/Online_Food_Ordering_System/07_State/Order_State_Diagram.drawio)
* **Explanation:** Models the dynamic lifecycle states of the `Order` entity:
  * **Main Lifecycle:** `Initial` $\rightarrow$ `Pending Payment` $\rightarrow$ `Confirmed` $\rightarrow$ `Preparing` $\rightarrow$ `Ready for Pickup` $\rightarrow$ `Out for Delivery` $\rightarrow$ `Delivered` $\rightarrow$ `Final`.
  * **Exception Transitions:** `Pending Payment` $\xrightarrow{\text{paymentFailed()}}$ `Payment Failed` $\xrightarrow{\text{retryPayment()}}$ `Payment Retry` $\rightarrow$ `Confirmed`; `Pending` $\xrightarrow{\text{cancelOrder()}}$ `Cancelled`; `Pending` $\xrightarrow{\text{rejectOrder()}}$ `Rejected`; `Out for Delivery` $\xrightarrow{\text{deliveryFailed()}}$ `Delivery Failed` $\xrightarrow{\text{reschedule()}}$ `Rescheduled` $\rightarrow$ `Out for Delivery`.

---

## 28. COMPONENT DIAGRAM
* **Diagram File:** [`08_Component/Component_Diagram.drawio`](file:///c:/soumya/soumya/UML%20Modeling%20of%20an%20Online%20Shopping%20System/Online_Food_Ordering_System/08_Component/Component_Diagram.drawio)
* **Explanation:** Illustrates the modular 3-tier software component architecture:
  * **Presentation Tier:** `Customer Interface`, `Restaurant Interface`, `Delivery Interface`.
  * **Application Tier:** `Authentication Module`, `Restaurant/Menu Module`, `Cart Module`, `Order Module`, `Payment Module`, `Delivery Module`, `Review Module`.
  * **Data & External Tier:** `FoodOrderingDB` and `External Payment Gateway`.
  * Connected via dashed `<<use>>` and `<<read/write>>` dependencies.

---

## 29. DEPLOYMENT DIAGRAM
* **Diagram File:** [`09_Deployment/Deployment_Diagram.drawio`](file:///c:/soumya/soumya/UML%20Modeling%20of%20an%20Online%20Shopping%20System/Online_Food_Ordering_System/09_Deployment/Deployment_Diagram.drawio)
* **Explanation:** Models physical hardware nodes, software execution artifacts, and communication protocols:
  * **Client Devices (`<<device>>`):** `Customer Device` *(Smartphones)*, `Restaurant Staff Device` *(Kitchen Tablets)*, `Delivery Partner Device` *(Handsets)* communicating over `HTTPS`.
  * **Application Server (`<<device>>`):** Hosts core API runtime (`FoodOrderingCoreAPI.jar`, `PaymentIntegrationService.js`).
  * **Database Server (`<<device>>`):** Hosts relational database (`FoodOrderingDB.sql`) connected via `JDBC / TCP`.
  * **Payment Gateway Server (`<<device>>`):** Cloud banking server communicating via secure `HTTPS / REST API`.

---

## 30. BOUNDARY-CONTROL-ENTITY (BCE) ARCHITECTURE
The system uniformly implements the BCE architectural pattern to ensure clean separation of concerns, high cohesion, and low coupling:

```
+------------------+          +-------------------+          +-------------------+
|  BOUNDARY LAYER  | -------->|   CONTROL LAYER   | -------->|   ENTITY LAYER    |
| (UI & API Nodes) |  Calls   | (Business Logic)  | Modifies | (Persistent State)|
+------------------+          +-------------------+          +-------------------+
| - LoginPage      |          | - AuthController  |          | - User / Customer |
| - CheckoutPage   |          | - OrderController |          | - Cart / CartItem |
| - PaymentPage    |          | - PayController   |          | - Order / Payment |
| - Gateway API    |          | - MenuController  |          | - Restaurant/Food |
+------------------+          +-------------------+          +-------------------+
```

---

## 31. CONCLUSION & REVIEW 2 ROADMAP
The **Review 1 Analysis and Design phase** for the **Online Food Ordering System** has been successfully completed with 100% cross-model consistency across all requirements, use cases, domain entities, design classes, sequence traces, activity workflows, state machines, component packages, and deployment topologies.

### Review 2 Implementation Roadmap:
1. **Database Implementation:** Construct relational DDL schemas with foreign keys matching [`Class_Diagram.drawio`](file:///c:/soumya/soumya/UML%20Modeling%20of%20an%20Online%20Shopping%20System/Online_Food_Ordering_System/03_Domain_Class/Class_Diagram.drawio).
2. **Backend API Construction:** Implement REST controllers matching Control classes and service layers.
3. **Frontend UI Integration:** Develop responsive client applications corresponding to Boundary classes.
4. **Testing & Validation:** Execute unit tests and end-to-end integration tests validating all Use Case exception flows.
5. **Final Project Demonstration:** Deploy on containerized infrastructure for Review 2 evaluation.

---
*Report compiled, validated, and finalized for Academic Review 1.*
