from database.database import db
import datetime

class Book(db.Model):
    __tablename__ = 'books'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    published_date = db.Column(db.Date, nullable=True)
    isbn = db.Column(db.String(13), unique=True, nullable=True)
    pages = db.Column(db.Integer, nullable=True)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.now())
    
    def to_dict(self):
        "Convert model to dictionary"
        return {
            "id": self.id,
            "title": self.title,
            "author": self.author,
            "published_date": self.published_date.isoformat() if self.published_date else None,
            "isbn": self.isbn,
            "pages": self.pages,
            "description": self.description,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
