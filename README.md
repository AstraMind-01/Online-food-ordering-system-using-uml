# Online Food Ordering System (UML Modeling & OOAD Project)

![UML 2.5](https://img.shields.io/badge/UML-2.5-blue.svg)
![Architecture](https://img.shields.io/badge/Architecture-BCE%203--Tier-green.svg)
![Diagrams](https://img.shields.io/badge/Format-draw.io%20%2F%20diagrams.net-orange.svg)
![Academic Review](https://img.shields.io/badge/Academic-Review%201%20Ready-brightgreen.svg)

A complete, standards-compliant **Object-Oriented Analysis and Design (OOAD)** repository for an **Online Food Ordering System**. This project models the complete restaurant ordering lifecycle—from customer menu discovery, cart composition, and digital payments to kitchen order processing, live delivery tracking, and post-delivery ratings.

All diagrams are built natively as diagrams.net (`.drawio`) XML models and accompanied by formal specifications, requirements, event tables, and laboratory documentation.

---

## 📁 Repository Structure

```text
Online-food-ordering-system-using-uml/
│
├── 01_Requirements/
│   ├── SRS.md                                  # Full Software Requirements Specification
│   ├── Functional_Requirements.md              # FR-01 to FR-35 categorized by 4 actors
│   ├── Non_Functional_Requirements.md          # NFR-01 to NFR-07 (Security, Performance, ACID)
│   ├── Business_Rules.md                       # BR-01 to BR-08 (Cart, Kitchen, Refund, Taxes)
│   ├── Event_List.md                           # EV-01 to EV-18 System Events
│   └── Event_Table.md                          # Tabular Event Traceability Matrix
│
├── 02_Use_Case/
│   ├── Use_Case_Diagram.drawio                 # 29 Use Cases across 5 functional packages
│   └── Use_Case_Specifications.md              # 16 Detailed Behavioral Specifications
│
├── 03_Domain_Class/
│   ├── Domain_Class_Diagram.drawio             # Conceptual Domain Model (14 Domain Entities)
│   └── Class_Diagram.drawio                    # Full Design Class Model with Methods & Visibilities
│
├── 04_Sequence/
│   ├── Login.drawio                            # Customer Authentication & Session Creation
│   ├── Browse_Food.drawio                      # Restaurant Catalog Search & Menu Query
│   ├── Add_To_Cart.drawio                      # Stock Verification & Cart Total Recalculation
│   ├── Place_Order.drawio                      # Checkout Validation & Order Line Item Creation
│   ├── Payment.drawio                          # Payment Gateway Authorization & Alt Branches
│   └── Track_Order.drawio                      # Real-Time Order & Courier GPS Status Query
│
├── 05_Activity/
│   ├── Customer_Order.drawio                   # Customer Food Ordering & Checkout Workflow
│   ├── Restaurant_Order.drawio                 # Kitchen Order Receipt, Prep & Packing Flow
│   └── Order_Delivery.drawio                   # Courier Pickup, Handover & Delivery Exceptions
│
├── 06_Communication/
│   ├── Add_To_Cart.drawio                      # Numbered Add to Cart Object Messaging
│   ├── Place_Order.drawio                      # Numbered Place Order Object Messaging
│   └── Payment.drawio                          # Numbered Payment Gateway Object Messaging
│
├── 07_State/
│   └── Order_State_Diagram.drawio              # Order Lifecycle State Machine Diagram
│
├── 08_Component/
│   └── Component_Diagram.drawio                # 3-Tier Modular Component Architecture
│
├── 09_Deployment/
│   └── Deployment_Diagram.drawio               # Physical Nodes, Artifacts & Protocols Topology
│
├── 10_Documentation/
│   └── OOAD_Lab_Experiments_1-6.md            # Complete Laboratory Experiments Portfolio (Exp 1–6)
│
├── 10_Package/
│   └── Package_Diagram.drawio                  # 8 Modular Packages with <<use>> Dependencies
│
├── 11_Final_Review/
│   └── Review_1_Report.md                      # Comprehensive Review 1 Submission Report (31 Sections)
│
├── 11_Object/
│   └── Object_Diagram.drawio                   # Runtime Active Snapshot of Order #ORD-501
│
└── 12_Viva/
    └── Viva_Questions.md                       # 150 High-Yield OOAD & UML Viva Q&A Guide
```

---

## 👥 Core System Actors

1. **Customer (Primary Actor):** Discovers restaurants, customizes food items, manages carts, checks out, tracks deliveries, and posts dining reviews.
2. **Restaurant Staff (Business Actor):** Manages menu catalogs, updates dish prices and stock availability, accepts/rejects orders, and updates preparation statuses.
3. **Delivery Partner (Logistics Actor):** Accepts delivery assignments, confirms restaurant food pickup, navigates to customer addresses, and confirms handover.
4. **Payment Gateway (External System Actor):** Authorizes encrypted electronic transactions, validates funds, and processes automated refunds.

---

## 🏗️ Architectural Highlights

* **Boundary-Control-Entity (BCE) Pattern:** Decouples user interfaces (`Boundary`), business coordinators (`Control`), and persistent data models (`Entity`).
* **Multiplicities & Compositions:** Enforces strict lifecycle dependencies such as `Cart` $\blacklozenge$--- `CartItem` and `Order` $\blacklozenge$--- `OrderItem`.
* **State Machine Consistency:** Models complete order transitions from `Pending Payment` $\rightarrow$ `Confirmed` $\rightarrow$ `Preparing` $\rightarrow$ `Ready for Pickup` $\rightarrow$ `Out for Delivery` $\rightarrow$ `Delivered` with cancellation and refund branches.
* **Standards Compliant:** Native `.drawio` XML files compatible with [diagrams.net](https://app.diagrams.net) / draw.io desktop app.

---

## 🚀 How to View the Diagrams

1. Open [diagrams.net](https://app.diagrams.net) in any modern web browser.
2. Click **Open Existing Diagram**.
3. Select any `.drawio` file from the `02_Use_Case/`, `03_Domain_Class/`, `04_Sequence/`, `05_Activity/`, `06_Communication/`, `07_State/`, `08_Component/`, `09_Deployment/`, `10_Package/`, or `11_Object/` folders.

---

## 📄 License & Attribution
Designed for academic computer science & engineering courses in Object-Oriented Analysis and Design (OOAD) and Software Engineering.
