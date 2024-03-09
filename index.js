const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const signupRouter = require('./router/signup');
const loginRouter = require('./router/login');
const postsRouter = require('./router/post');
// const multer = require('multer');
const fileUpload = require("express-fileupload");
const cloudinary = require('cloudinary').v2;
const path = require("path");
const CORS = require('cors');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const corsOptions = {
  origin: ['http://localhost:3000', 'https://65ebf585aaf1ae6165f268df--aquamarine-kulfi-a210f7.netlify.app/',],
  credentials: true, // Allow cookies
};

// middleware
app.use(CORS(corsOptions));
app.use("/", express.static(path.join(__dirname, "public")));
app.use(
  fileUpload({
    useTempFiles: true,
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);



// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true }).then(() => {
    console.log('Connected to MongoDB');
}
).catch((error) => {
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
