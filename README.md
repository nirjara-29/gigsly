# AI-Powered Freelancing Marketplace with Escrow System

## 📌 Overview
This project is a **freelancing marketplace platform** where users can post real-world problems, lock payment securely using an **escrow system**, and receive AI-assisted evaluation of submitted solutions.  
The platform ensures **fair payment, transparency, and quality assurance** using automation and AI-based scoring.

---

## 🚀 Key Features

### 👤 User (Problem Poster)
- Post a problem with:
  - Detailed problem statement
  - Budget
  - Submission deadline
- Payment is **locked in escrow** at the time of posting
- View submitted solutions after AI validation
- Chat with freelancers
- Manually release payment once satisfied
- Automatic refund if **no solutions are submitted before deadline**

---

### 🤖 AI-Assisted Problem Breakdown
- AI converts the problem statement into a **checklist of requirements**
- This checklist is used to:
  - Guide freelancers
  - Evaluate solution completeness
  - Assign scores to submissions

---

### 👨‍💻 Freelancer
- Browse open problems on the home page
- View AI-generated checklist before submitting solution
- Submit solutions for problems
- Chat with the problem poster
- Receive:
  - **AI score**
  - Feedback on **missing or incomplete requirements**
- Improve and resubmit if needed before deadline

---

### 🧠 AI Solution Evaluation
- AI evaluates submitted solutions against the generated checklist
- Outputs:
  - Completion score
  - Missing points (if incomplete)
- Only **fully completed solutions** are visible to the problem poster

---

### 💰 Escrow & Automated Payment Handling
- Funds are locked in escrow when problem is posted
- Payment flow:
  - ✅ Poster manually releases payment after satisfaction
  - ⏱ If payment is not released within **7 days after deadline**,  
    AI automatically releases payment to the **freelancer with the highest AI score**
  - ❌ If no valid submissions exist → **refund to poster**

---

## 🏗️ System Workflow

1. User posts a problem → payment goes into escrow
2. AI generates requirement checklist
3. Freelancers view problem and submit solutions
4. AI scores and validates submissions
5. Poster reviews accepted solutions
6. Payment is released manually or automatically based on rules

---

## 🛠️ Tech Stack

**Frontend**
- React.js
- Tailwind CSS

**Backend**
- Node.js
- Express.js

**Database**
- PostgreSQL

**AI Integration**
- Requirement extraction from problem statements
- Solution evaluation and scoring

**Other**
- REST APIs
- Authentication & Authorization
- Real-time chat system
- Escrow logic implementation

---

## 🌟 Future Enhancements
- Deployment with cloud services
- Notification system
- Versioned solution submissions
- Dispute resolution mechanism
- Freelancer reputation system


