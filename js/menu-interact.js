let entrees = [], desserts = [], beverages = [];

document.querySelectorAll('.menu-item').forEach((item) => {
  item.addEventListener('click', handleItemClick);
  item.querySelector('.qty-input').addEventListener('change', updateSelectedItems);
  item.querySelector('.qty-input').addEventListener('click', (e) => e.stopPropagation());
  item.querySelector('.check-it').addEventListener('click', addSelectedItem);
  item.querySelector('.cancel-x').addEventListener('click', cancelSelectedItem);
});


function handleItemClick(event) {
  const item = event.currentTarget;
  const name = item.dataset.name;
  const price = item.dataset.price;
  const category = item.dataset.category;

  // Log clicked item
  console.log(`Clicked: ${name} | Price: $${price} | Category: ${category}`);

  const qtyInput = item.querySelector('.qty-input');
  const cancelX = item.querySelector('.cancel-x');
  const checkIt = item.querySelector('.check-it');

  item.classList.add('selected');
  qtyInput.style.display = 'block';
  cancelX.style.display = 'block';
  checkIt.style.display = 'block';
  qtyInput.focus();
}

function updateSelectedItems(event) {
  event.stopPropagation();

  const qtyInput = event.target; // the number input box that was changed

  // Use closest() to safely find the menu-item container even if structure changes
  const item = qtyInput.closest('.menu-item');
  const name = item.dataset.name;

  const qty = qtyInput.value; // value of input box

  // Log the updated quantity for that specific item
  console.log(`Updated quantity: ${name} x ${qty}`);
}

function addSelectedItem(event) {
  event.stopPropagation();

  const item = event.target.closest('.menu-item');
  const name = item.dataset.name;
  const category = item.dataset.category;
  const quantity = item.querySelector('.qty-input').value;

  if (quantity <= 0) {
    return;
  }

  let list, array;
  
  // If item to add is an entree, find the unordered list and set array to add to
  if (category === 'entree') {
    list = document.getElementById('entree-list')
    array = entrees;
  } else if (category === 'beverage') {
    list = document.getElementById('beverage-list') 
    array = beverages;
  } else if (category === 'dessert') {
    list = document.getElementById('dessert-list')
    array = desserts;
  }

  const existingDish = array.find(function(dish) {
    return dish.name === name;
  })

  if (existingDish) {
    existingDish.quantity = quantity;
  } else {
    array.push({name, quantity});
  }

  updateSideBar(list, array);
}

function cancelSelectedItem(event) {
  event.stopPropagation();  // prevent re-activating the item
  
  // Get menu items name and category
  const item = event.target.closest('.menu-item');
  const name = item.dataset.name;
  const category = item.dataset.category;

  // Logs which item was removed to console
  console.log(`Removed Item: ${name}`);

  // Remove toggled values
  item.classList.remove('selected'); 
  item.querySelector('.qty-input').style.display = 'none';
  item.querySelector('.cancel-x').style.display = 'none';
  item.querySelector('.check-it').style.display = 'none';
  item.querySelector('.qty-input').value = '';
  
  let array, list;
  if (category === 'entree') {
    array = entrees;
    list = document.getElementById('entree-list')
  } else if (category === 'beverage') {
    array = beverages;
    list = document.getElementById('beverage-list')
  } else if (category === 'dessert') {
    array = desserts;
    list = document.getElementById('dessert-list')
  }

  const dishToRemove = array.findIndex(dish => dish.name === name);

  if (dishToRemove !== -1)  {
    array.splice(dishToRemove, 1);
  }

  updateSideBar(list, array);
  
}

function updateSideBar(dishList, array) {
  dishList.innerHTML = ''; // clear list 

  // add every dish in given list to website
  for (const dish of array) {
    let name = dish.name;
    let quantity = dish.quantity

    let newLi = document.createElement('li');
    let text = document.createTextNode(name + " x " + quantity);

    newLi.appendChild(text);
    dishList.appendChild(newLi);
  }
}

function getSelectedAddOns() {
  const checkedAddOns = document.querySelectorAll('input[name="addons[]"]:checked');
  const selectedAddOns = [];
  for (const box of checkedAddOns) {
    selectedAddOns.push(box.value);
  }
  return selectedAddOns;
}

function getTodayDateString() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0'); 
  const day = String(today.getDate()).padStart(2, '0');
  const year = today.getFullYear();
  return `${year}-${month}-${day}`;
}

function buildOrderObject() {
  const order = {
    customer: document.getElementById("name").value,
    date: getTodayDateString(),
    delivery: document.getElementById("delivery").checked,
    tipPercent: parseFloat(document.querySelector('input[name="tip"]:checked')?.value || 0),
    entrees: entrees,
    drinks: beverages,
    desserts: desserts,
    addOns: getSelectedAddOns()
  };

  return order;
}

const priceMap = {
  "Chicken Alfredo": 16.99,
  "Birria Tacos": 12.99,
  "Cheeseburger": 13.99,
  "Chicken Pesto Sandwhich": 11.99,
  "Iced Chai": 5.49,
  "Iced Matcha": 6.49,
  "Hot Coffee": 3.49,
  "Tres Leches Cake": 5.99,
  "Milhojas Slice": 6.49,
  "extra cheese": 1.00,
  "extra meat": 3.00
};

function printReceipt(order, prices) {
  let total = 0;
  let receipt = [];

  receipt.push("BYTE BISTRO RECEIPT – " + order.customer);
  receipt.push("Date: " + order.date);
  receipt.push("-------------------------------------");

  const categories = [
    { title: "Entree", items: order.entrees },
    { title: "Drink", items: order.drinks },
    { title: "Dessert", items: order.desserts }
  ];

  categories.forEach(({ title, items }) => {
    if (Array.isArray(items)) {
      items.forEach(item => {
        const cost = prices[item.name] * item.quantity;
        total += cost;
        receipt.push(`${item.name} × ${item.quantity} – $${cost.toFixed(2)}`);
      });
    }
  });

  if (Array.isArray(order.addOns)) {
    order.addOns.forEach(addOn => {
      const price = prices[addOn] || 0;
      total += price;
      receipt.push(`${addOn} – $${price.toFixed(2)}`);
    });
  }
  const tip = total * (order.tipPercent / 100);

  if (order.delivery === true) {
    total += 3.00;
    receipt.push('Delivery Fee: $3.00');
  }

  const grandTotal = total + tip;

  receipt.push(`Tip (${order.tipPercent}%): $${tip.toFixed(2)}`);
  receipt.push("-------------------------------------");
  receipt.push(`TOTAL: $${grandTotal.toFixed(2)}`);

  const output = document.getElementById("receiptOutput");
  output.innerHTML = receipt.join("<br>");
  console.log(receipt.join("\n"));
}

document.getElementById("previewBtn").addEventListener("click", function () {
  const order = buildOrderObject();
  printReceipt(order, priceMap);
  document.getElementById("orderJson").value = JSON.stringify(order);
});

document.querySelector("form").addEventListener("submit", function () {
  const order = buildOrderObject();
  document.getElementById("orderJson").value = JSON.stringify(order);
});