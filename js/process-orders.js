/*
  Name: Nathan Carrillo
  Date: April 28, 2025
  Class: CS 290 – Web Development

  Instructions:
  - Add your name, date, and class above.
  - Provide a detailed comment header before each function describing what it does.
  - Leave all TODO comments in place while working. Remove them only after completing each function.
  - Use clear variable names and add inline comments to explain your logic.
*/

const orders = require('./orders.js');
const deliveryFee = 3.00;


const priceMap = {
  "Veggie Mac": 8.00,
  "Tofu Tacos": 9.50,
  "Byte Burger": 11.25,
  "Curry Bowl": 12.00,
  "Recursive Ravioli": 13.50,
  "Iced Tea": 2.50,
  "Soda": 2.00,
  "Coffee": 2.00,
  "Byte Brownie": 4.00,
  "Lava Cake": 5.00,
  "Vanilla Cheesecake": 4.50,
  "extra salsa": 0.50,
  "extra cheese": 1.00,
  "side of rice": 2.00
};

// Function: findOrderByCustomer
// Description: Finds an order by customer name in the orders array and returns order if found, otherwise null. 
// Parameters:
// - orders: array of order objects
// - name: customers name of order to find
// Returns: The first order object that matches the customer name, or undefined if no match is found.
function findOrderByCustomer(orders, name) {
  if (Array.isArray(orders) === false) {
    return null; // returns null if orders array is not valid
  }
  return orders.find((order) => order.customer === name);
}

// Function: calculateSubtotal
// Description: calculates the total of an order based on items ordered (entrees, drinks, etc.)
// Parameters:
// - order: order object from orders array
// - prices: reference to prices of each item
// Returns: calculated subtotal 
function calculateSubtotal(order, prices) {
  let subtotal = 0;
  if (Array.isArray(order.entrees)) {
    order.entrees.forEach(function(item) {
      subtotal += prices[item.name] * item.quantity;
    });
  } 
  if (Array.isArray(order.drinks)) {
    order.drinks.forEach(function(item) {
      subtotal += prices[item.name] * item.quantity;
    });
  }
  if (Array.isArray(order.desserts)) {
    order.desserts.forEach(function(item) {
      subtotal += prices[item.name] * item.quantity;
    });
  }
  if (Array.isArray(order.addOns)) {
    order.addOns.forEach(function(item) {
      subtotal += prices[item];
    });
  }
  return subtotal;
}

// Function: calculateTip
// Description: calculates tip based on the orders tip percent and orders subtotal
// Parameters:
// - subtotal: total of order food items (not including delivery fee)
// - percent: tip percent made by order
// Returns: calculated tip amount for the order
function calculateTip(subtotal, percent) {
  return (subtotal * (percent / 100));
}

// Function: printReceipt
// Description: prints an order reciept containing name, date, amount of each item ordered, delivery fee
// tip amount, and total for the entire order
// Parameters:
// - order: order object from orders array
// - prices: reference to prices of each food item
// Post-conditions: receipt is printed to console and displays accurate pricing
function printReceipt(order, prices) {
  console.log("BYTE BISTRO RECEIPT – " + order.customer);
  console.log("Date: " + order.date);
  console.log("----------------------------------------");

  if (Array.isArray(order.entrees)) {
    order.entrees.forEach(function(item) {
      const cost = prices[item.name] * item.quantity;
      console.log("Entrée: " + item.name + " x" + item.quantity + " – $" + cost.toFixed(2));
    });
  }

  if (Array.isArray(order.drinks)) {
    order.drinks.forEach(function(item) {
      const cost = prices[item.name] * item.quantity;
      console.log("Drink: " + item.name + " x" + item.quantity + " – $" + cost.toFixed(2));
    });
  }

  if (Array.isArray(order.desserts)) {
    order.desserts.forEach(function(item) {
      const cost = prices[item.name] * item.quantity;
      console.log("Dessert: " + item.name + " x" + item.quantity + " – $" + cost.toFixed(2));
    });
  }

  if (Array.isArray(order.addOns)) {
    order.addOns.forEach(function(item) {
      const cost = prices[item];
      console.log("AddOns: " + item + " – $" + cost.toFixed(2));
    });
  }

  if(order.delivery === true) {
    console.log("Delivery Fee: $3.00");
  }

  let subtotal = calculateSubtotal(order, prices);
  let tip = calculateTip(subtotal, order.tipPercent);
  let total = subtotal + tip;

  // adds delivery fee if order was delivered
  if (order.delivery === true) {
    total += deliveryFee;
  }
  // prints tip and total, rounding to the nearest hundreth
  console.log("Tip (" + order.tipPercent + "%): $" + tip.toFixed(2));
  console.log("TOTAL: $" + total.toFixed(2) + "\n");
}

// Function: summarizeOrdersByDate
// Description: groups orders by date and calculates the revenue made each day, as well as the avg. amount spent
// Parameters:
// - orders: array of order objects
// Post conditions: orders are sorted by dates and # of orders, revenue, and average spent is printed to console 
function summarizeOrdersByDate(orders) {
  const summary = {};

  orders.forEach(function(order) {
    if (!summary[order.date]) {
      summary[order.date] = { total: 0, count: 0 };
    }
    const subtotal = calculateSubtotal(order, priceMap);
    
    // sets delivery to 3 if order was delievered
    let delivery = 0.00
    if (order.delivery === true) {
      delivery = 3.00;
    }
    
    // sets total amount earned and orders made per day
    const tip = calculateTip(subtotal, order.tipPercent);
    summary[order.date].total += subtotal + delivery + tip;
    summary[order.date].count += 1;
  });

  // prints average to console
  for (const date in summary) {
    const day = summary[date];
    const average = day.total / day.count;
    console.log(`Date: ${date} | Orders: ${day.count} | Revenue: $${day.total.toFixed(2)} | Avg: $${average.toFixed(2)}`);
  }
}

// Function: validateOrder
// Description: checks that an order object contains all necessary items, such as name, date, one item per category
// Parameters:
// - order: order object from orders array
// Returns: false if order does not contain all necessary items, true if it has all necessary items
function validateOrder(order) {
  let valid = true;
  if (order.customer === "" || order.date === "" || order.entrees.length === 0 ||
    order.drinks.length === 0 || order.desserts.length === 0) { 
    valid = false;
  }

  if (valid === false) {
    console.log("\nERROR - Order must include a name, date, and at least one entree, drink, or dessert.")
    console.log("*** Order was not ADDED\n");
    return false;
  }
  return true;
}

// Function: addOrders
// Description: checks that new order is valid and adds order to orders array once validated 
// Parameters:
// - orders: array of order objects
// - newOrder: order object to be validated and pushed
// Post-conditions: if newOrder is a valid order, it is added to the orders array
function addOrder(orders, newOrder) {
  if (validateOrder(newOrder) === true) {
    orders.push(newOrder);
    console.log("Order added for " + newOrder.customer + " on " + newOrder.date);
  }
}

// Find a customer's order and print it
const order = findOrderByCustomer(orders, "Willy");
if (order) printReceipt(order, priceMap);

// Add a new order
const newOrder = {
  customer: "Test Customer",
  date: "2025-04-23",
  delivery: true,
  tipPercent: 12,
  entrees: [{ name: "Byte Burger", quantity: 1 }],
  drinks: [{ name: "Coffee", quantity: 1 }],
  desserts: [{ name: "Byte Brownie", quantity: 1 }],
  addOns: ["extra cheese"]
};
addOrder(orders, newOrder);

// Invalid order (should fail validation)
const badOrder = {
  customer: "Bad Customer",
  date: "2025-04-24",
  delivery: false,
  tipPercent: 15,
  entrees: [],
  drinks: [],
  desserts: [],
  addOns: []
};
addOrder(orders, badOrder);

// Print all receipts and daily summary
console.log("All Receipts: ");
orders.forEach(function(order) {
  printReceipt(order, priceMap);
});
summarizeOrdersByDate(orders);

