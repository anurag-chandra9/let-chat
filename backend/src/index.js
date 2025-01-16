import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from "cors";
import path from 'path';

import {app,server} from './lib/socket.js';
dotenv.config();


import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './lib/db.js';

const PORT=process.env.PORT || 3001;
const __dirname = path.resolve();
app.use(express.json({limit: '50mb'}));
app.use(cookieParser());

app.use(cors({
 origin:"http://localhost:5173",
 credentials:true
}
));
app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);
// app.use(express.json({ limit: "10mb" }));

// // For URL-encoded payloads
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));
if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, '../frontend/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend',"dist","index.html"));
        })
}

server.listen(PORT, () => {
    console.log('Server is running on port:'+PORT);
    connectDB();
});