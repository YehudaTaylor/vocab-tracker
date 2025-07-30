# Vocab Tracker - System Architecture

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                FRONTEND                                     │
│  ┌─────────────────┐    ┌──────────────────┐    ┌──────────────────────┐  │
│  │  React App      │    │  Translation     │    │  Translation         │  │
│  │  (TypeScript)   │    │  Form Component  │    │  History Component   │  │
│  │                 │    │                  │    │                      │  │
│  │  - State Mgmt   │◄───┤  - Input Form    │    │  - History Display   │  │
│  │  - Routing      │    │  - Language      │    │  - Pagination        │  │
│  │  - UI Layout    │    │    Selection     │    │  - Filtering         │  │
│  └─────────────────┘    └──────────────────┘    └──────────────────────┘  │
│           │                        │                        │              │
│           └────────────────────────┼────────────────────────┘              │
│                                    │                                       │
│  ┌─────────────────────────────────┼─────────────────────────────────────┐ │
│  │                    API SERVICE LAYER                                   │ │
│  │  ┌──────────────────────────────┼──────────────────────────────────┐  │ │
│  │  │               Custom Hooks & Services                            │  │ │
│  │  │  - useTranslation()    - useLanguages()    - translationApi     │  │ │
│  │  │  - Error Handling      - Loading States    - HTTP Client        │  │ │
│  │  └─────────────────────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────┼─────────────────────────────────────────┘
                                      │ HTTP/REST API
                                      │ (JSON)
┌─────────────────────────────────────┼─────────────────────────────────────────┐
│                                BACKEND                                      │
│  ┌─────────────────────────────────┼─────────────────────────────────────┐   │
│  │                    EXPRESS.JS SERVER                                   │   │
│  │  ┌──────────────────────────────┼──────────────────────────────────┐  │   │
│  │  │                        MIDDLEWARE                                │  │   │
│  │  │  - CORS       - Helmet     - Rate Limiting    - Validation     │  │   │
│  │  │  - Morgan     - Error Handling                                  │  │   │
│  │  └─────────────────────────────────────────────────────────────────┘  │   │
│  │           │                                                            │   │
│  │  ┌────────┼────────────────────────────────────────────────────────┐  │   │
│  │  │      ROUTES & CONTROLLERS                                        │  │   │
│  │  │  /api/translations/                                              │  │   │
│  │  │  ├── POST /translate        (Translate & Store Word)            │  │   │
│  │  │  ├── GET  /history          (Get Translation History)           │  │   │
│  │  │  ├── GET  /review           (Get Words for Review)              │  │   │
│  │  │  ├── PUT  /review/:id       (Update Review Data)                │  │   │
│  │  │  └── GET  /languages        (Get Supported Languages)           │  │   │
│  │  └─────────────────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────┼─────────────────────────────────────┘   │
│                                    │                                       │
│  ┌─────────────────────────────────┼─────────────────────────────────────┐   │
│  │                    BUSINESS LOGIC LAYER                                │   │
│  │  ┌──────────────────┐    ┌─────────────────┐    ┌─────────────────┐   │   │
│  │  │  Translation     │    │  Spaced         │    │  Database       │   │   │
│  │  │  Service         │    │  Repetition     │    │  Models         │   │   │
│  │  │                  │    │  System         │    │                 │   │   │
│  │  │  - Google        │    │                 │    │  - Translation  │   │   │
│  │  │    Translate API │    │  - Review       │    │    Model        │   │   │
│  │  │  - Mock          │    │    Scheduling   │    │  - Sequelize    │   │   │
│  │  │    Translations  │    │  - Difficulty   │    │    ORM          │   │   │
│  │  │  - Language      │    │    Adjustment   │    │  - Validation   │   │   │
│  │  │    Detection     │    │  - Intervals    │    │  - Indexes      │   │   │
│  │  └──────────────────┘    └─────────────────┘    └─────────────────┘   │   │
│  └─────────────────────────────────┼─────────────────────────────────────┘   │
└─────────────────────────────────────┼─────────────────────────────────────────┘
                                      │ SQL Queries
                                      │ (PostgreSQL Protocol)
┌─────────────────────────────────────┼─────────────────────────────────────────┐
│                                DATABASE                                     │
│  ┌─────────────────────────────────┼─────────────────────────────────────┐   │
│  │                         POSTGRESQL DATABASE                            │   │
│  │                                                                        │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │   │
│  │  │                        TRANSLATIONS TABLE                        │  │   │
│  │  │  ┌─────────────────┬──────────────────┬─────────────────────┐   │  │   │
│  │  │  │ Column          │ Type             │ Purpose             │   │  │   │
│  │  │  ├─────────────────┼──────────────────┼─────────────────────┤   │  │   │
│  │  │  │ id              │ UUID (PK)        │ Unique identifier   │   │  │   │
│  │  │  │ englishWord     │ VARCHAR(255)     │ Original word       │   │  │   │
│  │  │  │ translatedWord  │ VARCHAR(255)     │ Translation         │   │  │   │
│  │  │  │ targetLanguage  │ VARCHAR(10)      │ Language code       │   │  │   │
│  │  │  │ confidence      │ FLOAT            │ Translation score   │   │  │   │
│  │  │  │ reviewCount     │ INTEGER          │ Times reviewed      │   │  │   │
│  │  │  │ lastReviewed    │ TIMESTAMP        │ Last review date    │   │  │   │
│  │  │  │ nextReview      │ TIMESTAMP        │ Next review date    │   │  │   │
│  │  │  │ difficultyLevel │ INTEGER (1-5)    │ Learning difficulty │   │  │   │
│  │  │  │ createdAt       │ TIMESTAMP        │ Creation time       │   │  │   │
│  │  │  │ updatedAt       │ TIMESTAMP        │ Last update time    │   │  │   │
│  │  │  └─────────────────┴──────────────────┴─────────────────────┘   │  │   │
│  │  │                                                                 │  │   │
│  │  │  Indexes:                                                       │  │   │
│  │  │  - PRIMARY KEY (id)                                             │  │   │
│  │  │  - INDEX (englishWord)                                          │  │   │
│  │  │  - INDEX (targetLanguage)                                       │  │   │
│  │  │  - INDEX (nextReview)                                           │  │   │
│  │  └─────────────────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS 4.x
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Build Tool**: Create React App
- **State Management**: React Hooks (useState, useEffect)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Database ORM**: Sequelize
- **Authentication**: JWT (ready for future implementation)
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Morgan

### Database
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Connection Pooling**: Built-in Sequelize pooling
- **Migrations**: Sequelize Auto-sync (development)

### External Services
- **Translation API**: Google Translate API (with mock fallback)
- **Deployment**: Ready for Docker containerization

## Data Flow

### Translation Workflow
1. **User Input**: User enters English word and selects target language
2. **Frontend Validation**: Client-side validation of input
3. **API Request**: POST to `/api/translations/translate`
4. **Backend Processing**:
   - Server-side validation
   - Check if translation exists in database
   - If new: Call translation service (Google Translate API or mock)
   - Calculate spaced repetition schedule
   - Store in database
5. **Response**: Return translation data to frontend
6. **UI Update**: Display translation and update history

### Spaced Repetition System
1. **Initial Schedule**: New words get first review in 1 day
2. **Review Calculation**: Based on difficulty level and correctness
3. **Difficulty Adjustment**: User response quality affects next interval
4. **Review Queue**: Algorithm selects words due for review

## Security Features

### Backend Security
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing control
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Server-side validation with express-validator
- **Error Handling**: Structured error responses
- **SQL Injection Prevention**: Sequelize ORM parameterized queries

### Frontend Security
- **Environment Variables**: API URLs configurable
- **Input Sanitization**: Client-side validation
- **Error Boundaries**: Graceful error handling
- **HTTPS Ready**: Secure communication protocols

## Scalability Considerations

### Database
- **Indexing**: Optimized indexes for common queries
- **Connection Pooling**: Efficient database connections
- **Query Optimization**: Pagination and filtering

### API
- **Rate Limiting**: Protects against abuse
- **Caching Ready**: Response caching can be added
- **Stateless Design**: Horizontal scaling friendly

### Frontend
- **Component-Based**: Modular and reusable components
- **Lazy Loading**: Code splitting ready
- **Progressive Enhancement**: Works without JavaScript

## Future Enhancements

1. **User Authentication**: JWT-based user system
2. **Advanced Reviews**: Multiple review modes and difficulty levels
3. **Analytics**: Learning progress tracking and statistics
4. **Offline Support**: PWA with service workers
5. **Mobile App**: React Native implementation
6. **Gamification**: Points, streaks, and achievements
7. **Social Features**: Shared vocabulary lists
8. **API Expansion**: Support for more translation services