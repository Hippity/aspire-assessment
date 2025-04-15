import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Button,
} from "@mui/material";
import { bookAPI } from "../services/api";
import { useSnackbar } from "../contexts/SnackbarContext";
import { useAuth } from "../contexts/AuthContext";
import BookDialog from "./BookDialog";
import BookDetailsDialog from "./BookDetailsDialog";

const MainBody = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openBookDetails, setOpenBookDetails] = useState(false);
  const [selectedBook, setSelectedBook] = useState();

  const { showSnackbar } = useSnackbar();
  const { user, loading } = useAuth();

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleViewBook = (book) => {
    setSelectedBook(book);
    setOpenBookDetails(true);
  };
  

  const fetchBooks = () => {
    setLoadingBooks(true);
    bookAPI
      .getAll()
      .then((res) => {
        setBooks(res.data.data || []);
        setLoadingBooks(false);
      })
      .catch((err) => {
        showSnackbar(`Failed to Fetch Books`);
        setLoadingBooks(false);
      });
  };

  const filteredBooks = books.filter((book) =>
    `${book.title} ${book.author}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (bookData) => {
    const isEditing = !!selectedBook;

    const action = isEditing
      ? bookAPI.update(selectedBook.id, bookData)
      : bookAPI.create(bookData);

    action
      .then(() => {
        fetchBooks();
        setOpenDialog(false);
        setSelectedBook(null); // reset after editing
        showSnackbar(`Book ${isEditing ? "Updated" : "Created"}`, "success");
      })
      .catch((err) =>
        showSnackbar(
          `Failed to ${isEditing ? "Update" : "Create"} Book`,
          "error"
        )
      );
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <TextField
        fullWidth
        label="Search by title or author"
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 4 }}
      />

      {user && (
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button variant="contained" onClick={() => setOpenDialog(true)}>
            Add Book
          </Button>
        </Box>
      )}

      {loadingBooks ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : filteredBooks.length === 0 ? (
        <Typography variant="h6" align="center">
          No books found.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredBooks.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book.id}>
              <Card onClick={() => handleViewBook(book)} sx={{ cursor: "pointer" }}>
                <CardContent>
                  <Typography variant="h6">{book.title}</Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    {book.author}
                  </Typography>
                  {book.published_date && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Published: {book.published_date}
                    </Typography>
                  )}
                  {book.pages && (
                    <Typography variant="body2">Pages: {book.pages}</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <BookDetailsDialog
        open={openBookDetails}
        onClose={() => setOpenBookDetails(false)}
        book={selectedBook}
        onEdit={(book) => {
          setOpenDialog(true);
          setSelectedBook(book);
          setOpenBookDetails(false);
        }}
        onDelete={(id) => {
          bookAPI
            .delete(id)
            .then(() => {
              fetchBooks();
              setOpenBookDetails(false);
              showSnackbar(`Book deleted`)
            })
            .catch((err) => showSnackbar(`Failed to Delete Book`));
        }}
      />

      <BookDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
        initialData={selectedBook}
      />
    </Container>
  );
};

export default MainBody;
