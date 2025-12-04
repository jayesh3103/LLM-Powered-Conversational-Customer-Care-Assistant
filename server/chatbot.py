import openai
import pinecone
from langchain.document_loaders import PyPDFDirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.llms import OpenAI
from langchain.embeddings.sentence_transformer import SentenceTransformerEmbeddings
from langchain.chains.question_answering import load_qa_chain
from langchain.vectorstores import Pinecone
from langchain.callbacks.base import BaseCallbackHandler
from queue import Queue
from threading import Thread


import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
HUGGINGFACEHUB_API_TOKEN = os.getenv("HUGGING_FACE_API_TOKEN")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_ENV = os.getenv("PINECONE_ENV", "gcp-starter")


def load_docs(directory):
  loader = PyPDFDirectoryLoader(directory)
  documents = loader.load()
  return documents

directory = 'Docs/'
documents = load_docs(directory)

def split_docs(documents, chunk_size=1000, chunk_overlap=20):
  text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
  docs = text_splitter.split_documents(documents)
  return docs

docs = split_docs(documents)

embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")

pinecone.init(
    api_key=PINECONE_API_KEY,
    environment=PINECONE_ENV
)


index_name = "laptops"

index = Pinecone.from_documents(docs, embeddings, index_name=index_name)

def get_similiar_docs(query, k=2):
    similar_docs = index.similarity_search(query, k=k)
    return similar_docs

llm = OpenAI(openai_api_key=OPENAI_API_KEY)
chain = load_qa_chain(llm, chain_type="stuff")

class StreamHandler(BaseCallbackHandler):
    def __init__(self, queue):
        self.queue = queue

    def on_llm_new_token(self, token: str, **kwargs) -> None:
        self.queue.put(token)

    def on_llm_end(self, response, **kwargs) -> None:
        self.queue.put(None)

    def on_llm_error(self, error, **kwargs) -> None:
        self.queue.put(None)

def get_answer_generator(query):
    relevant_docs = get_similiar_docs(query)
    q = Queue()
    handler = StreamHandler(q)
    llm_stream = OpenAI(openai_api_key=OPENAI_API_KEY, streaming=True, callbacks=[handler])
    chain_stream = load_qa_chain(llm_stream, chain_type="stuff")

    def task():
        chain_stream.run(input_documents=relevant_docs, question=query)

    t = Thread(target=task)
    t.start()

    while True:
        token = q.get()
        if token is None:
            break
        yield token


def get_answer(query):
  relevant_docs = get_similiar_docs(query)
  print(relevant_docs)
  response = chain.run(input_documents=relevant_docs, question=query)
  return response

# our_query = "My laptop is overheating. What do I do?"
# answer = get_answer(our_query)
# print(answer)