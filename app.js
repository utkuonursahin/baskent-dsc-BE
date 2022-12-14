const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser')
const compression = require('compression')
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorController = require('./controllers/errorController');

const announcementRouter = require('./routes/announcementRoutes');
const executiveRouter = require('./routes/executiveRoutes');
const userRouter = require('./routes/userRoutes');
const inviteKeyRouter = require('./routes/inviteKeyRoutes');

const limiter = rateLimit({
  max: 100, // 100req/hr
  windowMs: 60 * 60 * 1000,
  message: 'Mevcut IP adresinden çok fazla istekte bulundunuz, lütfen bir saat sonra tekrar deneyin.'
});

const app = express();
// Global Middlewares

//Implement CORS
app.use(cors({credentials: true, origin: process.env.CLIENT_URL}))
//Serving static files
app.use('/static', express.static(path.join(__dirname, 'public')));
//Set security HTTP headers
app.use(helmet());
//Limit requests from same IP
app.use('/api', limiter);
//Body parser, reading data from body into req.body
app.use(express.json({limit: '10kb'}));
app.use(cookieParser())
//Data sanitization against NoSQL query injection
app.use(mongoSanitize());
//Data sanitization against XSS
app.use(xss());
//Prevent parameter pollution
app.use(hpp({whitelist: ['name']}));
//Compress text responses
app.use(compression())
//Routes
app.use('/api/v1/announcements', announcementRouter);
app.use('/api/v1/executives', executiveRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/inviteKeys', inviteKeyRouter);
app.all('*', (req, res, next) => next(new AppError(`Bu sunucuda ${req.originalUrl} adresi bulunamadı!`, 404)))
//Global error handling
app.use(globalErrorController);

module.exports = app;