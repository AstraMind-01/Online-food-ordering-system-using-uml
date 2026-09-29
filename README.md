# Online Food Ordering & Delivery System (OOAD UML Portfolio & Full-Stack Platform)

![UML 2.5](https://img.shields.io/badge/UML-2.5-blue.svg)
![Architecture](https://img.shields.io/badge/Architecture-BCE%203--Tier-green.svg)
![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Tailwind%20%7C%20Vite-61dafb.svg)
![Backend](https://img.shields.io/badge/Backend-Java%2021%20%7C%20Spring%20Boot%203.3.4-6db33f.svg)
![Database](https://img.shields.io/badge/Database-MySQL%208%20%2F%20H2%20In--Memory-4479a1.svg)
![Diagrams](https://img.shields.io/badge/Format-draw.io%20%2F%20diagrams.net-orange.svg)
![Academic Review](https://img.shields.io/badge/Academic-Review%20Ready-brightgreen.svg)

A complete, production-ready **Object-Oriented Analysis and Design (OOAD)** repository and companion **Full-Stack Food Ordering Platform** featuring **Collaborative Group Ordering**, real-time order lifecycle tracking, simulated payments, role-based access control, and a vintage roadside diner aesthetic.

All UML diagrams are built natively as diagrams.net (`.drawio`) XML models and accompanied by formal specifications, requirements, event tables, and laboratory documentation, paired with a complete working React & Spring Boot software implementation.

---

## 📋 Table of Contents
1. [Repository Structure](#-repository-structure)
2. [UML & OOAD Portfolio](#-uml--ooad-portfolio)
3. [Running the Application Locally](#-running-the-application-locally)
   - [Backend Setup (Spring Boot)](#1-running-the-backend-spring-boot)
   - [Frontend Setup (React + Vite)](#2-running-the-frontend-react--vite)
4. [Test User Logins](#-test-user-logins)
5. [Application Portals](#-application-portals)
6. [Core System Actors](#-core-system-actors)
7. [Architectural Highlights](#-architectural-highlights)

---

## 📁 Repository Structure

```text
Online-food-ordering-system-using-uml/
│
├── 01_Requirements/                           # Full SRS, Functional & Non-Functional Specifications
│   ├── SRS.md
│   ├── Functional_Requirements.md
│   ├── Non_Functional_Requirements.md
│   ├── Business_Rules.md
│   ├── Event_List.md
│   └── Event_Table.md
│
├── 02_Use_Case/                               # 29 Use Cases across 5 functional packages
│   ├── Use_Case_Diagram.drawio
│   └── Use_Case_Specifications.md
│
├── 03_Domain_Class/                           # Conceptual Domain Model & Full Design Class Diagram
│   ├── Domain_Class_Diagram.drawio
│   └── Class_Diagram.drawio
│
├── 04_Sequence/                               # Dynamic interaction sequence diagrams
│   ├── Login.drawio
│   ├── Browse_Food.drawio
│   ├── Add_To_Cart.drawio
│   ├── Place_Order.drawio
│   ├── Payment.drawio
│   └── Track_Order.drawio
│
├── 05_Activity/                               # Workflow & orchestration flows
│   ├── Customer_Order.drawio
│   ├── Restaurant_Order.drawio
│   └── Order_Delivery.drawio
│
├── 06_Communication/                          # Numbered object collaboration models
│   ├── Add_To_Cart.drawio
│   ├── Place_Order.drawio
│   └── Payment.drawio
│
├── 07_State/                                  # Lifecycle State Machine Diagram
│   └── Order_State_Diagram.drawio
│
├── 08_Component/                              # 3-Tier Component Architecture Diagram
│   └── Component_Diagram.drawio
│
├── 09_Deployment/                             # Hardware, Nodes & Network Topology
│   └── Deployment_Diagram.drawio
│
├── 10_Documentation/                          # Complete Lab Experiments Portfolio (Exp 1–6)
│   └── OOAD_Lab_Experiments_1-6.md
│
├── 10_Package/                                # 8 Modular Packages with <<use>> dependencies
│   └── Package_Diagram.drawio
│
├── 11_Final_Review/                           # Comprehensive Review 1 Submission Report
│   └── Review_1_Report.md
│
├── 11_Object/                                 # Runtime Active Object Snapshot
│   └── Object_Diagram.drawio
│
├── 12_Viva/                                   # 150 High-Yield OOAD & UML Viva Q&A Guide
│   └── Viva_Questions.md
│
├── backend/                                   # Full-Stack Spring Boot 3.3.4 Application (Java 21)
│   ├── src/main/java/com/chowchow/foodordering/
│   │   ├── entity/                            # JPA Entities (User, Order, Payment, Delivery, etc.)
│   │   ├── repository/                        # Spring Data Repositories
│   │   ├── service/                           # Business Logic & Orchestration
│   │   ├── controller/                        # REST API Controllers
│   │   └── security/                          # Spring Security 6 & JJWT 0.12.5
│   └── pom.xml
│
└── src/                                       # Full-Stack React 18 + Vite Frontend
    ├── components/                            # Reusable Retro Diner UI & Navigation
    ├── pages/                                 # Customer, Restaurant, Delivery & Admin Views
    └── services/                              # Axios REST Client & STOMP WebSocket Service
```

---

## 🚀 Running the Application Locally

### 1. Running the Backend (Spring Boot)
Requirements: Java 21 LTS, Maven 3.8+

```bash
cd backend

# Run with instant zero-config in-memory H2 database (recommended for testing):
mvn spring-boot:run "-Dspring-boot.run.profiles=h2"

# Or run with MySQL 8:
mvn spring-boot:run
```
Backend API will be listening at: `http://localhost:8080/api`

### 2. Running the Frontend (React + Vite)
Requirements: Node.js 18+

```bash
# In the project root directory:
npm install
npm run dev
```
Frontend web application will start at: `http://localhost:3000`

---

## 👥 Test User Logins

The application automatically seeds the following test accounts with BCrypt-hashed credentials:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **`CUSTOMER`** | `customer1@chowchow.com` | `cust123` | Sally Brady (Booth 4) |
| **`CUSTOMER`** | `customer2@chowchow.com` | `cust123` | Johnny Nitro |
| **`RESTAURANT`** | `owner@chowchow.com` | `owner123` | Big Bill (Burger Emporium Owner) |
| **`DELIVERY_PARTNER`** | `driver@chowchow.com` | `driver123` | Axel "Speedy" Vance |
| **`ADMIN`** | `admin@chowchow.com` | `admin123` | Sally Boss |

---

## 🌐 Application Portals

* **🍔 Customer Portal** (`/`, `/restaurants`, `/group-ordering`, `/track-order`, `/diner-dashboard`)
  * Browse diner menus with INR (`₹`) pricing, join collaborative ordering booths, checkout, and live-track courier drops.
* **👨‍🍳 Restaurant Owner Panel** (`/restaurant/dashboard`, `/restaurant/orders`, `/restaurant/menu`, `/restaurant/payments`)
  * Real-time kitchen display system (KDS), menu manager, financial settlements, and dispatch desk.
* **🏍️ Delivery Partner Portal** (`/delivery/dashboard`, `/delivery/available`, `/delivery/deliveries`, `/delivery/history`)
  * Courier dashboard to accept pickup tickets, navigate delivery routes, and track daily tips/earnings.
* **⚡ Administrator Panel** (`/admin/dashboard`)
  * System-wide platform metrics, active diners, and user governance.

---

## 👥 Core System Actors

1. **Customer (Primary Actor):** Discovers restaurants, customizes food items, manages carts, checks out, tracks deliveries, and posts dining reviews.
2. **Restaurant Staff (Business Actor):** Manages menu catalogs, updates dish prices and stock availability, accepts/rejects orders, and updates preparation statuses.
3. **Delivery Partner (Logistics Actor):** Accepts delivery assignments, confirms restaurant food pickup, navigates to customer addresses, and confirms handover.
4. **Payment Gateway (External System Actor):** Authorizes encrypted electronic transactions, validates funds, and processes automated refunds.

---

## 🏗️ Architectural Highlights

* **Layered 3-Tier Architecture:** `Controller` ➔ `Service` ➔ `Repository` ➔ `Entity`, communicating via typed DTOs and validated with Bean Validation.
* **Boundary-Control-Entity (BCE) Pattern:** Decouples user interfaces (`Boundary`), business coordinators (`Control`), and persistent data models (`Entity`).
* **Multiplicities & Compositions:** Enforces strict lifecycle dependencies such as `Cart` $\blacklozenge$--- `CartItem` and `Order` $\blacklozenge$--- `OrderItem`.
* **State Machine Consistency:** Models complete order transitions from `PLACED` $\rightarrow$ `CONFIRMED` $\rightarrow$ `PREPARING` $\rightarrow$ `READY_FOR_PICKUP` $\rightarrow$ `OUT_FOR_DELIVERY` $\rightarrow$ `DELIVERED`.
* **Standards Compliant:** Native `.drawio` XML files compatible with [diagrams.net](https://app.diagrams.net) / draw.io desktop app.

---

## 🚀 How to View the Diagrams

1. Open [diagrams.net](https://app.diagrams.net) in any modern web browser.
2. Click **Open Existing Diagram**.
3. Select any `.drawio` file from the `02_Use_Case/`, `03_Domain_Class/`, `04_Sequence/`, `05_Activity/`, `06_Communication/`, `07_State/`, `08_Component/`, `09_Deployment/`, `10_Package/`, or `11_Object/` folders.

---

## 📄 License & Attribution
Designed for academic computer science & engineering courses in Object-Oriented Analysis and Design (OOAD) and Software Engineering.
