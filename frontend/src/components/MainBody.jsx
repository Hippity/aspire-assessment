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
} from "@mui/material";
import { bookAPI } from "../services/api";

const MainBody = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookAPI
      .getAll()
      .then((res) => {
        setBooks(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch books", err);
        setLoading(false);
      });
  }, []);

  const filteredBooks = books.filter((book) =>
    `${book.title} ${book.author}`.toLowerCase().includes(search.toLowerCase())
  );

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

      {loading ? (
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
              <Card>
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
                    <Typography variant="body2">
                      Pages: {book.pages}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MainBody;
