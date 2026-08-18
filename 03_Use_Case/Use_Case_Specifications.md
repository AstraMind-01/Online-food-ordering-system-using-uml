# USE CASE SPECIFICATIONS
## ONLINE FOOD ORDERING SYSTEM

---

### Document Information
* **System:** Online Food Ordering System
* **Course:** Object-Oriented Analysis and Design (OOAD) / Software Engineering
* **Phase:** Review 1 — Detailed Behavioral Requirements Specification
* **Baseline Architecture:** 4-Actor Model (Customer, Restaurant Staff, Delivery Partner, Payment Gateway)

---

## TABLE OF CONTENTS
1. [UC-01: Register](#uc-01-register)
2. [UC-02: Login](#uc-02-login)
3. [UC-03: Browse Restaurants](#uc-03-browse-restaurants)
4. [UC-04: View Menu](#uc-04-view-menu)
5. [UC-05: Search Food](#uc-05-search-food)
6. [UC-06: Add Food to Cart](#uc-06-add-food-to-cart)
7. [UC-07: Checkout](#uc-07-checkout)
8. [UC-08: Place Order](#uc-08-place-order)
9. [UC-09: Make Payment](#uc-09-make-payment)
10. [UC-10: Track Order](#uc-10-track-order)
11. [UC-11: Cancel Order](#uc-11-cancel-order)
12. [UC-12: Accept Order](#uc-12-accept-order)
13. [UC-13: Update Preparation Status](#uc-13-update-preparation-status)
14. [UC-14: Pick Up Order](#uc-14-pick-up-order)
15. [UC-15: Mark Order as Delivered](#uc-15-mark-order-as-delivered)
16. [UC-16: Give Rating/Review](#uc-16-give-ratingreview)

---

### UC-01: Register
* **Use Case ID:** UC-01
* **Use Case Name:** Register
* **Primary Actor:** Customer
* **Supporting Actor:** None
* **Goal:** Create a new authenticated customer account in the system.
* **Preconditions:** The customer has access to the application and has not registered with the same email or phone number.
* **Trigger:** Customer clicks on the "Register" or "Sign Up" button on the welcome page.
* **Main Success Scenario:**
  1. Customer opens the registration form.
  2. Customer inputs full name, email address, password, contact phone number, and default delivery address.
  3. Customer submits the registration form.
  4. System validates that all mandatory fields are provided and formatted properly.
  5. System verifies that the email address is unique.
  6. System hashes and salts the password.
  7. System creates a new `Customer` profile record in the database.
  8. System displays a success message and redirects the customer to the Login screen.
* **Alternative Flows:**
  * *4a. Missing Required Fields:* System highlights the empty mandatory fields and prompts the user to enter them.
* **Exception Flows:**
  * *5a. Duplicate Email/Phone:* System notifies the customer that an account already exists with that email and offers password recovery or direct login.
* **Postconditions:** A new persistent customer record exists, and the customer can now log in.
* **Business Rules:** N/A

---

### UC-02: Login
* **Use Case ID:** UC-02
* **Use Case Name:** Login
* **Primary Actor:** Customer, Restaurant Staff, Delivery Partner
* **Supporting Actor:** None
* **Goal:** Authenticate user identity and grant access to role-based functionality.
* **Preconditions:** User has a registered account and active credentials.
* **Trigger:** User enters credentials and clicks the "Login" button.
* **Main Success Scenario:**
  1. User accesses the login screen.
  2. User enters username/email, password, and selects role if applicable.
  3. User submits the login form.
  4. System queries user credentials and verifies the password hash.
  5. System generates an active authentication session/token.
  6. System loads the role-specific landing dashboard:
     * Customer $\rightarrow$ Restaurant Discovery Page.
     * Restaurant Staff $\rightarrow$ Kitchen Orders Management Dashboard.
     * Delivery Partner $\rightarrow$ Assigned Deliveries Portal.
* **Alternative Flows:**
  * *4a. User requests password reset:* User clicks "Forgot Password", system sends reset instructions to verified email.
* **Exception Flows:**
  * *4b. Invalid Credentials:* System increments failed login count, displays an error message ("Invalid username or password"), and keeps user on login screen.
* **Postconditions:** An active session is created, and user identity is established for all downstream requests.
* **Business Rules:** BR-01

---

### UC-03: Browse Restaurants
* **Use Case ID:** UC-03
* **Use Case Name:** Browse Restaurants
* **Primary Actor:** Customer
* **Supporting Actor:** None
* **Goal:** View and filter the list of available local restaurants.
* **Preconditions:** System database contains active restaurants.
* **Trigger:** Customer opens the application homepage or navigates to the "Restaurants" tab.
* **Main Success Scenario:**
  1. Customer requests the restaurant list.
  2. System retrieves all open restaurants in the customer's delivery zone.
  3. System displays restaurant cards showing name, cuisine type, average star rating, estimated delivery time, and delivery fee.
  4. Customer applies filters (e.g., Vegetarian, High Rating, Fast Delivery).
  5. System updates the displayed list according to selected filter criteria.
* **Alternative Flows:**
  * *3a. No restaurants open:* System displays a message stating no restaurants are currently open and indicates opening times.
* **Exception Flows:**
  * *2a. Location/Network Timeout:* System shows a network error banner with a "Retry" button.
* **Postconditions:** Customer views available restaurants and can select one to view its menu.
* **Business Rules:** N/A

---

### UC-04: View Menu
* **Use Case ID:** UC-04
* **Use Case Name:** View Menu
* **Primary Actor:** Customer
* **Supporting Actor:** None
* **Goal:** View categorized food items offered by a selected restaurant.
* **Preconditions:** Customer has selected a valid active restaurant.
* **Trigger:** Customer clicks on a specific restaurant card.
* **Main Success Scenario:**
  1. Customer selects a restaurant.
  2. System fetches the restaurant's active menu catalog.
  3. System displays categorized sections (e.g., Appetizers, Main Course, Desserts, Beverages).
  4. For each food item, system displays name, image, description, price, dietary badge (Veg/Non-Veg), and an "Add" button.
  5. Customer browses through the menu categories.
* **Alternative Flows:**
  * *4a. View Food Details (`<<extend>>`):* Customer clicks on a specific food item to open an expanded description with ingredient details.
* **Exception Flows:**
  * *2a. Restaurant Temporarily Inactive:* System alerts the customer that the restaurant is not currently accepting orders.
* **Postconditions:** The selected restaurant's menu items are visible and ready for cart selection.
* **Business Rules:** N/A

---

### UC-05: Search Food
* **Use Case ID:** UC-05
* **Use Case Name:** Search Food
* **Primary Actor:** Customer
* **Supporting Actor:** None
* **Goal:** Locate specific dishes, cuisines, or ingredients using keywords.
* **Preconditions:** Customer is on the search or home interface.
* **Trigger:** Customer types text into the search bar and presses Enter or Search icon.
* **Main Success Scenario:**
  1. Customer enters search text (e.g., "Pizza", "Biryani", "Burger").
  2. System parses the query string and performs indexed keyword search across all active food items and restaurants.
  3. System returns matching dishes with restaurant names, prices, and ratings.
  4. Customer clicks on a search result item to view details or add directly to cart.
* **Alternative Flows:**
  * *3a. Zero Exact Matches:* System provides nearest spelling suggestions or displays popular trending dishes.
* **Exception Flows:**
  * *1a. Empty/Invalid Search Query:* System prompts the user to enter at least 2 alphanumeric characters.
* **Postconditions:** Matching search results are displayed on the customer's screen.
* **Business Rules:** N/A

---

### UC-06: Add Food to Cart
* **Use Case ID:** UC-06
* **Use Case Name:** Add Food to Cart
* **Primary Actor:** Customer
* **Supporting Actor:** None
* **Goal:** Add selected food items and quantities to the customer's active shopping cart.
* **Preconditions:** Customer has selected an in-stock food item from an open restaurant.
* **Trigger:** Customer clicks the "Add to Cart" button for a food item.
* **Main Success Scenario:**
  1. Customer chooses an item and selects desired quantity (e.g., 2).
  2. Customer clicks "Add to Cart".
  3. System checks that the item is from the same restaurant as existing items in the cart.
  4. System verifies that the item is currently in stock.
  5. System adds the item (or increments quantity) in the customer's active cart.
  6. System calculates updated cart subtotal.
  7. System displays an updated cart badge and visual confirmation banner.
* **Alternative Flows:**
  * *3a. Cart contains items from a different restaurant:* System prompts: "Your cart already contains items from [Restaurant A]. Discard cart and start a new order from [Restaurant B]?" If confirmed, system clears old cart and adds the new item.
* **Exception Flows:**
  * *4a. Item Out of Stock:* System displays an alert ("Item temporarily sold out") and prevents addition.
* **Postconditions:** Cart contents and line item counts are persistently updated.
* **Business Rules:** BR-02, BR-08

---

### UC-07: Checkout
* **Use Case ID:** UC-07
* **Use Case Name:** Checkout
* **Primary Actor:** Customer
* **Supporting Actor:** None
* **Goal:** Review selected order items, confirm delivery address, and view final bill breakdown.
* **Preconditions:** Customer is logged in, and the cart contains $\ge 1$ item.
* **Trigger:** Customer clicks the "Proceed to Checkout" button from the cart drawer.
* **Main Success Scenario:**
  1. Customer initiates checkout from cart.
  2. System verifies user authentication (invokes Login if unauthenticated).
  3. System verifies cart has at least one item ($ItemCount \ge 1$).
  4. System retrieves customer's saved delivery addresses and allows selecting/adding one.
  5. System computes financial totals:
     * Food Items Subtotal = $\sum (Price \times Quantity)$
     * Applicable Taxes (GST/VAT)
     * Delivery Fee
     * Grand Total Amount
  6. System displays the final Checkout Summary screen with order details and price breakdown.
* **Alternative Flows:**
  * *4a. Customer enters new delivery address:* System validates street, postal code, and contact number.
* **Exception Flows:**
  * *3a. Cart is empty:* System blocks checkout and redirects to restaurant browsing.
* **Postconditions:** An active checkout session is initialized, and grand total is locked for payment.
* **Business Rules:** BR-01, BR-02, BR-08

---

### UC-08: Place Order
* **Use Case ID:** UC-08
* **Use Case Name:** Place Order
* **Primary Actor:** Customer
* **Supporting Actor:** Payment Gateway
* **Goal:** Finalize order creation and initiate the payment transaction workflow.
* **Preconditions:** Customer has reviewed checkout details and agreed to total amount.
* **Trigger:** Customer clicks "Place Order & Pay" on checkout screen.
* **Main Success Scenario:**
  1. Customer confirms delivery address and clicks "Place Order & Pay".
  2. System executes `<<include>> Checkout` to validate cart state and addresses.
  3. System creates a new `Order` record with status `PENDING_PAYMENT`.
  4. System copies all cart line items into persistent `OrderItem` records.
  5. System invokes `<<include>> Make Payment` to process payment transaction.
  6. Upon successful payment verification, system updates order status to `PLACED`.
  7. System empties customer's cart.
  8. System sends instant order notification to the respective Restaurant Staff.
  9. System displays Order Confirmation screen with tracking ID.
* **Alternative Flows:**
  * *5a. Payment Fails:* System keeps order in `PAYMENT_FAILED` state, informs customer, and offers retry.
* **Exception Flows:**
  * *3a. Database write failure:* System rolls back order creation and displays system error message.
* **Postconditions:** An active order is placed in the system with status `PLACED`, cart is cleared, and restaurant is notified.
* **Business Rules:** BR-01, BR-02, BR-04, BR-08

---

### UC-09: Make Payment
* **Use Case ID:** UC-09
* **Use Case Name:** Make Payment
* **Primary Actor:** Customer
* **Supporting Actor:** Payment Gateway
* **Goal:** Facilitate secure digital payment processing for an active order.
* **Preconditions:** An order has been initialized with calculated grand total.
* **Trigger:** Invoked as an included use case during Place Order.
* **Main Success Scenario:**
  1. System presents payment options (Credit/Debit Card, UPI, Digital Wallet, Net Banking).
  2. Customer selects payment method and inputs payment details.
  3. System invokes `<<include>> Process Payment` by forwarding encrypted request to Payment Gateway.
  4. Payment Gateway authorizes transaction and returns `Payment Success` token.
  5. System records `Payment` record with transaction ID, payment mode, amount, and timestamp.
  6. System marks payment status as `SUCCESS` and returns control to Place Order flow.
* **Alternative Flows:**
  * *4a. Customer cancels transaction on gateway:* System returns user to payment selection page.
* **Exception Flows:**
  * *4b. Payment Declined by Gateway (`<<extend>> Payment Failure`):* Gateway returns decline code (insufficient funds / invalid OTP); system logs failure and prompts user to select alternate card/method.
* **Postconditions:** Payment transaction is recorded in database, and order authorization is verified.
* **Business Rules:** BR-04, BR-08

---

### UC-10: Track Order
* **Use Case ID:** UC-10
* **Use Case Name:** Track Order
* **Primary Actor:** Customer
* **Supporting Actor:** Delivery Partner
* **Goal:** Monitor real-time status and delivery progress of an active order.
* **Preconditions:** Customer has at least one active order placed in the system.
* **Trigger:** Customer clicks "Track Order" from order confirmation or order history.
* **Main Success Scenario:**
  1. Customer opens the Order Tracking interface for a selected order ID.
  2. System queries current order status from database.
  3. System renders visual stage progress timeline:
     * `PLACED` $\rightarrow$ `ACCEPTED` $\rightarrow$ `PREPARING` $\rightarrow$ `READY_FOR_PICKUP` $\rightarrow$ `OUT_FOR_DELIVERY` $\rightarrow$ `DELIVERED`.
  4. If order is `OUT_FOR_DELIVERY`, system displays delivery partner name, phone number, and estimated arrival time.
  5. System periodically updates the progress indicator until final delivery.
* **Alternative Flows:**
  * *3a. Order Cancelled:* System shows "Order Cancelled" badge with refund details.
* **Exception Flows:**
  * *2a. Invalid Order ID:* System displays error "Order not found".
* **Postconditions:** Customer has live visibility into their food preparation and delivery milestone.
* **Business Rules:** N/A

---

### UC-11: Cancel Order
* **Use Case ID:** UC-11
* **Use Case Name:** Cancel Order
* **Primary Actor:** Customer
* **Supporting Actor:** Payment Gateway
* **Goal:** Cancel an active order and claim a full refund before preparation begins.
* **Preconditions:** Order exists and its status is strictly `PLACED` or `ACCEPTED` (not yet `PREPARING`).
* **Trigger:** Customer clicks "Cancel Order" on tracking screen.
* **Main Success Scenario:**
  1. Customer clicks "Cancel Order".
  2. System checks current status of the order in the database.
  3. System verifies order status is `PLACED` or `ACCEPTED`.
  4. System prompts customer to select a cancellation reason and confirm.
  5. Customer confirms cancellation.
  6. System updates order status to `CANCELLED`.
  7. System invokes `<<extend>> Refund Payment` by sending a refund API request to Payment Gateway.
  8. Payment Gateway returns refund transaction confirmation ID.
  9. System notifies restaurant staff to abort the order.
  10. System displays cancellation confirmation with refund transaction reference.
* **Alternative Flows:**
  * *5a. Customer aborts cancellation:* Order continues normal processing.
* **Exception Flows:**
  * *3a. Food Already in Preparation:* System detects status is `PREPARING` or `READY_FOR_PICKUP`; system blocks cancellation and displays: "Order cannot be cancelled because the kitchen has already started food preparation."
* **Postconditions:** Order status is set to `CANCELLED`, kitchen is alerted, and 100% refund is initiated.
* **Business Rules:** BR-05

---

### UC-12: Accept Order
* **Use Case ID:** UC-12
* **Use Case Name:** Accept Order
* **Primary Actor:** Restaurant Staff
* **Supporting Actor:** None
* **Goal:** Acknowledge an incoming paid order and queue it for kitchen preparation.
* **Preconditions:** Order has been placed with verified payment (status `PLACED`).
* **Trigger:** Restaurant Staff clicks "Accept Order" on restaurant kitchen dashboard.
* **Main Success Scenario:**
  1. Restaurant Staff views incoming order on dashboard showing ordered food items, quantities, and special notes.
  2. Staff verifies kitchen capacity and ingredients availability.
  3. Staff clicks "Accept Order" and inputs estimated preparation time (e.g., 25 mins).
  4. System updates order status from `PLACED` to `ACCEPTED`.
  5. System pushes real-time notification to Customer ("Restaurant accepted your order").
  6. System queues the order for delivery partner dispatch.
* **Alternative Flows:**
  * *2a. Reject Order (`UC-12b`):* Staff clicks "Reject Order" if kitchen is overwhelmed or item is out of stock. System updates status to `REJECTED` and triggers full refund to customer.
* **Exception Flows:**
  * *1a. Order already cancelled by user:* System alerts staff that customer cancelled before acceptance.
* **Postconditions:** Order transitions to `ACCEPTED` and is ready for cooking.
* **Business Rules:** BR-03

---

### UC-13: Update Preparation Status
* **Use Case ID:** UC-13
* **Use Case Name:** Update Preparation Status
* **Primary Actor:** Restaurant Staff
* **Supporting Actor:** Delivery Partner
* **Goal:** Update kitchen cooking progress and notify delivery partner when food is packed.
* **Preconditions:** Order status is `ACCEPTED`.
* **Trigger:** Kitchen staff begins cooking or completes packaging.
* **Main Success Scenario:**
  1. Staff updates order status to `PREPARING` when kitchen starts cooking.
  2. System updates database and tracking timeline for customer.
  3. When food is packed and ready, staff clicks "Ready for Pickup".
  4. System updates order status to `READY_FOR_PICKUP`.
  5. System sends instant pickup notification with order number to the assigned Delivery Partner.
* **Alternative Flows:**
  * *1a. Minor kitchen delay:* Staff updates estimated preparation time (+10 mins); system sends delay alert to customer.
* **Exception Flows:**
  * *4a. Network failure:* Dashboard stores action in local offline queue and syncs when reconnected.
* **Postconditions:** Order status is updated to `READY_FOR_PICKUP`, and delivery partner is notified.
* **Business Rules:** BR-03, BR-05

---

### UC-14: Pick Up Order
* **Use Case ID:** UC-14
* **Use Case Name:** Pick Up Order
* **Primary Actor:** Delivery Partner
* **Supporting Actor:** Restaurant Staff
* **Goal:** Collect packed food from the restaurant and begin customer doorstep delivery.
* **Preconditions:** Delivery partner is assigned to order and order is in `READY_FOR_PICKUP` status.
* **Trigger:** Delivery partner arrives at restaurant and collects food parcel.
* **Main Success Scenario:**
  1. Delivery partner arrives at restaurant and verifies order ID on the package.
  2. Delivery partner opens delivery app and taps "Confirm Pickup".
  3. System validates that delivery partner is the assigned courier for this order.
  4. System updates order status to `OUT_FOR_DELIVERY`.
  5. System activates live GPS tracking and estimated arrival time on customer's tracking screen.
  6. System displays customer address and navigation route on delivery partner's app.
* **Alternative Flows:**
  * *1a. Package not ready upon arrival:* Delivery partner waits; status remains `PREPARING`.
* **Exception Flows:**
  * *3a. Unauthorized courier:* System rejects confirmation if assigned partner ID does not match.
* **Postconditions:** Order status is `OUT_FOR_DELIVERY` and courier is en route to customer.
* **Business Rules:** BR-06

---

### UC-15: Mark Order as Delivered
* **Use Case ID:** UC-15
* **Use Case Name:** Mark Order as Delivered
* **Primary Actor:** Delivery Partner
* **Supporting Actor:** Customer
* **Goal:** Confirm successful handover of food parcel to customer at delivery location.
* **Preconditions:** Order is currently in `OUT_FOR_DELIVERY` status.
* **Trigger:** Delivery partner hands food package to customer and clicks "Mark as Delivered".
* **Main Success Scenario:**
  1. Delivery partner reaches customer address and delivers the food.
  2. Delivery partner taps "Mark as Delivered" in the mobile app.
  3. System records delivery completion timestamp.
  4. System updates order status to `DELIVERED`.
  5. System sends delivery confirmation message and electronic invoice to customer.
  6. System unlocks and prompts the customer with the Rating & Review form.
  7. Delivery partner's availability status is reset to "Available for Next Order".
* **Alternative Flows:**
  * *2a. Customer unavailable / incorrect address:* Delivery partner calls customer through masked number; if unresolved, escalates to support.
* **Exception Flows:**
  * *4a. GPS location mismatch:* App alerts driver if delivery confirmation is triggered far from destination.
* **Postconditions:** Order is successfully closed as `DELIVERED`, and customer review is enabled.
* **Business Rules:** BR-06, BR-07

---

### UC-16: Give Rating/Review
* **Use Case ID:** UC-16
* **Use Case Name:** Give Rating/Review
* **Primary Actor:** Customer
* **Supporting Actor:** None
* **Goal:** Submit customer rating and written feedback regarding food quality and delivery service.
* **Preconditions:** Order status must be strictly `DELIVERED`.
* **Trigger:** Customer clicks on review notification or navigates to order history.
* **Main Success Scenario:**
  1. Customer opens the review dialog for a delivered order.
  2. Customer selects a star rating (1 to 5 stars) for:
     * Food quality & taste.
     * Delivery speed & partner behavior.
  3. Customer enters optional text review / comments.
  4. Customer clicks "Submit Review".
  5. System validates that the rating is between 1 and 5 and user has not reviewed this order before.
  6. System creates and stores a new `Review` record linked to the `Order` and `Restaurant`.
  7. System recalculates the restaurant's cumulative average star rating.
  8. System displays a "Thank you for your feedback!" confirmation banner.
* **Alternative Flows:**
  * *4a. Customer skips text review:* System records star rating only.
* **Exception Flows:**
  * *5a. Order not delivered:* System blocks review submission if order is in transit or cancelled.
* **Postconditions:** Review is published, and restaurant average rating is updated in real time.
* **Business Rules:** BR-07

---

## 17. USE CASE TO BUSINESS RULES CROSS-REFERENCE TABLE

| Use Case ID | Use Case Name | Applicable Business Rules |
| :--- | :--- | :--- |
| **UC-01** | Register | Security / Validation Standards |
| **UC-02** | Login | `BR-01` (Authentication Mandate) |
| **UC-03** | Browse Restaurants | Operational Hours Filter |
| **UC-04** | View Menu | Restaurant Menu Segregation |
| **UC-05** | Search Food | Active Item Indexing |
| **UC-06** | Add Food to Cart | `BR-02` (Single Restaurant Rule), `BR-08` (Price Computation) |
| **UC-07** | Checkout | `BR-01` (Auth), `BR-02` (Cart $\ge 1$ item), `BR-08` (Grand Total) |
| **UC-08** | Place Order | `BR-01`, `BR-02`, `BR-04` (Payment Success), `BR-08` |
| **UC-09** | Make Payment | `BR-04` (Payment Authorization), `BR-08` |
| **UC-10** | Track Order | Lifecycle State Consistency |
| **UC-11** | Cancel Order | `BR-05` (Cancellation allowed only before `PREPARING`) |
| **UC-12** | Accept Order | `BR-03` (Acceptance required before kitchen starts) |
| **UC-13** | Update Preparation Status | `BR-03`, `BR-05` (Blocks customer cancellation) |
| **UC-14** | Pick Up Order | `BR-06` (Courier Ownership Rule) |
| **UC-15** | Mark Order as Delivered | `BR-06`, `BR-07` (Unlocks Customer Review) |
| **UC-16** | Give Rating/Review | `BR-07` (Review allowed only after `DELIVERED`) |

---
*These 16 Use Case Specifications are directly aligned with [`01_Use_Case_Diagram.drawio`](file:///c:/soumya/soumya/UML%20Modeling%20of%20an%20Online%20Shopping%20System/Online_Food_Ordering_System/02_Use_Case/01_Use_Case_Diagram.drawio) and form the foundation for all upcoming Sequence and Domain Class Diagrams.*
