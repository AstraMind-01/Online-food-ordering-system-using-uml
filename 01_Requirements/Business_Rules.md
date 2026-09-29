# ONLINE FOOD ORDERING SYSTEM — BUSINESS RULES

* **BR-01 (Authentication Mandate):** A customer must be registered and authenticated before proceeding to checkout and placing an order.
* **BR-02 (Single-Restaurant Cart):** A cart must contain at least 1 item, and all items in an active cart must originate from the same restaurant.
* **BR-03 (Kitchen Acceptance Gate):** A restaurant must explicitly accept an order before cooking preparation commences.
* **BR-04 (Financial Precondition):** Payment authorization must succeed before an order transitions to `CONFIRMED` / `PLACED`.
* **BR-05 (Cancellation & Refund Policy):** Orders can be cancelled only while in `PLACED` or `ACCEPTED` status (disabled once status becomes `PREPARING`). Cancellations trigger an automatic 100% refund.
* **BR-06 (Courier Assignment Isolation):** Delivery partners can view and update transit milestones only for orders assigned to them.
* **BR-07 (Review Post-Condition):** Review and rating forms are unlocked only after an order is marked `DELIVERED`.
* **BR-08 (Billing Calculation Formula):**
  $$\text{Total Amount} = \sum (\text{Price} \times \text{Quantity}) + \text{Taxes} + \text{Delivery Fee} - \text{Discounts}$$
