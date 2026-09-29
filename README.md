# Chow Chow Retro Diner & Eats — Online Food Ordering & Delivery Management System

A full-stack food ordering and delivery platform featuring **Collaborative Group Ordering**, real-time order lifecycle tracking, simulated payments, role-based access control, and a vintage roadside diner aesthetic.

- **Frontend**: React 18, Vite, React Router 6, Tailwind CSS, Axios
- **Backend**: Java 21 LTS, Spring Boot 3.3.4 (Spring Web, Spring Security, Spring Data JPA, Bean Validation), JJWT 0.12.5, Maven
- **Database**: MySQL 8+ / Hibernate JPA (with optional H2 in-memory test profile)

---

## 📋 Table of Contents
1. [Architecture & UML Overview](#-architecture--uml-overview)
2. [Database Setup (MySQL 8)](#-database-setup-mysql-8)
3. [Running the Application](#-running-the-application)
   - [Running the Backend](#1-running-the-backend-spring-boot)
   - [Running the Frontend](#2-running-the-frontend-react--vite)
4. [Test User Logins](#-test-user-logins)
5. [Order Lifecycle State Chart](#-order-lifecycle-state-chart)
6. [Complete REST API Endpoints List](#-complete-rest-api-endpoints-list)
7. [Collaborative Group Ordering Workflow](#-collaborative-group-ordering-workflow)

---

## 🏛️ Architecture & UML Overview

The system strictly adheres to layered architecture:
`Controller` ➔ `Service` ➔ `Repository` ➔ `Entity`, communicating via typed DTOs and validated with Bean Validation.

### Core Entities:
- **`User`**: `id`, `name`, `email` (unique), `password` (BCrypt), `phone`, `address`, `role` (`CUSTOMER`, `RESTAURANT`, `DELIVERY_PARTNER`, `ADMIN`), `active`
- **`Restaurant`**: `id`, `owner` (`User`), `name`, `cuisine`, `address`, `rating`, `open`, `imageUrl`
- **`FoodItem`**: `id`, `restaurant`, `name`, `description`, `price`, `imageUrl`, `category`, `badgeText`, `prepTimeMins`, `available`
- **`Cart`** & **`CartItem`**: Persistent customer carts and items
- **`Order`** & **`OrderItem`**: Historical and active orders with snapshot prices
- **`Payment`**: Simulated payment records (`PENDING`, `PAID`, `FAILED`, `REFUNDED`), `transactionRef`, `paidAt`
- **`Delivery`**: Courier dispatches (`ASSIGNED`, `PICKED_UP`, `DELIVERED`, `CANCELLED`), timestamps
- **`GroupOrder`**, **`GroupMember`**, **`GroupCartItem`**: Collaborative booth sessions with unique generated codes (`BOOTH-XXX`), shared carts, and dual delivery modes (`COMMON` or `INDIVIDUAL`)

---

## 🗄️ Database Setup (MySQL 8)

### 1. Create the Database
Open your MySQL CLI or MySQL Workbench:
```sql
CREATE DATABASE IF NOT EXISTS food_ordering_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configure Environment Variables
The backend reads database credentials from environment variables with safe localhost defaults. **Do not hardcode passwords.**

#### Windows (PowerShell):
```powershell
$env:DB_URL = "jdbc:mysql://localhost:3306/food_ordering_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "your_mysql_password"
```

#### Linux / macOS (Bash / Zsh):
```bash
export DB_URL="jdbc:mysql://localhost:3306/food_ordering_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
export DB_USERNAME="root"
export DB_PASSWORD="your_mysql_password"
```

*(If using default root with no password on localhost:3306, the default settings in `application.properties` will connect automatically).*

---

## 🚀 Running the Application

### 1. Running the Backend (Spring Boot)
Navigate to the `backend/` directory:
```bash
cd backend
mvn spring-boot:run
```
The Spring Boot server starts at: **`http://localhost:8080`**

*(Note: An optional in-memory profile is provided for instant zero-config testing: `mvn spring-boot:run "-Dspring-boot.run.profiles=h2"`).*

### 2. Running the Frontend (React + Vite)
In the project root directory:
```bash
npm install
npm run dev
```
The React frontend starts at: **`http://localhost:3000`** (or `http://localhost:5173`)

---

## 👥 Test User Logins

The application automatically seeds the following test accounts with BCrypt-hashed passwords upon startup:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **`CUSTOMER`** | `customer1@chowchow.com` | `cust123` | Sally Brady (Booth 4) |
| **`CUSTOMER`** | `customer2@chowchow.com` | `cust123` | Johnny Nitro |
| **`RESTAURANT`** | `owner@chowchow.com` | `owner123` | Big Bill (Burger Emporium Owner) |
| **`DELIVERY_PARTNER`** | `driver@chowchow.com` | `driver123` | Speedy Sam (Courier) |
| **`ADMIN`** | `admin@chowchow.com` | `admin123` | Sally Boss (System Admin) |

---

## 🔄 Order Lifecycle State Chart

The server strictly validates order transitions. Invalid jumps are rejected with HTTP 400 Bad Request:

```
[PLACED] ───────► [CONFIRMED] ───────► [PREPARING] ───────► [READY_FOR_PICKUP] ───────► [OUT_FOR_DELIVERY] ───────► [DELIVERED]
   │                   │                     │                      │
   └───────────────────┴─────────────────────┴──────────────────────┴──────► [CANCELLED]
```

- `PLACED` ➔ `CONFIRMED` or `CANCELLED`
- `CONFIRMED` ➔ `PREPARING` or `CANCELLED`
- `PREPARING` ➔ `READY_FOR_PICKUP` or `CANCELLED`
- `READY_FOR_PICKUP` ➔ `OUT_FOR_DELIVERY` (assigns courier)
- `OUT_FOR_DELIVERY` ➔ `DELIVERED`

---

## 📡 Complete REST API Endpoints List

Base URL: `http://localhost:8080/api`

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Public | Register new customer or restaurant account |
| `POST` | `/auth/login` | Public | Authenticate credentials, returns JWT & role |
| `GET` | `/auth/me` | Authenticated | Retrieve current user profile |

### 2. Restaurants & Menu (`/api/restaurants`, `/api/menu`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/restaurants` | Public | List all active diners/restaurants |
| `GET` | `/restaurants/{id}` | Public | Get single restaurant details |
| `GET` | `/restaurants/{id}/menu` | Public | Get menu items for specific restaurant |
| `GET` | `/menu` | Public | Get all 12 diner items (used by Hero Carousel) |
| `POST` | `/restaurants/{id}/menu` | Restaurant/Admin | Add new food item |
| `PUT` | `/restaurants/{id}/menu/{itemId}` | Restaurant/Admin | Update food item details |
| `DELETE` | `/restaurants/{id}/menu/{itemId}` | Restaurant/Admin | Delete food item |
| `PATCH` | `/restaurants/{id}/menu/{itemId}/availability` | Restaurant/Admin | Toggle available boolean |

### 3. Individual Cart (`/api/cart`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/cart` | Customer | View current customer's cart & total |
| `POST` | `/cart/items` | Customer | Add food item to cart (`{ foodItemId, quantity }`) |
| `PUT` | `/cart/items/{itemId}?quantity=X` | Customer | Update item quantity in cart |
| `DELETE` | `/cart/items/{itemId}` | Customer | Remove single item from cart |
| `DELETE` | `/cart` | Customer | Empty the entire cart |

### 4. Orders (`/api/orders`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/orders` | Customer | Checkout from cart $\rightarrow$ creates order in `PLACED` status |
| `GET` | `/orders/my` | Customer | Order history of logged-in customer |
| `GET` | `/orders/{id}` | Owner/Restaurant/Driver/Admin | Single order tracking & details |
| `PATCH` | `/orders/{id}/status` | Restaurant/Driver/Admin | Advance order status per state chart |

### 5. Payments (`/api/payments`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/payments` | Customer | Simulate payment (`{ orderId, method }`) $\rightarrow$ `PAID` / `FAILED` |
| `GET` | `/payments/order/{orderId}` | Authenticated | Fetch payment receipt & transaction ref |

### 6. Deliveries (`/api/deliveries`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/deliveries/assigned` | Delivery Partner | View orders assigned to logged-in courier |
| `PATCH` | `/deliveries/{id}/status` | Delivery Partner | Update status (`PICKED_UP`, `DELIVERED`) |

### 7. Collaborative Group Ordering (`/api/group-orders`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/group-orders` | Customer | Create group session with name, generates unique `groupCode` |
| `POST` | `/group-orders/join` | Customer | Join existing group session via `groupCode` |
| `GET` | `/group-orders/{id}` | Member | View group order, members, tray items & totals |
| `GET` | `/group-orders/code/{code}` | Member | Lookup group order by `groupCode` (e.g. `BOOTH-942`) |
| `POST` | `/group-orders/{id}/items` | Member | Add item to member tray in group cart |
| `DELETE` | `/group-orders/{id}/items/{itemId}` | Member/Organizer | Remove item from group cart |
| `PATCH` | `/group-orders/{id}/delivery-mode` | Organizer | Toggle `COMMON` or `INDIVIDUAL` delivery mode |
| `POST` | `/group-orders/{id}/place` | Organizer | Finalize group and generate order(s) |
| `PATCH` | `/group-orders/{id}/restaurant-action` | Restaurant | Kitchen Accept/Reject. On reject, payments are `REFUNDED` |

### 8. System Admin (`/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/users` | Admin | List all registered users |
| `GET` | `/admin/restaurants` | Admin | List all restaurants |
| `GET` | `/admin/orders` | Admin | View all platform orders |
| `GET` | `/admin/payments` | Admin | View all payment logs |
| `GET` | `/admin/deliveries` | Admin | View all delivery assignments |
| `PATCH` | `/admin/users/{id}/active?active=bool` | Admin | Enable/disable user accounts |

---

## 👥 Collaborative Group Ordering Workflow

1. **Host Creates Booth**: Organizer calls `POST /api/group-orders` with `{ name: "Friday Office Feast", restaurantId: 1, deliveryMode: "COMMON" }`. Server responds with a unique code like `BOOTH-942` and assigns the creator as organizer and first member.
2. **Peers Join Table**: Teammates submit `POST /api/group-orders/join` with `{ groupCode: "BOOTH-942" }`.
3. **Collaborative Tray Selection**: Any member calls `POST /api/group-orders/{id}/items` to add items to their personal tray. The server validates availability and updates the live group count and total.
4. **Split Mode**: Organizer can toggle delivery mode between `COMMON` (one combined order delivered together) and `INDIVIDUAL` (individual orders created per member).
5. **Checkout**: Organizer calls `POST /api/group-orders/{id}/place`. The group is locked and finalized, order records are created, and payments are logged.

---

## 👨‍🍳 Restaurant Owner Interface (`/restaurant/*`)

The Restaurant Interface gives diner owners full operational control over kitchen tickets, booth dispatching, diner catalogs, settlement ledgers, and delivery monitors in the exact retro 1970s roadside diner aesthetic.

### Owner Routes:
- `/restaurant/dashboard`: 4 retro stat cards (Today's Orders, Pending Tickets, Revenue, Menu Catalog), latest 5 incoming tickets, and waiting collaborative group booths.
- `/restaurant/orders`: Status tabs (`All`, `New`, `Confirmed`, `Preparing`, `Ready for Pickup`, `Out for Delivery`, `Delivered`, `Cancelled`), strict UML state chart transition buttons (`ACCEPT`, `START PREPARING`, `MARK READY FOR PICKUP`, `REJECT` with refund modal).
- `/restaurant/group-orders`: Collaborative booth queue with booth codes, member breakdowns, individual items per guest, delivery mode badges (`COMMON` / `INDIVIDUAL`), Review modal, Accept, and Reject with reason.
- `/restaurant/menu`: Menu items catalog matching hero menu carousel cards with photo, ribbon badges, prep-time pills, prices, live availability toggle, Add/Edit modal, and Delete confirmation.
- `/restaurant/payments`: Thick-bordered vintage cash register ledger displaying order ID, customer reference, amounts, payment method, and status badges (`PAID`, `PENDING`, `REFUNDED`).
- `/restaurant/deliveries`: Courier dispatch tracking list showing courier partner info, customer addresses, live delivery status, and timestamps.
- `/restaurant/profile`: Restaurant settings form (name, cuisine, address, banner image, Open/Closed toggle) with live customer card preview.

### Accessing the Interface:
1. Navigate to `http://localhost:3000/login`
2. Click **👨‍🍳 Restaurant Owner** (or use `owner@chowchow.com` / `owner123`)
3. You will be automatically redirected to `/restaurant/dashboard`.
