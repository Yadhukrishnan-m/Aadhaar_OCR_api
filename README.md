# Aadhaar OCR Web App (MERN Stack)

This project is a MERN stack web application that performs Optical Character Recognition (OCR) on images of Aadhaar cards. Users can upload images of both the front and back sides of an Aadhaar card, which are processed by the backend OCR API. The extracted information (such as name, gender, DOB, Aadhaar number) is then displayed on the frontend in a structured format.

## 🛠️ Tech Stack
- **Frontend**: ReactJS
- **Backend**: Node.js + Express.js
- **OCR Library**: Tesseract.js
- **Deployment**: Any platform (Render, Vercel, Netlify, etc.)

## 🚀 Features
- Upload front and back images of Aadhaar card
- View uploaded images on the same page
- Trigger OCR with a button click
- Display extracted information clearly
- Basic validation and error handling

## 🧪 Environment Variables
Create a `.env` file in both the frontend and backend:

**Frontend `.env`:**
```
VITE_SERVER_BASEURL=http://localhost:5000
```

**Backend `.env`:**
```
FRONTEND_URI=http://localhost:3000
```

> ***Note: The file `/src/services/vision-key.json` is required for the OCR functionality.***

## 🏃‍♂️ Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/aadhaar-ocr-app.git
cd aadhaar-ocr-app
```

### 2. Setup Backend
```bash
cd backend
npm install
npm start
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm start
```

## 📦 Deployment
You can deploy the frontend on **Vercel/Netlify** and backend on **Render/Heroku**.  
Make sure to update your `.env` files with the deployed URLs.

## 📸 Sample UI References
- Upload Page
- Extracted Info Display

## ⚠️ Notes
- Accept only image files (JPG, PNG).
- Secure inputs and validate content types.

## 📃 License
This project is for educational/demo purposes.
