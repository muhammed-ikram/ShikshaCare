require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ShikshaCare")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));
const passport = require("passport");
require("./config/passport");
const authRoutes = require('./routes/authRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
// const userRoutes = require('./routes/userRoutes');
// const postRoutes = require('./routes/postRoutes');
// const commentRoutes = require('./routes/commentRoutes');

const app = express();
// app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/api/student", require('./routes/studentRoutes'));
app.use("/api/user", require('./routes/userRoutes'));
app.use("/api/career", require('./routes/careerRoutes'));
app.use("/api/projects", require('./routes/projectRoutes'));
app.use("/api/tasks", require('./routes/taskRoutes'));
app.use("/api/roadmap", require('./routes/roadmapRoutes'));
app.use("/api/chat", require('./routes/chatbotRoutes'));
app.use("/api/quiz", require('./routes/quizRoutes'));
app.use("/api/assessment", assessmentRoutes);
app.use('/uploads', express.static('uploads'));



app.listen(3000, () => {
  console.log("Backend running on port 3000");
});