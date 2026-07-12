# UseTinamou.com 🪶 | AI-Powered Data Extraction Utility

[![License: Proprietary](https://img.shields.io/badge/License-All_Rights_Reserved-red.svg)](./LICENSE)
[![AWS Serverless](https://img.shields.io/badge/Architecture-AWS_Lambda-FF9900?logo=amazonaws)](https://aws.amazon.com/)
[![Backend](https://img.shields.io/badge/Backend-NestJS-E0234E?logo=nestjs)](https://nestjs.com/)
[![Powered by Anthropic](https://img.shields.io/badge/AI_Engine-Claude_3.5_Haiku-1a1a1a?logo=anthropic)](https://www.anthropic.com/)
[![Frontend](https://img.shields.io/badge/Frontend-React_|_Vite-61DAFB?logo=react)](https://reactjs.org/)

> ⚠️ **Legal Notice:** This repository is public **strictly for portfolio review and educational evaluation** by hiring managers. The code is entirely proprietary. No permission is granted to copy, modify, distribute, or use this codebase for personal or commercial projects. © 2026 Shams Mahboob Islam.

**UseTinamou.com** is a high-speed, B2B AI utility designed to convert unstructured, messy business inputs (raw WhatsApp orders, SMS, or emails) into highly structured, marketplace-ready CSV files and data tables.

> **Portfolio Context:** This repository serves as a Capstone Project demonstrating a dual **Product Management (PM)** and **Engineering Management (EM)** skill set. It balances Product-Led Growth (PLG) mechanics with strict, cost-conscious, enterprise-grade serverless engineering.

---

## 📊 1. Product Strategy & Monetization (PM Focus)

### The User Problem
Custom apparel printers, boutique bakers, and local wholesalers lose hours every week manually parsing unstructured text orders from clients on WhatsApp into structured spreadsheet rows for fulfillment.

### The Core MVP Workflow
Users paste a block of messy text into the frontend. The backend instantly extracts the customer name, shipping data, line items, quantities, and missing fields into an editable React data table, and outputs a ready-to-import CSV.

### Scope & Monetization Mechanics
To validate the market without over-engineering billing systems, the app employs a manual PLG model:
* **Freemium Limits:** Free users are strictly capped at **5 total generations** or **20 spreadsheet rows**. This allows them to experience the "Aha!" moment while protecting our AWS/AI API margins.
* **Manual Upgrade Routing:** Upon hitting the limit, users hit a hard paywall routing them to static checkout links (Razorpay for INR, PayPal for USD). This bypasses complex subscription webhook infrastructure for Phase 1.
* **Analytics Taxonomy:** Conversion funnel tracked via PostHog: `Landing Page View` ➡️ `Lead Captured` ➡️ `Generate Clicked` ➡️ `CSV Downloaded`.

---

## 🏗 2. System Architecture (EM Focus)

The system leverages a decoupled, serverless microservices architecture designed to stay within the **AWS Free Tier** while maintaining enterprise maintainability.

```text
[ React Frontend (Vite + Tailwind + shadcn/ui) ] 
                     │ (Static Hosting via S3 + CloudFront CDN)
                     ▼
       [ AWS API Gateway (HTTP API) ]
                     │ (Low-latency routing)
                     ▼
  [ AWS Lambda (NestJS Serverless Backend) ]
          │                  │
          ▼                  ▼
 [ Amazon DynamoDB ]   [ LangChain.js + Anthropic Claude 3.5 Haiku ] 
(Usage Ledgers)       (Structured Schema Extraction / Zod)
```
