# LLM Powered Conversational Customer Care Assistant - SahAIta

Welcome to our conversational customer care assistant web application powered by large language models (LLMs) with sentiment analysis capabilities. This application provides a seamless interface for customer service interactions, aiming to offer accurate product information, address customer queries, and handle complaints efficiently. The chatbot component is integrated with sentiment analysis to ensure positive and professional customer interactions.

## Use Case

Our application is tailored for providing details about laptops. The conversational assistant assists users with various tasks such as providing product features, pricing details, availability status, troubleshooting guidance, and addressing complaints.

## Features

- Real-time chat interface for customers to interact with the conversational assistant.
- Sentiment analysis to gauge and respond to customer emotions effectively.
- Frictionless user experience with accurate and timely information.
- Dashboard for human cases vs agent cases
- Retrieval augmented generation (RAG) capabilities for querying knowledge base of products and services.

## Technologies Used

- **Next.js**: Next.js is a React framework for building server-side rendered and statically generated applications. It provides an efficient and flexible development experience.
- **TypeScript**: TypeScript adds static typing to JavaScript, enhancing code quality and developer productivity.
- **Python and Flask**: Flask is a lightweight web framework for Python, allowing rapid development of web applications. We use Python for backend functionalities such as sentiment analysis and integrating with retrieval augmented generation (RAG) capabilities.
- **Langchain**: Langchain was used so that interaction will LLM's becomes very smooth.
- **Pinecone vector DB**: Pinecone is used to store vector data from PDF's

## Getting Started

### Prerequisites

- Node.js (>=14.x)
- npm (>=7.x)
- Python (>=3.6)

### Installation & Running

#### 1. Backend Setup (Flask)

Navigate to the server directory:

```bash
cd server
```

Create a virtual environment (recommended):

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Set up environment variables:

- Rename `.env.example` to `.env`
- Add your API keys (OpenAI, Pinecone, etc.)

Run the backend server:

```bash
python app.py
```

The server will start on `http://127.0.0.1:5000`.

#### 2. Frontend Setup (Next.js)

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Environment Variables

Ensure you have the following keys in your `server/.env` file:

- `OPENAI_API_KEY`
- `PINECONE_API_KEY`
- `PINECONE_ENV`
- `HUGGING_FACE_API_TOKEN`

