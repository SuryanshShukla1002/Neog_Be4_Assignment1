import express from "express";
const app = express();
import connectDb from "./db/db.connect.js";
import Book from './models/book.models.js';

app.use(express.json());
connectDb();

const newBook = [
    {
        title: "Lean In",
        author: "Sheryl Sandberg",
        publishedYear: 2012,
        genre: ["Non-fiction", "Business"],
        language: "English",
        country: "United States",
        rating: 4.1,
        summary: "A book about empowering women in the workplace and achieving leadership roles.",
        coverImageUrl: "https://example.com/lean_in.jpg"

    }
];

async function creatBook(newBook) {
    try {
        const book = new Book(newBook);
        const savedBook = await book.save();
        return savedBook;
    } catch (error) {
        throw error;
    }
}
app.post("/books", async (req, res) => {
    try {
        const addBook = await creatBook(req.body);
        if (addBook) {
            res.json({ message: "Successfuly added new book data", book: addBook });
        } else {
            res.status(404).json({ error: "Unabble to add book data" });
        }
    } catch (error) {
        res.status(500).json({ error: "Unabe to fetch the data" });
    }
});

//  API to get all the books in the database
async function readAllBooks() {
    try {
        const readALl = await Book.find();
        return readALl;
    } catch (error) {
        throw error;
    }
}

app.get("/books", async (req, res) => {
    try {
        const getAllBooks = await readAllBooks();
        res.status(201).json({ message: "Success get data", data: getAllBooks });
    } catch (error) {
        res.status(500).json({ error: "Unabe to fetch the data" });
    }
});

// an API to get a book's detail by its title.
async function readBookByTitle(bookTitle) {
    try {
        const readByTitle = await Book.findOne({ title: bookTitle });
        return readByTitle;
    } catch (error) {
        throw error;
    }
}

app.get("/books/directory/:title", async (req, res) => {
    try {
        const title = await readBookByTitle(req.params.title);
        if (title) {
            res.status(201).json({ message: "Success get movie with title", movie: title });
        } else {
            res.status(404).json({ error: "Unabble to get book data with title" });
        }
    } catch (error) {
        res.status(500).json({ error: "Unabe to fetch the data" });
    }
});

// API to get details of all the books by an author
async function readBookByAuthor(bookAuthor) {
    try {
        const readByAuthor = await Book.findOne({ author: bookAuthor });
        return readByAuthor;
    } catch (error) {
        throw error;
    }
}

app.get("/books/details/:author", async (req, res) => {
    try {
        const author = await readBookByAuthor(req.params.author);
        if (author) {
            res.status(201).json({ message: "Success get movie with author", movie: author });
        } else {
            res.status(404).json({ error: "Unabble to get book data with author" });
        }
    } catch (error) {
        res.status(500).json({ error: "Unabe to fetch the data" });
    }
});

// API to get all the books which are of "Business" genre.
async function readBookWithBUssiness(bookGenre) {
    try {
        const readByGenre = await Book.find({ genre: bookGenre });
        return readByGenre;
    } catch (error) {
        throw error;
    }
}
app.get("/books/genre/:genreName", async (req, res) => {
    try {
        const savedGenre = await readBookWithBUssiness(req.params.genreName);
        if (savedGenre) {
            res.status(200).json({ message: "Success get book data with Business genre", genre: savedGenre });
        } else {
            res.status(404).json({ error: "Unable to get the book genre" });
        }
    } catch (error) {
        res.status(500).json({ error: "Unabe to fetch the data" });
    }
});
// API to get all the books which was released in the year 2012.
async function readBookByreleaseYear(bookYear) {
    try {
        const readByrelease = await Book.find({ publishedYear: bookYear });
        return readByrelease;
    } catch (error) {
        throw error;
    }
}
app.get("/books/release/:bookYear", async (req, res) => {
    try {
        const year = await readBookByreleaseYear(req.params.bookYear);
        if (year) {
            res.status(200).json({ message: "Success get data with release year", releaseYear: year });
        } else {
            res.status(404).json({ error: "Unable to get the book with releaseYear" });
        }
    } catch (error) {
        res.status(500).json({ error: "Unabe to fetch the data" });
    }
});
// API to update a book's rating with the help of its id
async function updateBookWithId(bookId, dataToUpdate) {
    try {
        const updateBookId = await Book.findByIdAndUpdate(bookId, dataToUpdate, { new: true });
        return updateBookId;
    } catch (error) {
        throw error;
    }
}
app.post("/books/rating/:ratingId", async (req, res) => {
    try {
        const updateBook = await updateBookWithId(req.params.ratingId, req.body);
        if (updateBook) {
            res.status(200).json({ message: "Successfully Update the data with rating", rating: updateBook });
        } else {
            res.status(404).json({ error: "Unable to update the data" });
        }
    } catch (error) {
        res.status(500).json({ error: "Unabe to fetch the data" });
    }
});

// API to update a book's rating with the help of its title
async function updateBookWithTitle(bookTitle, dataUpdate) {
    try {
        const updateTitle = await Book.findOneAndUpdate({ title: bookTitle }, dataUpdate, { new: true });
        return updateTitle;
    } catch (error) {
        throw error;
    }
}
app.post("/books/title/:bookTitle", async (req, res) => {
    try {
        const title = await updateBookWithTitle(req.params.bookTitle, req.body);
        if (title) {
            res.status(200).json({ message: "Success update data ", title: title });
        } else {
            res.status(404).json({ error: "Unable to update the data" });
        }
    } catch (error) {
        res.status(500).json({ error: "Unabe to fetch the data" });
    }
});
// API to delete a book with the help of a book id,
async function deleteBookWithId(bookIddelete) {
    try {
        const deleteBokk = await Book.findByIdAndDelete(bookIddelete);
        return deleteBokk;
    } catch (error) {
        throw error;
    }
}
app.delete("/books/handle/:bookIddelete", async (req, res) => {
    try {
        const deleteId = await deleteBookWithId(req.params.bookIddelete);
        res.status(201).json({ message: "Successfully deleted data with Id", book: deleteId });
    } catch (error) {
        res.status(500).json({ error: "Unabe to fetch the data" });
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log("Server is listening to port", PORT);
});
