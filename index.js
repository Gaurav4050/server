const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const signupRouter = require('./router/signup');
const loginRouter = require('./router/login');
const postsRouter = require('./router/post');
const fileUpload = require("express-fileupload");
const cloudinary = require('cloudinary').v2;
const path = require("path");
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// CORS configuration
const corsOptions = {
    // origin: [
    //   // 'http://localhost:3000',
    //   //  'https://65ebf585aaf1ae6165f268df--aquamarine-kulfi-a210f7.netlify.app'
    //   "http://localhost:3000",
    //   "http://192.168.43.100:3000",
    //   /google\.com$/,
    //   /localhost/,
    //   "https://65ebf585aaf1ae6165f268df--aquamarine-kulfi-a210f7.netlify.app",
    //   /65ebf585aaf1ae6165f268df--aquamarine-kulfi-a210f7.netlify.app/,
    // ],
    origin: true,
    credentials: true, // Allow cookies
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Set-Cookie",
    "x-app-type",
    "x-hashed-id",
    "x-request-id",
    "x-request-token",
    "x-fingerprint-id",
  ],
};

app.use(cors(corsOptions));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error(error);
        console.log('Error connecting to MongoDB');
    });

// Apply rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Parse JSON bodies
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// Serve static files
app.use("/", express.static(path.join(__dirname, "public")));

// File upload middleware
app.use(
    fileUpload({
        useTempFiles: true,
        limits: { fileSize: 50 * 1024 * 1024 },
    })
);

// Routes
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/posts', postsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.get("/", (req, res) => {
    res.json("Server is running");
});

// Upload endpoint
app.post("/upload", async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).json({
            msg: "No files were uploaded. Try uploading an image",
        });
        return;
    }
    console.log(req.files);
    const uploadFile = req.files.uploadFile;
    const result = await cloudinary.uploader.upload(uploadFile.tempFilePath, {
        public_id: uploadFile.name,
        resource_type: "auto",
        folder: "uploaded",
        use_filename: true,
        unique_filename: false,
    });
    return res.json({ success: true, message: 'Image uploaded successfully', result });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
