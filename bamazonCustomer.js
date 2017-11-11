var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "Ray",

    password: "password",
    database: "bamazonDB"
});

connection.connect(function (err) {
    customer();
});


function customer () {
    connection.query("SELECT * FROM products", function(err, res){
        for (var i = 0; i < res.length; i++) {
            console.log("Item Id: " + res[i].item_id + "\nItem Name: " + res[i].item_name + "\nItem Price: " + res[i].price + "\n___________________");
        }
        inquirer.prompt([
            {
                type: "input",
                message: "What is the ID of the product they would like to buy?",
                name: "itemName"
            },
            {
                type: "input",
                message: "How many units of the product would you like to buy?",
                name: "units"
            }
        ]).then(function (result) {
            var query = connection.query(
                "SELECT * FROM products WHERE ?",
                {
                    item_id: result.itemName
                },
                function (err, res) {
                    if (result.units <= res[0].stock_quantity) {
                        var unitsRemaining = res[0].stock_quantity - result.units;
                        var total = result.units * res[0].price;
                        var totalSales = res[0].product_sales += total;
                        var query = connection.query("UPDATE products SET ? WHERE ?", [
                            {
                                stock_quantity: unitsRemaining,
                                product_sales: totalSales
                            },
                            {
                                item_id: result.itemName
                            }
                        ], function (err, res) {
                            console.log("youre total is: " + total);
                            console.log("You're order has been placed!");
                        })
                    }
                    else {
                        console.log("Sorry, but there is Insufficient Quantity");
                    }
                    connection.end();
                }
            );
        })
    })
};

