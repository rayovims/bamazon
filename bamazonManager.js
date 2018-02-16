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
    manager();
});


function manager() {
    connection.query("SELECT * FROM products", function (err, res) {
        inquirer.prompt([
            {
                type: "list",
                message: "Menu",
                choices: ["View products for sale", "View low inventory", "Add to inventory", "Add new product"],
                name: "options"
            },
        ]).then(function (result) {
            console.log(result.options);
            switch (result.options) {
                case "View products for sale":
                    return forSale();
                case "View low inventory":
                    return inventory();
                case "Add to inventory":
                    return addInven();
                case "Add new product":
                    return addPro();
            }
        });
    })
};

function forSale() {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("Item Id: " + res[i].item_id + "\nItem Name: " + res[i].item_name + "\nItem Price: " + res[i].price + "\nQuantity: " + res[i].stock_quantity + "\n___________________");
        };
    });
    manager();
};

function inventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("Item Id: " + res[i].item_id + "\nItem Name: " + res[i].item_name + "\nItem Price: " + res[i].price + "\nQuantity: " + res[i].stock_quantity + "\n___________________");
        };
    });
    manager();
};

function addInven() {
    inquirer.prompt([{
        type: "input",
        message: "Item ID to restock?",
        name: "ID"
    }, {
        type: "input",
        message: "Amount restocked?",
        name: "amount"
    }
    ]).then(function (result) {
        connection.query("SELECT * FROM products WHERE ?", {
            item_id: result.ID
        }, function (err, res) {
            var NewQuan = res[0].stock_quantity += parseInt(result.amount);
            connection.query("UPDATE products SET ? WHERE ?", [
                {
                    stock_quantity: NewQuan
                },
                {
                    item_id: result.ID
                }
            ], function (err, res) {
                console.log("You have updated the inventory! \n New inventory is: " + NewQuan);
            })
            manager();
        })
    });
}

function addPro() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is your new product",
            name: "item"
        },
        {
            type: "input",
            message: "How much for the product?",
            name: "price"
        },
        {
            type: "input",
            message: "What department?",
            name: "department"
        },
        {
            type: "input",
            message: "How many units of the new Product?",
            name: "units"
        }
    ]).then(function (result) {
        connection.query("INSERT INTO products SET ?",
            {
                item_name: result.item,
                department_name: result.department,
                price: result.price,
                stock_quantity: result.units
            },
            function (err, res) {
                console.log("Item added!");
            });
        manager();
    });
}