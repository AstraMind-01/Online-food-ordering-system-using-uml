# ONLINE FOOD ORDERING SYSTEM
# COMPREHENSIVE OOAD & UML VIVA VOCE PREPARATION GUIDE (150 QUESTIONS)

---

## TABLE OF CONTENTS
1. [Basic OOAD Questions (20 Qs)](#1-basic-ooad-questions)
2. [UML Questions (20 Qs)](#2-uml-questions)
3. [Requirement Engineering Questions (15 Qs)](#3-requirement-engineering-questions)
4. [Use Case Questions (15 Qs)](#4-use-case-questions)
5. [Class Diagram Questions (15 Qs)](#5-class-diagram-questions)
6. [Sequence Diagram Questions (15 Qs)](#6-sequence-diagram-questions)
7. [Activity Diagram Questions (10 Qs)](#7-activity-diagram-questions)
8. [State Diagram Questions (10 Qs)](#8-state-diagram-questions)
9. [Component & Deployment Questions (10 Qs)](#9-component--deployment-questions)
10. [Project-Specific & Scenario Questions (20 Qs)](#10-project-specific--scenario-questions)

---

## 1. BASIC OOAD QUESTIONS

**Q1: What is Object-Oriented Analysis (OOA)?**  
**Short Answer:** OOA is the process of examining the real-world problem domain to identify objects, their responsibilities, and relationships without considering implementation technologies.

**Q2: What is Object-Oriented Design (OOD)?**  
**Short Answer:** OOD is the phase where analysis models are transformed into technical blueprints specifying software classes, method signatures, data structures, and architectural layers.

**Q3: What is the primary difference between OOA and OOD?**  
**Short Answer:** OOA focuses on *what* the system needs to do (domain concepts), while OOD focuses on *how* the software will do it (software architecture and class interfaces).

**Q4: What is a Class?**  
**Short Answer:** A class is a blueprint or template that defines the common attributes (data) and methods (behavior) for objects of the same type.

**Q5: What is an Object?**  
**Short Answer:** An object is a concrete, runtime instance of a class that holds specific attribute values and exhibits defined behaviors.

**Q6: What is Encapsulation?**  
**Short Answer:** Encapsulation is wrapping data and methods into a single class while restricting direct access using private visibility (`-`) to protect object state.

**Q7: What is Abstraction?**  
**Short Answer:** Abstraction is hiding complex internal implementation details and exposing only essential functional interfaces to external users.

**Q8: What is Inheritance?**  
**Short Answer:** Inheritance is a mechanism where a specialized subclass automatically acquires attributes and methods from a generalized superclass.

**Q9: What is Polymorphism?**  
**Short Answer:** Polymorphism is the ability of different classes to respond to the same method invocation in class-specific ways.

**Q10: What is Association?**  
**Short Answer:** Association is a structural relationship where two independent classes know about and interact with each other.

**Q11: What is Aggregation?**  
**Short Answer:** Aggregation is a weak whole-part ("has-a") relationship where the child component can exist independently of the parent container.

**Q12: What is Composition?**  
**Short Answer:** Composition is a strong whole-part relationship where child instances are strictly lifecycle-dependent on the parent container.

**Q13: How do you identify classes in a problem description?**  
**Short Answer:** Using noun-verb analysis; nouns in requirement statements typically become classes or attributes, while verbs become methods.

**Q14: What is Coupling?**  
**Short Answer:** Coupling measures the degree of dependency between software modules; low coupling is desirable for maintainability.

**Q15: What is Cohesion?**  
**Short Answer:** Cohesion measures how focused and related the responsibilities of a single class or module are; high cohesion is ideal.

**Q16: What is an Abstract Class?**  
**Short Answer:** An abstract class is a parent class that cannot be directly instantiated and is meant to be subclassed by concrete classes.

**Q17: What is an Interface in Object-Orientation?**  
**Short Answer:** An interface is a contract defining method signatures without concrete implementation bodies.

**Q18: What is Method Overloading vs. Overriding?**  
**Short Answer:** Overloading defines multiple methods with the same name but different parameters in one class; overriding redefines a parent method in a child class.

**Q19: What is the Software Development Life Cycle (SDLC)?**  
**Short Answer:** SDLC is a structured framework covering Requirements, Analysis, Design, Implementation, Testing, and Deployment.

**Q20: Why is OOAD preferred over Structured / Procedural Analysis?**  
**Short Answer:** OOAD promotes code reusability, modularity, easier maintenance, and maps directly to real-world business entities.

---

## 2. UML QUESTIONS

**Q21: What is UML?**  
**Short Answer:** UML (Unified Modeling Language) is the industry-standard visual modeling language for specifying, constructing, and documenting software artifacts.

**Q22: Who developed UML?**  
**Short Answer:** Grady Booch, Ivar Jacobson, and James Rumbaugh (the "Three Amigos") at Rational Software.

**Q23: How many diagram types are defined in UML 2.5?**  
**Short Answer:** 14 diagrams, categorized into 7 Structural diagrams and 7 Behavioral diagrams.

**Q24: What is the difference between Structural and Behavioral diagrams?**  
**Short Answer:** Structural diagrams capture static system architecture, while Behavioral diagrams capture dynamic runtime behavior and state changes.

**Q25: Name four major Structural UML diagrams.**  
**Short Answer:** Class Diagram, Object Diagram, Component Diagram, and Deployment Diagram.

**Q26: Name four major Behavioral UML diagrams.**  
**Short Answer:** Use Case Diagram, Sequence Diagram, Activity Diagram, and State Machine Diagram.

**Q27: What is an Actor in UML?**  
**Short Answer:** An actor represents an external entity (human user or external system) that interacts with the software to achieve a goal.

**Q28: What is a Lifeline in a Sequence Diagram?**  
**Short Answer:** A vertical dashed line representing the continuous existence of a participant object over time.

**Q29: What is an Activation Bar in a Sequence Diagram?**  
**Short Answer:** A vertical thin rectangle on a lifeline indicating the period during which an object is actively executing an operation.

**Q30: What is a Swimlane in an Activity Diagram?**  
**Short Answer:** A visual column or partition that groups actions according to the actor or subsystem responsible for them.

**Q31: What is a Stereotype in UML?**  
**Short Answer:** An extensibility mechanism enclosed in guillemets (`<< >>`) used to assign special semantics to UML elements (e.g., `<<include>>`, `<<Boundary>>`).

**Q32: What is the difference between synchronous and asynchronous messages in UML?**  
**Short Answer:** Synchronous messages (solid arrowhead) block the caller until a response is received; asynchronous messages (open arrowhead) do not block.

**Q33: How is a Note / Comment represented in UML?**  
**Short Answer:** A rectangle with a folded top-right corner attached to an element via a dashed line.

**Q34: What is a Package in UML?**  
**Short Answer:** A tabbed folder symbol used to group related classes, use cases, or components into modular namespaces.

**Q35: What is a Node in a Deployment Diagram?**  
**Short Answer:** A 3D box representing physical computational hardware or an execution environment.

**Q36: What is an Artifact in UML?**  
**Short Answer:** A physical software deliverable such as an executable `.jar`, script `.js`, or database script `.sql`.

**Q37: What is Multiplicity in UML?**  
**Short Answer:** Numerical bounds (e.g., `1`, `*`, `1..*`) specifying how many instances of one class can link to an instance of another class.

**Q38: How is an Abstract Class written in a UML Class Diagram?**  
**Short Answer:** The class name is written in *italics* or marked with the stereotype `<<Abstract>>`.

**Q39: How are private, public, and protected visibilities denoted?**  
**Short Answer:** `-` for private, `+` for public, and `#` for protected.

**Q40: What is the purpose of diagrams.net / draw.io?**  
**Short Answer:** It is an open-source visual diagramming tool that creates standards-compliant XML-based UML diagrams.

---

## 3. REQUIREMENT ENGINEERING QUESTIONS

**Q41: What is Requirement Engineering?**  
**Short Answer:** The disciplined process of discovering, analyzing, documenting, validating, and managing system requirements.

**Q42: What is the difference between Functional and Non-Functional Requirements?**  
**Short Answer:** Functional requirements define *what* specific behaviors the system must perform; Non-functional requirements define quality constraints (security, speed, uptime).

**Q43: What is an SRS document?**  
**Short Answer:** Software Requirements Specification; a formal document outlining system scope, functional requirements, non-functional requirements, and constraints.

**Q44: What are Business Rules?**  
**Short Answer:** Core business policies and operational constraints that the software must strictly enforce (e.g., cancellation deadlines, tax formulas).

**Q45: What is an Event in system modeling?**  
**Short Answer:** An external occurrence or trigger that prompts the system to execute an action and produce a response.

**Q46: What is an Event Table?**  
**Short Answer:** A matrix mapping system events to their source, trigger, input data, system response, and output data.

**Q47: Why is user authentication a functional requirement?**  
**Short Answer:** To identify users securely, protect sensitive profile data, and restrict unauthorized order modifications.

**Q48: Give an example of a Security non-functional requirement in your project.**  
**Short Answer:** `NFR-01`: All user passwords must be hashed using bcrypt, and all API traffic must be encrypted over HTTPS/TLS 1.3.

**Q49: Give an example of a Performance non-functional requirement in your project.**  
**Short Answer:** `NFR-02`: Food search and menu browsing operations must return response payloads within 2.0 seconds.

**Q50: Why are Business Rules separated from Functional Requirements?**  
**Short Answer:** Business rules reflect dynamic business policies that may change (like refund windows or delivery fees) without altering basic system functions.

**Q51: What is Requirement Traceability?**  
**Short Answer:** The ability to trace a requirement forward to design models and test cases, and backward to its stakeholder source.

**Q52: What is Scope Creep?**  
**Short Answer:** The uncontrolled addition of new features without adjusting project deadlines, resources, or architecture.

**Q53: How did you bound the scope for Review 1?**  
**Short Answer:** Focused on core end-to-end ordering, kitchen dispatch, delivery handover, and payment authorization, excluding AI routing and complex inventory ERPs.

**Q54: What is ACID compliance in database transactions?**  
**Short Answer:** Atomicity, Consistency, Isolation, and Durability; ensures order placement and payment state changes commit reliably.

**Q55: How are exceptions captured during requirements elicitation?**  
**Short Answer:** By specifying Alternative and Exception flows for scenarios like payment declines and item stockouts.

---

## 4. USE CASE QUESTIONS

**Q56: What is a Use Case?**  
**Short Answer:** A specification of sequences of actions that a system performs to deliver a measurable result of value to an actor.

**Q57: Who are the 4 actors in your Use Case Diagram?**  
**Short Answer:** `Customer`, `Restaurant Staff`, `Delivery Partner`, and `Payment Gateway`.

**Q58: What is a Primary Actor vs. a Supporting Actor?**  
**Short Answer:** A primary actor initiates a use case to achieve a goal (e.g., `Customer`); a supporting actor provides external services to fulfill the goal (e.g., `Payment Gateway`).

**Q59: Why is Payment Gateway modeled as an Actor?**  
**Short Answer:** Because it is an external autonomous system residing outside our system boundary that interacts with our application.

**Q60: What is the `<<include>>` relationship?**  
**Short Answer:** A relationship indicating that the base use case mandatorily and unconditionally executes the behavior of the included use case.

**Q61: What is the `<<extend>>` relationship?**  
**Short Answer:** A relationship indicating that an extending use case conditionally adds optional behavior to a base use case at an extension point.

**Q62: Give an example of an `<<include>>` relationship in your project.**  
**Short Answer:** `Place Order` `<<include>>` `Make Payment` and `Place Order` `<<include>>` `Checkout`.

**Q63: Give an example of an `<<extend>>` relationship in your project.**  
**Short Answer:** `Cancel Order` `<<extend>>` `Track Order` and `Refund Payment` `<<extend>>` `Cancel Order`.

**Q64: In which direction do `<<include>>` and `<<extend>>` arrows point?**  
**Short Answer:** `<<include>>` points from the base use case to the included use case; `<<extend>>` points from the extending use case to the base use case.

**Q65: What is a Use Case Specification?**  
**Short Answer:** A detailed text document describing preconditions, triggers, main success scenario, alternate flows, and postconditions for a use case.

**Q66: What is a Precondition in a use case?**  
**Short Answer:** A condition that must be true before the use case can begin execution (e.g., customer must be logged in).

**Q67: What is a Postcondition in a use case?**  
**Short Answer:** The guaranteed state of the system after the use case successfully executes (e.g., order is created, cart is emptied).

**Q68: What is an Exception Flow in a use case?**  
**Short Answer:** A path taken when an error prevents the primary goal from being achieved (e.g., payment card declined).

**Q69: What is the System Boundary in a Use Case Diagram?**  
**Short Answer:** A rectangle enclosing all system use cases, separating internal system behavior from external actors.

**Q70: How many use cases did you model in your project?**  
**Short Answer:** 29 use cases organized across 5 functional packages.

---

## 5. CLASS DIAGRAM QUESTIONS

**Q71: What is the purpose of a Class Diagram?**  
**Short Answer:** To represent the static structural design of the system, showing classes, attributes, methods, visibilities, and relationships.

**Q72: What is the difference between a Domain Model and a Design Class Diagram?**  
**Short Answer:** A Domain Model shows real-world conceptual entities and attributes without software methods; a Design Class Diagram includes visibility, data types, and method signatures.

**Q73: Name the 14 core classes in your Class Diagram.**  
**Short Answer:** `User`, `Customer`, `RestaurantStaff`, `DeliveryPartner`, `Restaurant`, `FoodItem`, `Category`, `Cart`, `CartItem`, `Order`, `OrderItem`, `Payment`, `Delivery`, `Review`.

**Q74: Why is `User` made an Abstract Class?**  
**Short Answer:** Because generic users do not exist in the system; every user must be a specific concrete role (`Customer`, `RestaurantStaff`, or `DeliveryPartner`).

**Q75: Why did you use Inheritance between `User` and `Customer`?**  
**Short Answer:** To avoid code duplication by inheriting common attributes (`userId`, `name`, `email`, `phone`) and methods (`login()`, `logout()`).

**Q76: Why is `Cart` composed of `CartItem`?**  
**Short Answer:** Because a `CartItem` exists only within its parent `Cart`; if the cart is cleared or deleted, its line items cease to exist (Composition).

**Q77: Why does `Order` have a Composition relationship with `OrderItem`?**  
**Short Answer:** Because line items in an order have no independent existence outside the specific order lifecycle.

**Q78: What is the multiplicity between `Customer` and `Order`?**  
**Short Answer:** `1` to `*` (One customer can place zero or many orders).

**Q79: What is the multiplicity between `Order` and `Payment`?**  
**Short Answer:** `1` to `1` (Each order is linked to exactly one payment record).

**Q80: What is the multiplicity between `Restaurant` and `FoodItem`?**  
**Short Answer:** `1` to `*` (One restaurant offers multiple food items).

**Q81: Why do we have separate `CartItem` and `OrderItem` classes?**  
**Short Answer:** `CartItem` holds temporary, modifiable quantities in memory, while `OrderItem` holds immutable, historical price snapshots committed to an order.

**Q82: What attributes are present in the `Payment` class?**  
**Short Answer:** `paymentId: String`, `orderId: String`, `amount: double`, `paymentMethod: String`, `paymentStatus: String`, `transactionDate: Date`.

**Q83: What is the role of the `Category` class?**  
**Short Answer:** To group food items into menu sections (e.g., Starters, Main Course, Desserts, Beverages).

**Q84: Why is `Review` connected to both `Customer` and `FoodItem`?**  
**Short Answer:** Because a review is written by a specific customer about a specific food dish they ordered.

**Q85: How is private visibility represented in your class boxes?**  
**Short Answer:** With a minus sign (`-`) preceding attribute and method names.

---

## 6. SEQUENCE DIAGRAM QUESTIONS

**Q86: What is a Sequence Diagram?**  
**Short Answer:** An interaction diagram that depicts how objects communicate over time in a chronological top-to-bottom message sequence.

**Q87: What is BCE Architecture in Sequence Diagrams?**  
**Short Answer:** A 3-layer pattern consisting of Boundary (UI/API), Control (business logic), and Entity (persistent data) lifelines.

**Q88: Name the 6 Sequence Diagrams you created.**  
**Short Answer:** `Login`, `Browse_Food`, `Add_To_Cart`, `Place_Order`, `Payment`, and `Track_Order`.

**Q89: In `Login.drawio`, which objects participate?**  
**Short Answer:** `Customer` (Actor), `:LoginPage` (Boundary), `:AuthController` (Control), and `:User` (Entity).

**Q90: What is an `alt` fragment in a Sequence Diagram?**  
**Short Answer:** An alternative combined fragment representing conditional "if-else" branching logic.

**Q91: Where did you use an `alt` fragment in your Sequence Diagrams?**  
**Short Answer:** In `Payment.drawio` for `[Payment Success]` vs. `[Payment Failure]` and in `Login.drawio` for valid vs. invalid credentials.

**Q92: In `Place_Order.drawio`, why does `:OrderController` call `:FoodItem.checkAvailability()`?**  
**Short Answer:** To ensure that all items in the cart are still in stock before creating persistent order records.

**Q93: What is the difference between a synchronous message and a reply message?**  
**Short Answer:** A synchronous message is drawn with a solid line and filled arrowhead; a reply is drawn with a dashed line and open arrowhead.

**Q94: Why does the Actor communicate only with the Boundary object?**  
**Short Answer:** To uphold separation of concerns; users interact directly with user interfaces, never directly with controllers or database entities.

**Q95: What message is sent from `:OrderController` to `:PaymentPage` during checkout?**  
**Short Answer:** `requestPayment(orderId, grandTotal)`.

**Q96: What happens to the cart after order confirmation in `Place_Order`?**  
**Short Answer:** `:OrderController` invokes `:Cart.clearCart()` to empty the customer's active shopping cart.

**Q97: In `Track_Order.drawio`, which entity provides courier transit details?**  
**Short Answer:** The `:Delivery` entity via `getDeliveryDetails()`.

**Q98: What is the role of `:AuthController`?**  
**Short Answer:** It coordinates credential hashing, queries user records, validates passwords, and issues session tokens.

**Q99: How is message sequencing represented on lifelines?**  
**Short Answer:** Chronologically from top to bottom; messages placed higher occur before messages placed lower.

**Q100: What is a Self-Message in a Sequence Diagram?**  
**Short Answer:** A message that an object sends to itself to execute an internal routine (e.g., `:Cart.calculateTotal()`).

---

## 7. ACTIVITY DIAGRAM QUESTIONS

**Q101: What is an Activity Diagram?**  
**Short Answer:** A behavioral diagram that models procedural workflows, decision logic, and control flows between actions.

**Q102: Name the 3 Activity Diagrams you created.**  
**Short Answer:** `Customer_Order.drawio`, `Restaurant_Order.drawio`, and `Order_Delivery.drawio`.

**Q103: What symbol represents the Initial Node and Final Node?**  
**Short Answer:** A solid filled black circle represents the Initial Node; an encircled filled circle (bullseye) represents the Activity Final Node.

**Q104: What is a Decision Node in an Activity Diagram?**  
**Short Answer:** A diamond symbol that evaluates a guard condition and routes the workflow into one of multiple alternative outgoing paths.

**Q105: What is a Guard Condition?**  
**Short Answer:** A boolean expression enclosed in square brackets (e.g., `[Payment Successful?]`) that must evaluate to true for a flow to proceed.

**Q106: What happens in `Customer_Order.drawio` if the cart is invalid?**  
**Short Answer:** The workflow branches through `[No / Invalid]` to `Modify Cart` and loops back to `View Cart`.

**Q107: What happens in `Restaurant_Order.drawio` if the restaurant rejects an order?**  
**Short Answer:** The workflow routes to `Reject Order`, executes `Notify Customer & Trigger Refund`, and terminates at the Final Node.

**Q108: What happens in `Order_Delivery.drawio` if the customer is unavailable?**  
**Short Answer:** The courier logs `Call Customer / Reschedule or Log Delivery Issue` and transitions to an exception final node.

**Q109: What is the difference between an Activity Diagram and a Flowchart?**  
**Short Answer:** Activity Diagrams support object-oriented concurrency (Fork/Join), swimlanes, and object nodes, which traditional flowcharts lack.

**Q110: What is a Merge Node?**  
**Short Answer:** A diamond symbol that brings multiple alternative incoming flows together into a single outgoing flow without synchronization.

---

## 8. STATE DIAGRAM QUESTIONS

**Q111: What is a State Machine Diagram?**  
**Short Answer:** A behavioral diagram that models the dynamic lifecycle states, events, and transitions of a single entity.

**Q112: Which entity's lifecycle did you model in your State Machine Diagram?**  
**Short Answer:** The `Order` entity (`Order_State_Diagram.drawio`).

**Q113: What is a State?**  
**Short Answer:** A condition or stage in the lifecycle of an object during which it satisfies some condition or waits for an event.

**Q114: What is a Transition?**  
**Short Answer:** A relationship between two states indicating that an object will change its state when a specified trigger event occurs.

**Q115: Name the happy-path lifecycle states of an `Order`.**  
**Short Answer:** `Initial` $\rightarrow$ `Pending Payment` $\rightarrow$ `Confirmed` $\rightarrow$ `Preparing` $\rightarrow$ `Ready for Pickup` $\rightarrow$ `Out for Delivery` $\rightarrow$ `Delivered` $\rightarrow$ `Final`.

**Q116: What trigger event moves an Order from `Pending Payment` to `Confirmed`?**  
**Short Answer:** `paymentSuccess()`.

**Q117: What happens if an order experiences `paymentFailed()`?**  
**Short Answer:** The order transitions to `Payment Failed`; triggering `retryPayment()` moves it to `Payment Retry`, which on approval transitions to `Confirmed`.

**Q118: When is a customer allowed to trigger `cancelOrder()`?**  
**Short Answer:** Only while the order is in `Pending Payment`, `Payment Failed`, or `Confirmed` status before cooking begins.

**Q119: What triggers the transition to `Out for Delivery`?**  
**Short Answer:** `pickupOrder()` / `startDelivery()` executed by the delivery partner.

**Q120: What happens if delivery fails (`deliveryFailed()`)?**  
**Short Answer:** The state moves to `Delivery Failed`, transitions to `Rescheduled` via `reschedule()`, and returns to `Out for Delivery`.

---

## 9. COMPONENT & DEPLOYMENT QUESTIONS

**Q121: What is a Component Diagram?**  
**Short Answer:** A structural diagram that illustrates the organization, modular packaging, and interfaces of software components.

**Q122: Name the 3 tiers in your Component Diagram.**  
**Short Answer:** Presentation Tier (UI), Application Tier (Logic Modules), and Data/External Tier (Database & Payment Gateway).

**Q123: Name four application modules in your Component Diagram.**  
**Short Answer:** `Authentication Module`, `Cart Module`, `Order Module`, and `Payment Module`.

**Q124: What is a Deployment Diagram?**  
**Short Answer:** A structural diagram that models the physical hardware nodes, software execution artifacts, and network communication paths.

**Q125: Name the client device nodes in your Deployment Diagram.**  
**Short Answer:** `Customer Device` (Smartphone/PC), `Restaurant Staff Device` (Tablet/PC), and `Delivery Partner Device` (Smartphone).

**Q126: What protocols connect client devices to the Application Server?**  
**Short Answer:** Secure `HTTPS` over TLS.

**Q127: What protocol connects the Application Server to the Database Server?**  
**Short Answer:** `Database Connection (JDBC / TCP)` over an internal secure network.

**Q128: What is an Artifact in your Deployment Diagram?**  
**Short Answer:** Physical deployed files such as `FoodOrderingCoreAPI.jar`, `PaymentIntegrationService.js`, and `FoodOrderingDB.sql`.

**Q129: What is the primary difference between a Component Diagram and a Deployment Diagram?**  
**Short Answer:** Component diagrams show logical software modules and their code dependencies; Deployment diagrams show physical hardware nodes and where software artifacts run.

**Q130: What is a Package Diagram?**  
**Short Answer:** A structural diagram grouping classes into modular namespaces (`10_Package/Package_Diagram.drawio`) with `<<use>>` dependencies.

---

## 10. PROJECT-SPECIFIC & SCENARIO QUESTIONS

**Q131: Why did you choose the Online Food Ordering System for your project?**  
**Short Answer:** It provides a realistic, highly interactive multi-actor domain that exercises all core OOAD concepts: BCE architecture, inheritance, composition, state transitions, and asynchronous messaging.

**Q132: What is the difference between `Customer` and `RestaurantStaff`?**  
**Short Answer:** `Customer` is a consumer actor who searches food, manages carts, and pays; `RestaurantStaff` is a merchant actor who manages menu catalogs, accepts orders, and updates cooking status.

**Q133: Why is `OrderController` classified as a Control class?**  
**Short Answer:** Because it coordinates business logic between user interfaces (`CheckoutPage`) and database entities (`Cart`, `Order`, `FoodItem`), enforcing business rules without storing persistent state.

**Q134: What is the difference between a Sequence Diagram and a Communication Diagram?**  
**Short Answer:** Sequence diagrams emphasize the chronological time-ordering of messages; Communication diagrams emphasize the structural link topology and numbered interactions between objects.

**Q135: What happens in your system when a customer cancels an order?**  
**Short Answer:** The system verifies the order is in pre-cooking status, transitions state to `Cancelled`, notifies the restaurant, and triggers an automated 100% refund via the Payment Gateway.

**Q136: What happens if the restaurant rejects an incoming order?**  
**Short Answer:** The order transitions to `Rejected`, the customer receives an alert with the rejection reason, and the system automatically issues a full refund.

**Q137: How does your system prevent ordering from multiple restaurants in a single cart?**  
**Short Answer:** Business Rule `BR-02` is enforced in `CartController.addItem()`; adding an item from a different restaurant prompts the customer to either clear the existing cart or cancel the action.

**Q138: How is the grand total calculated during checkout?**  
**Short Answer:** In `Order.calculateTotal()`, summing item subtotals ($\text{Price} \times \text{Quantity}$), adding applicable taxes and delivery fees, and subtracting promo discounts.

**Q139: Why are Star Ratings and Reviews restricted until delivery?**  
**Short Answer:** Rule `BR-07` ensures review integrity; reviews can only be posted for orders with verified `DELIVERED` status.

**Q140: What is an Object Diagram and what snapshot did you model?**  
**Short Answer:** It shows concrete runtime object instances with slot values at a specific point in time; we modeled an active snapshot of Order #ORD-501 (`11_Object/Object_Diagram.drawio`).

**Q141: What information is stored in the `Delivery` entity?**  
**Short Answer:** `deliveryId`, `orderId`, `partnerId`, `deliveryStatus`, `deliveryAddress`, `pickupTime`, and `deliveryTime`.

**Q142: Why is `Category` modeled as a separate entity rather than just a String attribute in `FoodItem`?**  
**Short Answer:** Modeling `Category` as an entity allows category descriptions, hierarchy management, and flexible menu filtering without data redundancy.

**Q143: How does the system handle temporary network failure during payment?**  
**Short Answer:** The order remains preserved in `PENDING_PAYMENT` / `PAYMENT_FAILED` state, allowing the customer to retry payment without losing their cart contents.

**Q144: What design pattern does BCE (Boundary-Control-Entity) resemble?**  
**Short Answer:** It is closely related to the Model-View-Controller (MVC) architectural pattern: Boundary $\approx$ View, Control $\approx$ Controller, Entity $\approx$ Model.

**Q145: What is the benefit of keeping `FoodItem.price` separate from `OrderItem.price`?**  
**Short Answer:** If a restaurant changes a food item's price tomorrow, historical past orders must retain the exact price the customer originally paid (`OrderItem.price`).

**Q146: Which diagram best explains the full ordering lifecycle to non-technical stakeholders?**  
**Short Answer:** The `Activity_Customer_Order.drawio` Activity Diagram, as it clearly shows step-by-step actions and decision diamonds.

**Q147: Which diagram is most critical for database schema developers?**  
**Short Answer:** The `Class_Diagram.drawio`, as it defines tables, column data types, primary keys, and foreign key relationships.

**Q148: Which diagram is most critical for backend API developers?**  
**Short Answer:** The `Sequence_Place_Order.drawio` and `Sequence_Payment.drawio` Sequence Diagrams, as they define exact controller method calls and parameters.

**Q149: How did you ensure 100% consistency across all 29 project files?**  
**Short Answer:** By maintaining identical actor names, class names, method signatures, attribute types, and state transitions across the entire requirements-to-deployment chain.

**Q150: What is the primary takeaway from your OOAD Review 1 project?**  
**Short Answer:** OOAD provides a structured, rigorous methodology to transform complex, multi-stakeholder real-world requirements into clean, decoupled, modular, and maintainable software architectures.

---
*Comprehensive Viva Voce Guide compiled, verified, and saved for Review 1 & Lab Examinations.*
