# Vocab Tracker 📚

A production-grade full-stack web application for translating and tracking vocabulary with spaced repetition learning. Built with modern web technologies including React, TypeScript, Node.js, Express, and PostgreSQL.

![Architecture Overview](docs/architecture-diagram.png)

## 🚀 Features

- **Real-time Translation**: Translate English words to multiple languages (Hebrew, Spanish, French, German, Italian, Japanese, Korean, Chinese, Arabic, Russian)
- **Spaced Repetition Learning**: Intelligent review scheduling based on learning algorithms
- **Translation History**: Track all your translated words with timestamps and review statistics
- **Multiple Language Support**: Switch between different target languages
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Production Ready**: Comprehensive error handling, security, and validation

## 🏗️ Architecture

### System Components

```
Frontend (React + TypeScript) ←→ Backend (Node.js + Express) ←→ Database (PostgreSQL)
                                           ↓
                                  Translation Service
                                  (Google Translate API)
```

### Key Technologies

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for styling
- Axios for API communication
- Custom hooks for state management
- Lucide React for icons

**Backend:**
- Node.js with Express 5.x
- PostgreSQL with Sequelize ORM
- Express-validator for input validation
- Helmet for security headers
- Rate limiting and CORS protection

**Database:**
- PostgreSQL with optimized indexes
- UUID primary keys
- Timestamp tracking
- Spaced repetition metadata

## 📊 Database Schema

```sql
CREATE TABLE translations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  english_word      VARCHAR(255) NOT NULL,
  translated_word   VARCHAR(255) NOT NULL,
  target_language   VARCHAR(10) NOT NULL DEFAULT 'he',
  confidence        FLOAT,
  review_count      INTEGER DEFAULT 0,
  last_reviewed     TIMESTAMP,
  next_review       TIMESTAMP,
  difficulty_level  INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  created_at        TIMESTAMP DEFAULT NOW(),
  updated_at        TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_translations_english_word ON translations(english_word);
CREATE INDEX idx_translations_target_language ON translations(target_language);
CREATE INDEX idx_translations_next_review ON translations(next_review);
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 16+ and npm
- PostgreSQL 12+
- Git

### 1. Clone Repository

```bash
git clone <repository-url>
cd vocab-tracker
```

### 2. Backend Setup

```bash
cd backend
npm install

# Copy environment file and configure
cp .env.example .env
# Edit .env with your database credentials and API keys
```

**Environment Variables:**
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vocab_tracker
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-super-secret-jwt-key
GOOGLE_TRANSLATE_API_KEY=your-google-translate-api-key
CORS_ORIGIN=http://localhost:3000
```

### 3. Database Setup

```bash
# Create PostgreSQL database
createdb vocab_tracker

# The application will automatically create tables on first run
```

### 4. Frontend Setup

```bash
cd ../frontend
npm install

# Copy environment file
cp .env.example .env
```

**Frontend Environment:**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Production Mode

```bash
# Build frontend
cd frontend
npm run build

# Start backend
cd ../backend
npm start
```

## 📡 API Endpoints

### Translation Endpoints

| Method | Endpoint                    | Description                |
|--------|-----------------------------|----------------------------|
| POST   | `/api/translations/translate` | Translate and store word   |
| GET    | `/api/translations/history`   | Get translation history    |
| GET    | `/api/translations/review`    | Get words for review       |
| PUT    | `/api/translations/review/:id` | Update review statistics   |
| GET    | `/api/translations/languages` | Get supported languages    |

### Example API Usage

**Translate a word:**
```bash
curl -X POST http://localhost:5000/api/translations/translate \
  -H "Content-Type: application/json" \
  -d '{"word": "hello", "targetLanguage": "he"}'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "englishWord": "hello",
    "translatedWord": "שלום",
    "targetLanguage": "he",
    "reviewCount": 0,
    "isExisting": false
  }
}
```

## 🧠 Spaced Repetition Algorithm

The application implements a custom spaced repetition system:

1. **Initial Interval**: 1 day for new words
2. **Progression**: Intervals increase based on performance
3. **Difficulty Levels**: 1-5 scale affects review frequency
4. **Response Quality**: 1-5 rating adjusts next review interval

**Algorithm Logic:**
- Correct answer: Interval increases by easiness factor
- Incorrect answer: Interval resets to 1 day
- Difficulty adjusts based on response quality

## 🔒 Security Features

- **Input Validation**: Server-side validation with express-validator
- **Rate Limiting**: Prevents API abuse (30 requests/minute for translations)
- **CORS Protection**: Configurable cross-origin policies
- **SQL Injection Prevention**: Parameterized queries via Sequelize
- **Security Headers**: Helmet.js for secure HTTP headers
- **Error Handling**: Structured error responses without sensitive data

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Loading States**: User feedback during API calls
- **Error Handling**: Graceful error messages and recovery
- **Accessibility**: Semantic HTML and ARIA labels
- **Hebrew Text Support**: Proper RTL text rendering
- **Dark Mode Ready**: CSS custom properties for theming

## 📈 Performance Optimizations

- **Database Indexes**: Optimized queries for translations and reviews
- **Connection Pooling**: Efficient database connections
- **Pagination**: Large datasets handled with pagination
- **Client-side Caching**: API responses cached in React state
- **Code Splitting**: Ready for lazy loading and chunking

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📚 Project Structure

```
vocab-tracker/
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Sequelize models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Express server
│   ├── .env.example
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── App.tsx         # Main component
│   ├── .env.example
│   └── package.json
├── docs/                   # Documentation
│   └── architecture.md     # System architecture
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Translate API for translation services
- React team for the amazing framework
- PostgreSQL for reliable data storage
- Tailwind CSS for beautiful styling
- All open-source contributors

---

**Built with ❤️ for language learners worldwide**
