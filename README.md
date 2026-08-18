# 🍕 Online Food Ordering System — UML Design & Analysis

> A comprehensive **Object-Oriented Analysis and Design (OOAD)** project that models an Online Food Ordering System using industry-standard **UML diagrams**. This repository contains the complete software engineering lifecycle documentation — from requirements gathering to deployment modeling.

---

## 📋 Project Overview

The **Online Food Ordering System** is an interactive, multi-user web and mobile application designed to connect **Customers**, **Restaurants**, and **Delivery Partners** on a unified digital platform. The system streamlines the entire food ordering lifecycle:

- 🔍 Discovering local restaurants and browsing menus
- 🛒 Adding items to cart and placing orders
- 💳 Processing secure digital payments
- 🍳 Managing real-time food preparation
- 🚚 Coordinating doorstep delivery
- ⭐ Submitting customer reviews and ratings

---

## 🎯 Problem Statement

Traditional food ordering methods (phone calls, paper menus, manual pickups) suffer from:

| Problem | Impact |
|---------|--------|
| Communication Errors | Incorrect orders, pricing disputes |
| No Live Visibility | Customers can't track order or delivery status |
| Manual Order Handling | Kitchen delays during peak hours |
| Disorganized Delivery | No digital routing for delivery personnel |

This project addresses these problems through an **automated, transparent, and role-based** software solution.

---

## 📁 Repository Structure

```
Online_Food_Ordering_System/
│
├── 01_Requirements/
│   ├── Software_Requirements_Specification.md   # Complete SRS document
│   └── Event_Table.md                           # System event table
│
├── 02_Use_Case/
│   ├── 01_Use_Case_Diagram.drawio               # Use case diagram (draw.io)
│   └── Use_Case_Specifications.md               # Detailed use case specs
│
├── 03_Domain_Class/
│   ├── Domain_Class_Diagram.drawio              # Domain model
│   └── Class_Diagram.drawio                     # Detailed class diagram
│
├── 03_Use_Case/
│   └── Use_Case_Specifications.md               # Additional use case details
│
├── 04_Sequence/
│   ├── Sequence_Login.drawio                    # Login sequence
│   ├── Sequence_Browse_Food.drawio              # Browse food sequence
│   ├── Sequence_Add_To_Cart.drawio              # Add to cart sequence
│   ├── Sequence_Place_Order.drawio              # Place order sequence
│   ├── Sequence_Payment.drawio                  # Payment processing sequence
│   └── Sequence_Track_Order.drawio              # Order tracking sequence
│
├── 05_Activity/
│   ├── Activity_Customer_Order.drawio           # Customer ordering workflow
│   ├── Activity_Restaurant_Order.drawio         # Restaurant order management
│   └── Activity_Order_Delivery.drawio           # Delivery workflow
│
├── 06_State/ & 07_State/
│   └── Order_State_Diagram.drawio               # Order lifecycle states
│
├── 06_Communication/ & 07_Communication/
│   ├── Communication_Add_To_Cart.drawio         # Add to cart interactions
│   ├── Communication_Payment.drawio             # Payment interactions
│   └── Communication_Place_Order.drawio         # Place order interactions
│
├── 08_Component/
│   └── Component_Diagram.drawio                 # System component architecture
│
├── 09_Deployment/
│   └── Deployment_Diagram.drawio                # Deployment infrastructure
│
├── 10_Documentation/                            # Project documentation
├── 11_Final_Review/                             # Final review materials
└── 12_Viva/                                     # Viva preparation
```

---

## 📊 UML Diagrams Included

| # | Diagram Type | Description |
|---|-------------|-------------|
| 1 | **Use Case Diagram** | Captures all system actors (Customer, Restaurant, Delivery Partner, Payment Gateway) and their interactions |
| 2 | **Domain Class Diagram** | Models the key domain entities and their relationships |
| 3 | **Class Diagram** | Detailed class structure with attributes, methods, and associations |
| 4 | **Sequence Diagrams** | Step-by-step message flows for Login, Browse Food, Add to Cart, Place Order, Payment, and Track Order |
| 5 | **Activity Diagrams** | Workflow modeling for Customer Ordering, Restaurant Management, and Delivery processes |
| 6 | **State Diagram** | Order lifecycle state transitions (Placed → Confirmed → Preparing → Out for Delivery → Delivered) |
| 7 | **Communication Diagrams** | Object interaction patterns for Add to Cart, Payment, and Place Order |
| 8 | **Component Diagram** | High-level system architecture showing component dependencies |
| 9 | **Deployment Diagram** | Physical infrastructure and deployment topology |

---

## 🛠️ Tools & Technologies

- **Diagramming Tool:** [draw.io (diagrams.net)](https://app.diagrams.net/) — All `.drawio` files can be opened directly
- **Documentation:** Markdown (`.md`) files
- **Methodology:** Object-Oriented Analysis and Design (OOAD)
- **Notation:** UML 2.0

---

## 🚀 How to View the Diagrams

1. **Online:** Open any `.drawio` file directly on [diagrams.net](https://app.diagrams.net/) by importing the file
2. **VS Code:** Install the [Draw.io Integration](https://marketplace.visualstudio.com/items?itemName=hediet.vscode-drawio) extension
3. **Desktop:** Download [draw.io Desktop](https://github.com/jgraph/drawio-desktop/releases) and open the files locally

---

## 👥 System Actors

| Actor | Role |
|-------|------|
| **Customer** | Registers, browses restaurants/menus, places orders, makes payments, tracks delivery, submits reviews |
| **Restaurant** | Manages menu items, accepts/rejects orders, updates preparation status |
| **Delivery Partner** | Receives delivery assignments, picks up orders, updates transit status, completes delivery |
| **Payment Gateway** | Processes payments, handles refunds, verifies transactions |
| **System Administrator** | Manages platform operations, user accounts, and system configuration |

---

## 📌 Key Features Modeled

- ✅ User registration & role-based authentication
- ✅ Restaurant discovery & menu browsing
- ✅ Shopping cart operations (add, update, remove items)
- ✅ Order placement & checkout workflow
- ✅ Payment gateway integration
- ✅ Real-time order tracking
- ✅ Restaurant order acceptance & kitchen status updates
- ✅ Delivery partner assignment & routing
- ✅ Order cancellation with refund processing
- ✅ Customer ratings & reviews

---

## 📄 Documentation

- **[Software Requirements Specification (SRS)](01_Requirements/Software_Requirements_Specification.md)** — Complete requirements analysis
- **[Event Table](01_Requirements/Event_Table.md)** — System events and responses
- **[Use Case Specifications](02_Use_Case/Use_Case_Specifications.md)** — Detailed use case descriptions

---

## 📝 Course Information

- **Course:** Object-Oriented Analysis and Design (OOAD) / Software Engineering
- **Phase:** Complete UML Design & Analysis
- **Target Environment:** Web & Mobile Food Delivery Platform

---

## 📜 License

This project is created for **academic and educational purposes**. Feel free to use it as a reference for your own OOAD/Software Engineering coursework.

---

<p align="center">
  <i>⭐ If you found this project helpful, please consider giving it a star!</i>
</p>
