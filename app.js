// Bulletin Board Application
// Create a website that allows people to post messages to a page. A message consists of a title and a body.
// The site should have two pages:
// - The first page shows people a form where they can add a new message.
// - The second page shows each of the messages people have posted.
// Make sure there's a way to navigate the site so users can access each page.

// Messages must be stored in a postgres database. Create a "messages" table with three columns:
// column name / column data type:
// - id: serial primary key
// - title: text
// - body: text

const express = require("express")
const app = express()
require('dotenv').load();
const pg = require('pg')
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }))

const Client = pg.Client;
const client = new Client({
    user: process.env.user,
    host: process.env.host,
    database: process.env.database,
    password: process.env.password,
    port: process.env.port,
})
console.log(process.env.name)
client.connect()

app.set("view engine", "pug")

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/messages", (req, res) => {
    const query = {
        text: 'SELECT * FROM messages',
    }

    client.query(query, (err, response) => {
        console.log(response.rows)

        var result = response.rows
        console.log("RESSS ROOOOOWWWSS", result)
        res.render("messages", { result: result })
    })

})



app.get("/msg", (req, res) => {
    var specMsg = {
        text: `SELECT * FROM messages where user_id = (SELECT id FROM "user" WHERE email = '${firstname}');`,
        text: `SELECT * FROM messages where user_id = (SELECT id FROM "user" WHERE email = '${lastname}');`,
        text: `SELECT * FROM messages where user_id = (SELECT id FROM "user" WHERE email = '${email}');`,
    }

    client.query(specMsg, (err, response) => {
        console.log(response.rows)

        var match = response.rows
        console.log("THIS IS THE MOMENT", result)
        res.render("msg", { match: match })
    })

})

app.get("/searchbar", (req, res) => {
    res.render("searchbar")
})



app.post("/searchbar", (req, res) => {
    var firstname = req.body.firstname
    var lastname = req.body.lastname
    var email = req.body.email


    console.log("FIRSTNAMEEEEEEEE", firstname)
    console.log("LASTNAMEE", lastname)
    console.log("EMAIIIIIIIILLLL", email)

    var query3 = {
        text: `SELECT * FROM messages where user_id = (SELECT id FROM "user" WHERE email = '${email}' OR firstname = '${firstname}' OR lastname = '${lastname}');`,
    }

    client.query(query3, (err, result) => {
        console.log("HEREEEEEEE NZO", result) // NUMMER 2 plus twee objecten 
        var match = result.rows
        console.log("GIMME THA MONNEEEYYY", match)

        res.render("msg", { email: email, lastname: lastname, firstname: firstname, match: match })
    })
})

app.post("/messageForm", (req, res) => {
    var title = req.body.title
    var body = req.body.message
    var user_id = req.body.user_id
    console.log(title)
    console.log(body)
    console.log(user_id)
    var array1 = []
    const query = {
        text: 'SELECT * FROM messages',
    }

    const query2 = {
        text: `INSERT INTO messages (title, body, user_id) values('${title}','${body}',${user_id});`,
    }

    client.query(query2, (err, res) => {
        console.log(res) // NUMMER 2 plus twee objecten 
    })

    client.query(query, (err, res) => {
        console.log("BROOO", res.rows) // NUMMER 3 plus alle objecten

        var result = res.rows
        console.log("RESSS ROOOOOWWWSS", result)
        array1.push(result)
    })
    res.redirect("messages")
})


app.listen(3002, () => { console.log("Listening at 3002") })