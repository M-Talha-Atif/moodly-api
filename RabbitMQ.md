# 🐇 RabbitMQ Core Concepts

## 1️⃣ Queue

- Simple FIFO data structure.
- Messages **store hote hain** aur consumers **read** karte hain.
- Example:

  ```
  mood-tasks  --->  [msg1, msg2, msg3]
  ```

---

## 2️⃣ Exchange

- Exchange decide karta hai **message kis queue me jayega**.
- Types:
  - **Direct** → exact routing key match (most common).
  - **Fanout** → sab queues ko broadcast (like pub/sub).
  - **Topic** → wildcard pattern match (e.g. `mood.*`).
  - **Headers** → headers ke basis pe route.

---

## 3️⃣ Routing Key

- Producer message bhejte waqt ek **routing key** assign karta hai.
- Exchange is key ko use karke decide karta hai ki message kahan jaye.
- Example:
  - Message bheja with `routingKey="mood-detect"`.
  - Agar exchange me ye binding hai → message `mood-tasks` queue me chala jayega.

---

## 4️⃣ Binding Key

- Ye ek **rule** hai jo queue aur exchange ke beech hota hai.
- Matlab:

  ```
  Exchange (mood-exchange)
       └─ Binding key: mood-detect
            └─ Queue: mood-tasks
  ```

- Ab agar koi producer exchange pe msg bheje with `routingKey=mood-detect`,
  → wo msg `mood-tasks` queue me deliver ho jayega.

---

# 🔄 Flow Example

1. **Producer** → exchange ko msg bhejta hai:

   ```js
   channel.publish('mood-exchange', 'mood-detect', Buffer.from('Hello'));
   ```

2. **Exchange** → dekhta hai binding rules.
   - Agar binding key = `mood-detect` hai aur queue `mood-tasks` hai → message wahan forward.

3. **Queue** → `mood-tasks` me message aa gaya.
4. **Consumer** → `mood-tasks` queue se message read karega.

---

# ⚡ Visual

```
Producer  --[routingKey=mood-detect]-->  Exchange(mood-exchange)
                                              |
                                 bindingKey: mood-detect
                                              |
                                           Queue(mood-tasks)
                                              |
                                           Consumer
```

---

# ✅ Quick Summary

- **Queue** = messages store hoti hain (consumer padhta hai).
- **Exchange** = message kahan bhejna hai decide karta hai.
- **Routing key** = producer deta hai (msg label).
- **Binding key** = rule jo exchange aur queue ke beech set hota hai.

---
