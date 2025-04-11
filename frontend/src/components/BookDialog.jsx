import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from "@mui/material";

const BookDialog = ({ open, onClose, onSave, initialData }) => {
  const [form, setForm] = useState({
    title: "",
    author: "",
    published_date: "",
    isbn: "",
    pages: "",
    description: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({ ...initialData });
    } else {
      setForm({
        title: "",
        author: "",
        published_date: "",
        isbn: "",
        pages: "",
        description: "",
      });
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData ? "Edit Book" : "Add New Book"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Title"
            name="title"
            fullWidth
            value={form.title}
            onChange={handleChange}
          />
          <TextField
            label="Author"
            name="author"
            fullWidth
            value={form.author}
            onChange={handleChange}
          />
          <TextField
            label="Published Date"
            name="published_date"
            type="date"
            fullWidth
            value={form.published_date}
            onChange={handleChange}
          />
          <TextField
            label="ISBN"
            name="isbn"
            fullWidth
            value={form.isbn}
            onChange={handleChange}
          />
          <TextField
            label="Pages"
            name="pages"
            type="number"
            fullWidth
            value={form.pages}
            onChange={handleChange}
          />
          <TextField
            label="Description"
            name="description"
            multiline
            rows={3}
            fullWidth
            value={form.description}
            onChange={handleChange}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          {initialData ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookDialog;
