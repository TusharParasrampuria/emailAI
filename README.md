# ✉️ Email.AI — GPT for your Gmail

**Email.AI** is a personal Chrome extension that helps you write smart, professional email replies using Groq’s fast, open-source language models (LLaMA 3).  
No data is stored, your emails are processed locally, and replies are generated securely via the Groq API.

## 🚀 Features
- Read your Gmail message (current thread only)
- Generate **3 AI-powered reply options**
- Copy any reply to your clipboard
- Personal API key support (uses your Groq account)
- No external servers, no tracking, no storage
- Fully private, runs in your browser

## 🔑 How to Get a Groq API Key

1. Go to [https://console.groq.com/keys](https://console.groq.com/keys)  
2. Create a free Groq account (Google sign-in available)
3. Copy your **API Key** (it starts with `gsk_...`)
4. Keep it safe, you’ll paste it into the extension


## ⚙️ Setup & Installation

### 1. Clone This Repository

```bash
git clone https://github.com/TusharParasrampuria/emailAI.git
cd emailAI
```

### 2. Load Extension in Chrome

1. Go to `chrome://extensions/`
2. Enable **Developer Mode**
3. Click **Load unpacked**
4. Select the `emailAI` folder

✅ Now the extension will appear in your Chrome toolbar.

## ✨ How to Use

1. Open Gmail and open any email thread
2. Click the **Email.AI** extension icon
3. On first use:
   - Go to **API Key Settings**
   - Paste your Groq API Key
   - Click **Save**
4. Click **🔄 Generate Reply**
5. Choose any suggested reply → click **Copy**
6. Paste it into your Gmail reply box and send!

## 🛡️ Privacy

- This extension does **not store your Gmail data or API key externally**
- The only data sent to Groq is the email body for generating replies
- All processing happens securely through the Groq API

## 💡 Powered by Groq’s Free Models

Current models used:
- `llama3-8b-8192`
- `llama3-70b-8192`
- `llama-3.1-8b-instant`

## ⚠️ Disclaimer

This is a personal project for educational use.  
Please use your Groq API key responsibly and do not abuse the free tier.
