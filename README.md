# Ticket Platform - Frontend

This is the frontend of the Ticket Platform, a modern Application designed for managing support tickets. It features real-time role-based routing (User, Support, Admin) and an integrated AI Support Assistant powered by Google Gemini.

> ℹ️ **Note:** This repository only contains the frontend code. The backend application is hosted in a separate repository. You can find it here: **[[Link to Backend Repo](https://github.com/Clintbr/TicketSystem-backend)]**.

## 🚀 Tech Stack

* **Framework:** React (Vite)
* **Routing:** React Router DOM (with clean browser URLs and `_redirects` fallback for static hosting)
* **Styling:** Tailwind CSS
* **API Client:** Axios
* **AI Integration:** Google Generative AI SDK (Gemini 1.5 Flash)

## 🛠️ Setup & Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Clintbr/TicketSystem-backend.git
cd TicketSystem-backend

```


2. **Install dependencies:**
```bash
npm install

```


3. **Configure Environment Variables:**
Create a `.env` file in the root directory and add your Google Gemini API key:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here

```


4. **Run the application locally:**
```bash
npm run dev

```



## 🌐 Deployment

The frontend is optimized for static site hosting and is deployed on **Netlify**. It includes a `public/_redirects` configuration file to ensure seamless page reloads without breaking the client-side routing.
