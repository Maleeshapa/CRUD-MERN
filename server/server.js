// --------------------------------------------------Basic--------------------------------------------------

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const uri = process.env.MONGO_URI;

mongoose.connect(uri)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log('MongoDB connection error:', err));

const PORT = 8081;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});





// ---------------------------------------------------Read all db---------------------------------------------------

//-------------------------------

const studentSchema = new mongoose.Schema({
    name: String,
    email: String
});


const Student = mongoose.model('Student', studentSchema);

//------------------------------


app.get('/', async (req, res) => {
    try {
        const students = await Student.find({});
        res.json(students);
    } catch (err) {
        console.error('Error fetching students:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// ---------------------------------------------------Create-----------------------------------------------


app.post('/student', async (req, res) => {
    const { name, email } = req.body;
    try {
        const newStudent = new Student({ name, email });
        const result = await newStudent.save();
        console.log("Record inserted successfully");
        res.json({ success: true, result: result });
    } catch (err) {
        console.error('Error inserting student:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});


// -------------------------------------------------------Read by id--------------------------------------------

app.get('/read/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (err) {
        console.error('Error fetching student by id:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// -------------------------------------------------------Update by id--------------------------------------------


app.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
        const student = await Student.findByIdAndUpdate(id, { name, email }, { new: true });
        console.log('Updated Student:', student);
        res.json({ success: true, message: 'Record updated successfully', student });
    } catch (err) {
        console.error('Error updating student:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});


// -----------------------------------------------------------Delete--------------------------------------------


app.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Student.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: 'Student not found' });
        }
        console.log('Deleted Student:', result);
        res.json({ success: true, message: 'Record deleted successfully' });
    } catch (err) {
        console.error('Error deleting student:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// ------------------------------------------------------- Read by id(search)--------------------------------------------

app.get('/view/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (err) {
        console.error('Error fetching student by email:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//--------------------------------------------------------------send email

import nodemailer from 'nodemailer';


// Create a transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Route to handle sending email
app.post('/send-email', (req, res) => {
    const { name, nic } = req.body;

    // Email content
    const mailOptions = {
        from: 'SayCheese Booking System',
        to: 'maleeshapathirana1@gmail.com',
        subject: 'New Form Submission',
        text: `Name: ${name}\nNIC: ${nic}`
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            res.send('Email sent successfully');
        }
    });
});
