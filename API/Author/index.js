const Router = require("express").Router();

const AuthorModel = require("../../database/author");
/* 
Route           /author
Description     get all authors  
Access          PUBLIC
Parameters      NONE
Method          GET
*/
Router.get("/", async (req, res)=> {
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
Router.get("/aut/:id", (req,res)=> {
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
Router.get("/:isbn", (req, res)=> {
    const getSpecificAuthors= database.authors.filter((author)=>author.books.includes(req.params.isbn));
    if(getSpecificAuthors.length === 0){
        return res.json({error: `No Author found for the book of ${req.params.isbn}`})
    }
    return res.json({authors: getSpecificAuthors});
})

/* 
Route           /author/new
Description     add new author
Access          PUBLIC
Parameters      NONE
Method          POST
*/
Router.post("/new", async (req, res)=> {
    const { newAuthor } = req.body;
    // database.authors.push(newAuthor);
    AuthorModel.create(newAuthor);
    return res.json({message: "author was added!"});
 });

 /* 
Route           /author/update
Description     update author using id
Access          PUBLIC
Parameters      id
Method          PUT
*/
Router.put("/update/:id", (req, res)=> {
    database.authors.forEach((author)=>{
        if(author.id === parseInt(req.params.id)){
            author.id = parseInt(req.id.authorId);
            return;
        }
    });
    return res.json({authors: database.authors});
});

module.exports = Router;