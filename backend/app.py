from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from auth.auth_helper import require_auth
from database.database import db
from models.books import Book


app = Flask(__name__, static_folder='static')
CORS(app)  # Enable CORS for all routes


# Initialise db
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///app.db')
db.init_app(app)

# Create tables in the DB
with app.app_context():
    from models.books import Book

    if app.config["SQLALCHEMY_DATABASE_URI"]:
        db.create_all()

@app.route('/api/test-auth', methods=['GET'])
@require_auth
def test_auth(user_info):
    """
    Test if auth is working
    """
    try:
        return jsonify({
            'success': True,
            'data': {
                'user_info': user_info
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# 🟢 Public: Get all books
@app.route('/api/books', methods=['GET'])
def get_books():
    try:
        books = Book.query.order_by(Book.created_at.desc()).all()
        result = [book.to_dict() for book in books]
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# 🟢 Public: Get a book by ID
@app.route('/api/books/<int:book_id>', methods=['GET'])
def get_book_by_id(book_id):
    try:
        book = Book.query.get(book_id)
        if not book:
            return jsonify({'success': False, 'error': 'Book not found'}), 404
        return jsonify({'success': True, 'data': book.to_dict()})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# 🔒 Protected: Create a book
@app.route('/api/books', methods=['POST'])
@require_auth
def create_book(user_info):
    try:
        data = request.get_json()
        required_fields = ['title', 'author']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'success': False, 'error': f'Field "{field}" is required'}), 400

        book = Book(
            title=data['title'],
            author=data['author'],
            published_date=data.get('published_date'),
            isbn=data.get('isbn'),
            pages=data.get('pages'),
            description=data.get('description')
        )
        db.session.add(book)
        db.session.commit()
        return jsonify({'success': True, 'data': book.to_dict(), 'message': 'Book added successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

# 🔒 Protected: Update a book
@app.route('/api/books/<int:book_id>', methods=['PUT'])
@require_auth
def update_book(book_id, user_info):
    try:
        data = request.get_json()
        book = Book.query.get(book_id)
        if not book:
            return jsonify({'success': False, 'error': 'Book not found'}), 404

        for field in ['title', 'author', 'published_date', 'isbn', 'pages', 'description']:
            if field in data:
                setattr(book, field, data[field])

        db.session.commit()
        return jsonify({'success': True, 'data': book.to_dict(), 'message': 'Book updated successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

# 🔒 Protected: Delete a book
@app.route('/api/books/<int:book_id>', methods=['DELETE'])
@require_auth
def delete_book(book_id, user_info):
    try:
        book = Book.query.get(book_id)
        if not book:
            return jsonify({'success': False, 'error': 'Book not found'}), 404

        db.session.delete(book)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Book deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500
    

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    """
    Serve the React application for all non-API routes
    """
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@app.route('/health')
def health_check():
    """
    Health check endpoint for Azure
    """
    return jsonify({
        'status': 'healthy',
        'service': 'RSA-455'
    })

if __name__ == '__main__':
    # Get port from environment variable (for Azure) or use default 5000
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port)