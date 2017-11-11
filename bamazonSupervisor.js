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
    start();
});

function start() {
    inquirer.prompt([
        {
            type: "list",
            message: "What do you want todo?",
            choices: ["View product sales by department", "Create new Department"],
            name: "choice"
        },
    ]).then(function (result) {
        switch (result.choice) {
            case "View product sales by department":
                return dep();
            case "Create new Department":
                return addDep();
        }
    })
}

function dep () {
    connection.query("select d.department_id, d.department_name, d.over_head_costs, p.product_sales, sum(p.product_sales - d.over_head_costs) as total_profits from departments as d left join (select department_name, sum(product_sales) as product_sales from products group by department_name )as p on d.department_name = p.department_name group by d.department_id, d.department_name, d.over_head_costs, p.product_sales order by d.department_id", function(err, data){
        console.log(data);
    })
}