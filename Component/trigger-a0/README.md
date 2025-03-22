
# Trigger_01 Component Documentation

The **Trigger_01** component is a lightweight custom HTML element designed to trigger actions on other components (e.g., modals, tooltips, dropdowns) through events such as clicks, hovers, or keyboard interactions.

![Trigger Diagram](./trigger-01-diagram.svg)

---

## What It Does:

When the specified event (or events) occurs, the **Trigger_01** component:

- Finds the target element via the `rf-sync-get` attribute.
- Calls the target element’s `api()` method, passing the action defined in the `rf-api-type` attribute.

---

## Attributes:

### 1. `rf-event-type` *(optional)*

**Description:**  
Specifies one or more event types to trigger the target's API method.

**Default:**  
`"click"`

**Acceptable Values:** *(comma-separated list allowed)*  
- Mouse Events:
  - `"click"` – Fires when the element is clicked.
  - `"dblclick"` – Fires on double-click.
  - `"mousedown"` – Fires when a mouse button is pressed.
  - `"mouseup"` – Fires when a mouse button is released.
  - `"mouseenter"` – Fires when the mouse enters the element (hover start).
  - `"mouseleave"` – Fires when the mouse leaves the element (hover end).
  - `"mouseover"` – Fires when the pointer moves onto or over the element.
  - `"mouseout"` – Fires when the pointer moves out of the element.

- Keyboard Events:
  - `"keydown"` – Fires when a key is pressed.
  - `"keyup"` – Fires when a key is released.

- Touch Events:
  - `"touchstart"` – Fires when a touch is initiated.
  - `"touchend"` – Fires when a touch ends.

- Pointer Events (mouse/touch/pen):
  - `"pointerenter"` – Fires when a pointer moves onto the element.
  - `"pointerleave"` – Fires when a pointer moves off the element.

**Example usage:**  
```html
<trigger-01 rf-event-type="click, keyup"></trigger-01>
```

---

### 2. `rf-api-type` *(optional)*

**Description:**  
Specifies the API command to send to the target component’s `api()` method.

**Default:**  
`"open"`

**Common Values:** *(depends on target component implementation)*  
- `"open"` – Typically opens modals, dropdowns, tooltips.
- `"close"` – Typically closes modals, dropdowns.
- `"toggle"` – Toggles open/close state.
- `"destroy"` – Cleans up the component.

**Example usage:**  
```html
<trigger-01 rf-api-type="toggle"></trigger-01>
```

---

### 3. `rf-sync-get` *(required)*

**Description:**  
Specifies the target component to trigger. Matches the target component’s `rf-sync` attribute.

**Acceptable Values:**  
Any string that matches a target component's `rf-sync` attribute.

**Example usage:**  
```html
<trigger-01 rf-sync-get="modal01"></trigger-01>

<!-- Target example -->
<modal-01 rf-sync="modal01"></modal-01>
```

---

## Example – Full Component Usage:

This example demonstrates a **Trigger_01** element that triggers opening a modal (`Modal_01`) on both click and keyup events.

```html
<!-- Trigger Element -->
<trigger-01
    rf-event-type="click, keyup"
    rf-api-type="open"
    rf-sync-get="myModal">
    Open Modal
</trigger-01>

<!-- Target Element -->
<modal-01 rf-sync="myModal"></modal-01>
```

---

## Summary of Functionality:

| Attribute        | Required? | Default     | Example                  | What it does                                    |
|------------------|-----------|-------------|--------------------------|-------------------------------------------------|
| `rf-event-type`  | No        | `"click"`   | `"click, keyup"`         | Events that trigger the action.                 |
| `rf-api-type`    | No        | `"open"`    | `"open", "close"`        | API command sent to the target component.       |
| `rf-sync-get`    | **Yes**   | `null`      | `"modal01", "tooltip1"`  | Target component identifier.                    |

This simplified, attribute-driven design allows you to quickly configure triggers without writing additional JavaScript code, facilitating rapid UI interactions with other custom components.
