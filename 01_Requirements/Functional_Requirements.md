# ONLINE FOOD ORDERING SYSTEM — FUNCTIONAL REQUIREMENTS

## 1. Customer Functional Requirements (FR-01 to FR-16)
* **FR-01 (Register):** The system shall allow new customers to register by providing name, email, password, phone, and delivery address.
* **FR-02 (Login):** The system shall allow registered customers to securely authenticate using email and password.
* **FR-03 (Browse Restaurants):** The system shall display a list of all active, open restaurants with ratings and delivery estimates.
* **FR-04 (View Menu):** The system shall display categorized food items for any selected restaurant.
* **FR-05 (Search Food):** The system shall enable keyword searching for food items and cuisine types across restaurants.
* **FR-06 (View Food Details):** The system shall show detailed dish information including price, description, and availability.
* **FR-07 (Add Food to Cart):** The system shall allow adding food items with specified quantities to an active cart.
* **FR-08 (Update Cart):** The system shall allow modifying item quantities in the cart.
* **FR-09 (Remove Food from Cart):** The system shall allow deleting items from the cart.
* **FR-10 (Checkout):** The system shall validate cart contents, delivery address, and compute itemized billing subtotals, taxes, and grand total.
* **FR-11 (Place Order):** The system shall create an order record and transition state to pending payment.
* **FR-12 (Make Payment):** The system shall process online payments via credit/debit cards, UPI, net banking, or digital wallets.
* **FR-13 (View Order History):** The system shall display past orders with receipts, statuses, and item breakdowns.
* **FR-14 (Track Order):** The system shall provide real-time status tracking and courier assignment details.
* **FR-15 (Cancel Order):** The system shall allow cancellation before food preparation starts, triggering an automatic refund.
* **FR-16 (Give Rating/Review):** The system shall allow rating (1-5 stars) and commenting on delivered orders.

## 2. Restaurant Staff Functional Requirements (FR-17 to FR-25)
* **FR-17 (Login):** Restaurant staff shall securely authenticate into the kitchen portal.
* **FR-18 (Manage Menu):** Staff shall view, categorize, and organize the restaurant's menu catalog.
* **FR-19 (Add Food Item):** Staff shall add new dishes with pricing, description, and cuisine tags.
* **FR-20 (Update Food Item):** Staff shall modify existing item details, pricing, and stock availability.
* **FR-21 (Remove Food Item):** Staff shall delete or deactivate discontinued food items.
* **FR-22 (View Incoming Orders):** Staff shall monitor incoming customer orders in real time.
* **FR-23 (Accept Order):** Staff shall accept incoming orders and specify estimated cooking preparation time.
* **FR-24 (Reject Order):** Staff shall reject orders with a reason, triggering customer notification and refund.
* **FR-25 (Update Preparation Status):** Staff shall update preparation stages (Preparing -> Food Ready for Pickup).

## 3. Delivery Partner Functional Requirements (FR-26 to FR-31)
* **FR-26 (Login):** Delivery partners shall securely authenticate into the delivery mobile app.
* **FR-27 (View Assigned Order):** Partners shall view details of assigned pickup orders.
* **FR-28 (View Delivery Details):** Partners shall access restaurant pickup and customer delivery addresses with contact numbers.
* **FR-29 (Pick Up Order):** Partners shall confirm parcel pickup at the restaurant (status -> Picked Up / Out for Delivery).
* **FR-30 (Update Delivery Status):** Partners shall provide transit updates and log exceptions if delivery is delayed.
* **FR-31 (Mark Delivered):** Partners shall confirm physical handover to the customer (status -> Delivered).

## 4. Payment Gateway Functional Requirements (FR-32 to FR-35)
* **FR-32 (Process Payment):** Authorize electronic transaction requests via encrypted banking channels.
* **FR-33 (Payment Success):** Return authorization token and transaction reference ID on approved payments.
* **FR-34 (Payment Failure):** Return decline error codes and failure descriptions on rejected payments.
* **FR-35 (Refund Payment):** Process full electronic refunds for cancelled or rejected orders.
