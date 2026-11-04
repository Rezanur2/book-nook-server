import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import { MongoClient, ObjectId } from 'mongodb';

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors(["http://localhost:3000"]));
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);
export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}
const clientConnect = await connectToMongoDB();
const db = clientConnect.db('book-nook');  
const booksCollection = db.collection('books');

app.post('/books', async (req, res) => { 
  const bookData = req.body;
  const result = await booksCollection.insertOne(bookData);
  res.send(result);
})

app.get('/books', async (req, res) => { 
  const result = await booksCollection.find().toArray();
  res.send(result);
})

app.get('/my-books/:email', async (req, res) => {
  const email = req.params.email;
  const result = await booksCollection.find({ creatorEmail: email }).toArray();
  res.send(result);
})

app.get('/books/:id', async (req, res) => {
  const id = req.params.id;
  const result = await booksCollection.findOne({ _id: new ObjectId(id) });
  res.send(result);
})

app.get("/", (req, res) => {
    res.send('Hello World!')
})

app.get('/test', (req, res) => {
    res.json({message: "This is test API"})
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})