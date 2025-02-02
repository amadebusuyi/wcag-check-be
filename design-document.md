# **Design Document: Accessibility Project**

## **Overview**

This document explains the architecture and scoring logic for the **Accessibility Project**, which aims to create an application that ensures accessibility features are met for all users. The primary goal is to evaluate the accessibility of a website or web application based on several criteria and provide a score based on how well these criteria are met. The backend will handle the assessment of accessibility compliance and generate reports based on various accessibility standards.

---

## **1. Architecture Overview**

The application follows a **Monolith Architecture** with focus on performance, scalability, and accessibility standards compliance. The backend will be responsible for processing accessibility checks, evaluating compliance, generating scores and AI powered feedback.

### **Key Components:**

- **Accessibility Service**: This service will handle the logic for checking and scoring accessibility features.
- **Accessibility Algorithms**: A rule-based algorithm for analysing and identifying accessibity issues.
- **API Layer**: The front end will interact with the API to initiate accessibility checks, retrieve scores, and view reports.

---

## **2. Technology Stack**

- **Node.js** with **Express.js** and **TypeScript** for API development
- **Google's Gemini** for AI evaluation and feedback
- **Styled component** for frontend styling
- **Fetch API** for API requests (Frontend to Backend)

---

## **3. Routes**

- **api/upload** to upload an html document for review

---

## **4. Scoring Criteria**

- A maximum score value of 100 is assigned by default.
- A weight of 10 is assigned to each identified issue.
- Any website with upto 10 accessibility issue is high severity.
