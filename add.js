// Page elements
var form = document.getElementById("subscription-form");
var tableBody = document.getElementById("subscription-body");
var totalCount = document.getElementById("total-count");
var expiredCount = document.getElementById("expired-count");

// Load saved subscriptions (empty list the first time)
var subscriptions = JSON.parse(localStorage.getItem("subscriptions")) || [];

// Save the list in the browser
function save() {
  localStorage.setItem("subscriptions", JSON.stringify(subscriptions));
}

// "Expired" if the renewal date is before today, otherwise "Active"
function getStatus(renewalDate) {
  var today = new Date().toLocaleDateString("en-CA"); // today as yyyy-mm-dd
  return renewalDate < today ? "Expired" : "Active";
}

// Add one table cell with text to a row
function addCell(row, text) {
  var cell = document.createElement("td");
  cell.textContent = text;
  row.appendChild(cell);
  return cell;
}

// Redraw the table and the summary
function render() {
  tableBody.innerHTML = "";
  var expired = 0;

  for (var i = 0; i < subscriptions.length; i++) {
    var s = subscriptions[i];
    var status = getStatus(s.renewalDate);
    if (status === "Expired") {
      expired++;
    }

    var row = document.createElement("tr");
    addCell(row, s.service);
    addCell(row, s.provider);
    addCell(row, s.subscriber);
    addCell(row, s.renewalDate);
    addCell(row, s.category);
    var statusCell = addCell(row, status);
    statusCell.className = status === "Expired" ? "status-expired" : "status-active";

    // Delete button remembers its position in the list
    var actionCell = document.createElement("td");
    var deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.setAttribute("data-index", i);
    actionCell.appendChild(deleteBtn);
    row.appendChild(actionCell);

    tableBody.appendChild(row);
  }

  totalCount.textContent = subscriptions.length;
  expiredCount.textContent = expired;
}

// Add a subscription when the form is submitted
form.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page from reloading
  subscriptions.push({
    service: document.getElementById("service").value,
    provider: document.getElementById("provider").value,
    subscriber: document.getElementById("subscriber").value,
    renewalDate: document.getElementById("renewal-date").value,
    category: document.getElementById("category").value
  });
  save();
  render();
  form.reset();
});

// Delete a subscription when its Delete button is clicked
tableBody.addEventListener("click", function (event) {
  if (event.target.className === "delete-btn") {
    var index = Number(event.target.getAttribute("data-index"));
    subscriptions.splice(index, 1);
    save();
    render();
  }
});

render();