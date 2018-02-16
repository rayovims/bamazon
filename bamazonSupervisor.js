var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazonDB"
});

connection.connect(function(err) {
  start();
});

function start() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        choices: ["View product sales by department", "Create new Department"],
        name: "choice"
      }
    ])
    .then(function(result) {
      switch (result.choice) {
        case "View product sales by department":
          return dep();
        case "Create new Department":
          return addDep();
      }
    });
}

function dep() {
  connection.query(
    "SELECT d.department_id, d.department_name, d.over_head_costs, p.product_sales, SUM(p.product_sales - d.over_head_costs) AS total_profits FROM departments AS d LEFT JOIN (SELECT department_name, sum(product_sales) AS product_sales FROM products group by department_name )AS p ON d.department_name = p.department_name GROUP BY d.department_id, d.department_name, d.over_head_costs, p.product_sales ORDER BY d.department_id",
    function(err, res) {
      if (err) throw err;

      console.log("");
      console.log("----- View Product Sales by Department -----");
      console.log("");
      console.table(res), [];
    }
  );
  connection.end();
}

function addDep() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department_name",
        message: "What department would you like to create?"
      },
      {
        type: "input",
        name: "over_head_costs",
        message: "How much are the over head costs?",
        validate: function(val) {
          if (val <= 0) {
            return "We have to have over head costs...";
          }
          if (!isNaN(val)) {
            return true;
          } else {
            return "Please only enter numbers";
          }
        }
      }
    ])
    .then(function(response) {
      connection.query("insert into departments set ?", [
        {
          department_name: response.department_name,
          over_head_costs: response.over_head_costs
        }
      ]);
      console.log("");
      console.log(
        "You created the " +
          response.department_name +
          " department that has $" +
          response.over_head_costs +
          " dollars of over head costs"
      );
      console.log("");
      connection.end();
    });
}
