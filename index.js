const express = require("express");
const app = express();
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "goodreads.db");
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at localhost:3000");
    });
  } catch (e) {
    console.log(`DB Error: ${e.errorMessage}`);
  }
};

initializeDBAndServer();

//GET Books API
app.get("/books/", async (req, res) => {
  const getBooksQuery = `SELECT * FROM book ORDER BY book_id ASC;`;
  const booksArray = await db.all(getBooksQuery);
  res.send(booksArray);
});

//GET BOOK API

app.get("/books/:id", async (req, res) => {
  const { id } = req.params;
  const getBookQuery = `SELECT * FROM book WHERE book_id=${id};`;
  const book = await db.get(getBookQuery);
  res.send(book);
});

// POST Book API

app.post("/books/", async (req, res) => {
  const bookDetails = req.body;
  const {
    title,
    authorId,
    rating,
    ratingCount,
    reviewCount,
    description,
    pages,
    dateOfPublication,
    editionLanguage,
    price,
    onlineStores,
  } = bookDetails;
  const addBookQuery = `INSERT INTO book(title,author_id,
    rating,rating_count,review_count,description,pages,date_of_publication,
    edition_language,price,online_stores)VALUES(
        '${title}',
        ${authorId},
        ${rating},
        ${ratingCount},
        ${reviewCount},
        '${description}',
        ${pages},
        '${dateOfPublication}',
        '${editionLanguage}',
        ${price},
        '${onlineStores}');`;
  const dbResponse = await db.run(addBookQuery);
  const bookId = await dbResponse.lastID;
  res.send({ bookId });
});

app.put("/books/:bookId", async (request, response) => {
  const { bookId } = request.params;
  const bookDetails = request.body;
  const {
    title,
    authorId,
    rating,
    ratingCount,
    reviewCount,
    description,
    pages,
    dateOfPublication,
    editionLanguage,
    price,
    onlineStores,
  } = bookDetails;
  const updateBookQuery = `UPDATE book SET title= '${title}' ,author_id= ${authorId},
  rating=${rating},rating_count =  ${ratingCount},review_count=${reviewCount},
   description='${description}',pages=${pages},date_of_publication='${dateOfPublication}',
    edition_language= '${editionLanguage}',price=${price},online_stores= '${onlineStores}' WHERE book_id =${bookId} ;`;
  await db.run(updateBookQuery);
  response.send("Book updated Successfully");
});
//Delete Book API

app.delete("/books/:bookId", async (request, response) => {
  const { bookId } = request.params;
  const deleteBookQuery = `DELETE FROM book WHERE book_id = ${bookId};`;
  await db.run(deleteBookQuery);
  response.send("Book deleted Successfully");
});

// Author Id Api

app.get("/authors/:authorId/books/", async (request, response) => {
  const { authorId } = request.params;
  const getAuthorsBookQuery = `SELECT * FROM book WHERE author_id=${authorId};`;
  const authorBooks = await db.all(getAuthorsBookQuery);
  response.send(authorBooks);
});
