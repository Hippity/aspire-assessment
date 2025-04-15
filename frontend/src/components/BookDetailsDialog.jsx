import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Stack,
  Box,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";

const BookDetailsDialog = ({ open, onClose, book, onEdit, onDelete }) => {
  const { user, loading } = useAuth();

  if (!book) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle style={{ fontWeight: "bold" }}>Book Details</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={1}>
          <Box display={"flex"} gap={1} alignItems={"center"}>
            <Typography variant="h5">{book.title}</Typography>
            <Typography variant="subtitle1" color="text.secondary">
              written by {book.author}
            </Typography>
          </Box>

          {book.published_date && (
            <Typography>
              <b>Published:</b> {book.published_date}
            </Typography>
          )}
          {book.isbn && (
            <Typography>
              {" "}
              <b>ISBN</b>
              {book.isbn}
            </Typography>
          )}
          {book.pages && (
            <Typography>
              {" "}
              <b>Pages:</b> {book.pages}
            </Typography>
          )}
          {book.description && (
            <Box>
              <Typography variant="subtitle1">
                <b>Description:</b>
              </Typography>
              <Typography variant="body1">{book.description}</Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>

        {user && (
          <>
            <Button onClick={() => onEdit(book)} variant="outlined">
              Edit
            </Button>
            <Button
              onClick={() => onDelete(book.id)}
              variant="outlined"
              color="error"
            >
              Delete
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default BookDetailsDialog;
