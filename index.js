import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "123Abc567..",
  port: 5432,
});

db.connect();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];



app.get("/", async (req, res) => {
  const all_item = await db.query("SELECT * FROM items");
  const all_items = all_item.rows;
  console.log(all_items);
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: all_items,
  });
});

app.post("/add", (req, res) => {
  const item = req.body.newItem;
  items.push({ title: item });
  db.query("INSERT INTO items (title) VALUES ($1)", [item]);
  res.redirect("/");
});

app.post("/edit", (req, res) => {
  const itemId = req.body.updatedItemId;
  const itemTitle = req.body.updatedItemTitle;
  db.query("UPDATE items SET title = $1 WHERE id = $2", [itemTitle, itemId]);
  res.redirect('/');
});

app.post("/delete", (req, res) => {
  const itemId = req.body.deleteItemId;
  db.query("DELETE FROM items WHERE id = $1", [itemId]);
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
