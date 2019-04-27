var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "nodeuser",
  password: "myPassword",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  checkStock();
});

// orders are placed using command line arguments:
var orderProductID = process.argv[2];
var orderQuantity = process.argv[3];

function checkStock() {
  connection.query(
    "SELECT stock_quantity FROM products WHERE item_id = " + orderProductID,
    function(err, res) {
      stockQuantity = res[0].stock_quantity
      if (orderQuantity > stockQuantity) {
        console.log("product ID: " + orderProductID + ", not enough stock!");
        connection.end();
      } else {
        console.log("Product ID: " + orderProductID + "\n");
        console.log("Quantity Ordered: " + orderQuantity + "\n");
        placeOrder();
      }
    }
  );
};

function placeOrder() {
  console.log("placing order...\n");
  connection.query(
    "UPDATE products SET stock_quantity = stock_quantity - " + orderQuantity + " WHERE item_id = " + orderProductID,
    function(err, res) {
      console.log("order placed!");
    }
  );
  readProducts();
};

function readProducts() {
  console.log("You ordered " + orderQuantity + ", product ID: " + orderProductID)
  
  connection.query("SELECT price FROM products WHERE item_id = " + orderProductID, 
  function(err, res) {
    if (err) throw err;
    var total = res[0].price * orderQuantity;
    console.log("order total: " + total);
  });
  connection.end();
}