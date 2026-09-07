# 🚀 Project Run Commands Guide

## Project Analysis Summary

This is a **House Price Prediction System** with 4 main components:
1. **MySQL Database** (Port 3306)
2. **Python ML Microservice** (FastAPI - Port 8001)
3. **Java Spring Boot Backend** (Port 8080)
4. **React Frontend** (Port 3000)

---

## 📋 Prerequisites

- ✅ MySQL Server installed and running
- ✅ Python 3.x installed
- ✅ Java JDK 17 installed
- ✅ Node.js and npm installed
- ✅ Maven installed

---

## 🛠️ Setup & Run Commands (Run in Order)

### **Step 1: Setup MySQL Database**

**Open MySQL Command Line or MySQL Workbench:**

```sql
SOURCE schema.sql;
```

**Or manually run:**
```sql
CREATE DATABASE IF NOT EXISTS house_price_db;
USE house_price_db;
-- Then copy and paste all SQL from schema.sql
```

**Note:** Update password in `backend/src/main/resources/application.yml` if your MySQL password is different:
- Current password in config: `Likhith@2004`
- Default password in README: `12345`

---

### **Step 2: Start Python ML Microservice** (Terminal 1)

```powershell
cd ml-service
pip install -r requirements.txt
python app.py
```

**✅ Expected Output:** `Uvicorn running on http://0.0.0.0:8001`

**Note:** If models don't exist, you may need to train first:
```powershell
python train.py
```

---

### **Step 3: Start Java Spring Boot Backend** (Terminal 2)

**⚠️ CRITICAL:** Backend MUST be running before login attempts!

```powershell
# Set Java Home (if not already set)
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:Path = "$env:JAVA_HOME\bin;" + $env:Path

# Verify Java version
java -version

# Navigate to backend and run
cd backend
mvn spring-boot:run
```

**✅ Expected Output:** `Started HousePriceApplication in X seconds`

**Alternative (if Maven wrapper exists):**
```powershell
cd backend
.\mvnw spring-boot:run
```

---

### **Step 4: Start React Frontend** (Terminal 3)

```powershell
cd frontend
npm install
npm start
```

**✅ Browser automatically opens at:** `http://localhost:3000`

**Alternative:**
```powershell
cd frontend
npm install
npm run dev
```

---

## 🔐 Login Credentials

### **Admin Portal**
- **URL:** `http://localhost:3000/admin`
- **Username:** `admin`
- **Password:** `admin123`

### **User Portal**
1. Go to `/register` to create an account
2. Use username OR email + password to login
3. Access dashboard at `/user/dashboard`

---

## 🐛 Troubleshooting

### **"Network Error" on Login**
- ✅ Check Terminal 2 - Backend must show `Started HousePriceApplication`
- ✅ Wait 30-60 seconds after backend starts
- ✅ Verify backend is running on `http://localhost:8080`

### **Python ML Service Not Starting**
- ✅ Check if port 8001 is available
- ✅ Verify all dependencies installed: `pip list`
- ✅ Check if model files exist in `ml-service/models/`
- ✅ Run `python train.py` to generate models if missing

### **Backend Not Starting**
- ✅ Verify Java 17 is installed: `java -version`
- ✅ Check MySQL is running and accessible
- ✅ Verify database credentials in `application.yml`
- ✅ Check if port 8080 is available

### **Frontend Not Starting**
- ✅ Verify Node.js is installed: `node -v`
- ✅ Delete `node_modules` and `package-lock.json`, then `npm install` again
- ✅ Check if port 3000 is available

---

## 📊 Service URLs

| Service | URL | Status Check |
|---------|-----|--------------|
| Frontend | http://localhost:3000 | Browser |
| Backend API | http://localhost:8080 | http://localhost:8080/api/health |
| ML Service | http://localhost:8001 | http://localhost:8001/ |
| MySQL | localhost:3306 | MySQL Client |

---

## 🔄 Quick Restart Commands

**Stop all services:** Press `Ctrl+C` in each terminal

**Restart in order:**
1. ML Service (Terminal 1)
2. Backend (Terminal 2)
3. Frontend (Terminal 3)

---

## 📝 Additional Setup (Optional)

### **Generate Training Data**
```powershell
cd ml-service
python generate_data.py
```

### **Seed Database with Sample Data**
```powershell
cd ml-service
python seed_database.py
```

### **Train ML Model**
```powershell
cd ml-service
python train.py
```

---

## ✅ Verification Checklist

- [ ] MySQL database `house_price_db` created
- [ ] Python ML service running on port 8001
- [ ] Java backend running on port 8080
- [ ] React frontend running on port 3000
- [ ] Can access http://localhost:3000
- [ ] Can login with admin credentials
- [ ] Can register new user account

---

**🎉 Once all services are running, access the application at http://localhost:3000**
