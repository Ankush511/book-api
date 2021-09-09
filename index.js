require("dotenv").config();
// Frame work
const express = require("express");
const mongoose = require("mongoose");

// database
const database = require("./database/index");

// Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");


//initializing express
const shapeAI= express();

//configurations
shapeAI.use(express.json());

// Establish database connection
mongoose.connect(process.env.MONGO_URL, 
    {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    }
)
.then(() => console.log("connection established!!"));

/* 
Route           /
Description     get all books  
Access          PUBLIC
Parameters      NONE
Method          GET
*/
shapeAI.get("/", async (req, res)=> {
    const getAllBooks = await BookModel.find();
    return res.json({ books: getAllBooks });
});

/* 
Route           /is
Description     get specific book based on ISBN 
Access          PUBLIC
Parameters      isbn
Method          GET
*/
shapeAI.get("/is/:isbn", async (req,res)=> {

    const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});
    // const getSpecificBook= database.books.filter((book)=>book.ISBN === req.params.isbn);
    if(!getSpecificBook){
        return res.json({error: `No book found for the ISBN of ${req.params.isbn}`})
    }
    return res.json({book: getSpecificBook});
});

/* 
Route           /c
Description     get specific books based on category  
Access          PUBLIC
Parameters      category
Method          GET
*/
shapeAI.get("/c/:category", async (req, res) => {
    const getSpecificBooks = await BookModel.findOne({
        category: req.params.category,
    });
    // const getSpecificBooks= database.books.filter((book)=>book.category.includes(req.params.category));
    if(!getSpecificBooks){
        return res.json({error: `No book found for the category of ${req.params.category}`})
    }
    return res.json({book: getSpecificBooks});
})
/* 
Route           /a
Description     get specific books based on authors name
Access          PUBLIC
Parameters      name
Method          GET
*/
shapeAI.get("/a/:name", (req,res)=> {
    const getSpecificBook= database.authors.filter((authors)=>authors.name === req.params.name);
    if(getSpecificBook.length === 0){
        return res.json({error: `No book found for the Author of ${req.params.name}`})
    }
    return res.json({book: getSpecificBook});
});
/* 
Route           /author
Description     get all authors  
Access          PUBLIC
Parameters      NONE
Method          GET
*/
shapeAI.get("/author", async (req, res)=> {
    const getAllAuthors = await AuthorModel.findOne();
    return res.json({ authors : getAllAuthors});
});
/* 
Route           /au
Description     get specific authors based on author id  
Access          PUBLIC
Parameters      id
Method          GET
*/
shapeAI.get("/aut/:id", (req,res)=> {
    const getSpecificAuth= database.authors.filter((authors)=>authors.id === parseInt(req.params.id));
    if(getSpecificAuth.length === 0){
        return res.json({error: `No Author found for the id of ${req.params.id}`})
    }
    return res.json({book: getSpecificAuth});
});

/* 
Route           /author
Description     to get a list of authors based on a book.
Access          PUBLIC
Parameters      isbn
Method          GET
*/
shapeAI.get("/author/:isbn", (req, res)=> {
    const getSpecificAuthors= database.authors.filter((author)=>author.books.includes(req.params.isbn));
    if(getSpecificAuthors.length === 0){
        return res.json({error: `No Author found for the book of ${req.params.isbn}`})
    }
    return res.json({authors: getSpecificAuthors});
})

/* 
Route           /publications
Description     to get all publications
Access          PUBLIC
Parameters      NONE
Method          GET
*/
shapeAI.get("/publications", (req, res)=> {
    return res.json({publications: database.publications});
})

/* 
Route           /book/new
Description     add new book
Access          PUBLIC
Parameters      NONE
Method          POST
*/
shapeAI.post("/book/new", async (req, res)=> {
    // request body
    const { newBook } = req.body;
    BookModel.create(newBook);

    // database.books.push(newBook);
    return res.json({message: "book was added!"});
});
/* 
Route           /author/new
Description     add new author
Access          PUBLIC
Parameters      NONE
Method          POST
*/
shapeAI.post("/author/new", async (req, res)=> {
    const { newAuthor } = req.body;
    // database.authors.push(newAuthor);
    AuthorModel.create(newAuthor);
    return res.json({message: "author was added!"});
 });
/* 
Route           /publication/new
Description     add new publication
Access          PUBLIC
Parameters      NONE
Method          POST
*/
shapeAI.post("/publication/new", async (req, res)=> {
    const { newPublication } = req.body;
    // database.publications.push(newPublication);
    PublicationModel.create(newPublication);
    return res.json({publications: database.publications, message: "publication was added!"});
 });
/* 
Route           /book/update
Description     update title of a book
Access          PUBLIC
Parameters      isbn
Method          PUT
*/
shapeAI.put("/book/update/:isbn", (req, res)=>{    
//  foreach directly modifies the array
    database.books.forEach((book)=>{
        if(book.ISBN === req.params.isbn){
            book.title = req.body.bookTitle;
            return;
        }
    });    
    return res.json({books: database.books});
});
/* 
Route           /book/author/update/:isbn
Description     update/add new author
Access          PUBLIC
Parameters      isbn
Method          PUT
*/
shapeAI.put("/book/author/update/:isbn", (req, res)=> {
    // update the book database
    database.books.forEach((book)=>{
        if(book.ISBN === req.params.isbn)
            return book.authors.push(req.body.newAuthor);
    });
    // update the author database
    database.authors.forEach((author)=>{
        if(author.id === req.body.newAuthor) 
            return author.books.push(req.params.isbn);
    });

    return res.json({
        books: database.books,
        authors: database.authors,
        message: "New author was added 🚀",
    });
});
/* 
Route           /author/update
Description     update author using id
Access          PUBLIC
Parameters      id
Method          PUT
*/
shapeAI.put("/author/update/:id", (req, res)=> {
    database.authors.forEach((author)=>{
        if(author.id === parseInt(req.params.id)){
            author.id = parseInt(req.id.authorId);
            return;
        }
    });
    return res.json({authors: database.authors});
});
/* 
Route           /publication/update/book
Description     Update/add new book to a publication
Access          PUBLIC
Parameters      isbn
Method          PUT
*/
shapeAI.put("/publication/update/book/:isbn", (req, res)=> {
    // update the publiation database
    database.publications.forEach((publication)=>{
        if(publication.id === req.body.pubId){
           return publication.books.push(req.params.isbn);
        }
    });
    // update the book database
    database.books.forEach((book)=> {
        if(book.ISBN === req.body.isbn){
            book.publication = req.body.pubId;
            return;
        }
    });
    return res.json({
        books: database.books,
        publications: database.publications, 
        message: "Successfully Updated Publications",
    });
});
/* 
Route           /book/delete
Description     delete a book
Access          PUBLIC
Parameters      isbn
Method          DELETE
*/
shapeAI.delete("/book/delete/:isbn", (req, res)=> {
    const updatedBookDatabase = database.books.filter((book)=> book.ISBN !== req.params.isbn);
    
    database.books = updatedBookDatabase;
    return res.json({books: database.books});
});
/* 
Route           /book/delete/author
Description     delete an author
Access          PUBLIC
Parameters      isbn, author id
Method          DELETE
*/
shapeAI.delete("/book/delete/author/:isbn/:authorId", (req, res)=> {
    // update the book database
    database.books.forEach((book)=>{
        if (book.ISBN === req.params.isbn) {
            const newAuthorList = book.authors.filter((author)=> author !== parseInt(req.params.authorId)); 
            book.authors = newAuthorList;
            return;
        }
    });
    // update the author database
    database.authors.forEach((author)=> {
        if (author.id === parseInt(req.params.authorId)) {
            const newBooksList = author.books.filter((book)=> book !== req.params.isbn);
            author.books = newBooksList;
            return;
        }
    });
    return res.json({
        message: "Author was deleted!!😭",
        book: database.books,
        author: database.authors,
        message: "Author was deleted!!😭"});
});
/* 
Route           /publication/delete/book
Description     delete a book from publication
Access          PUBLIC
Parameters      isbn , publication Id
Method          DELETE
*/
shapeAI.delete("/publication/delete/book/:isbn/:pubId", (req, res)=> {
    // update publication database
    database.publications.forEach((publication)=>{
        if(publication.id === parseInt(req.param.pubId)){
            const newBookList = publication.books.filter((book)=> book !== req.params.isbn);
            publication.books = newBookList;
            return;
        }
    });
    // update book database
    database.books.forEach((book)=> {
        if(book.ISBN === req.params.isbn){
            book.publication = 0; // no publication available
            return;
        }
    });
    return res.json({books: database.books, publications: database.publications});
});


shapeAI.listen(3000, ()=> console.log("Server is running."))
