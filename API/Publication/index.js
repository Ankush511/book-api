const Router = require("express").Router();

const PublicationModel = require("../../database/publication");

/* 
Route           /publications
Description     to get all publications
Access          PUBLIC
Parameters      NONE
Method          GET
*/
Router.get("/", (req, res)=> {
    return res.json({publications: database.publications});
})

/* 
Route           /publication/new
Description     add new publication
Access          PUBLIC
Parameters      NONE
Method          POST
*/
Router.post("/new", async (req, res)=> {
    const { newPublication } = req.body;
    // database.publications.push(newPublication);
    PublicationModel.create(newPublication);
    return res.json({publications: database.publications, message: "publication was added!"});
 });

/* 
Route           /publication/update/book
Description     Update/add new book to a publication
Access          PUBLIC
Parameters      isbn
Method          PUT
*/
Router.put("/update/book/:isbn", (req, res)=> {
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
Route           /publication/delete/book
Description     delete a book from publication
Access          PUBLIC
Parameters      isbn , publication Id
Method          DELETE
*/
Router.delete("/delete/book/:isbn/:pubId", (req, res)=> {
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

module.exports = Router;