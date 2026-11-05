import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import { MongoClient, ObjectId } from 'mongodb';

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
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
const borrowCollection = db.collection('borrows')

// POST /books — add a book
app.post('/books', async (req, res) => { 
  const bookData = req.body;
  const result = await booksCollection.insertOne(bookData);
  res.send(result);
})
// GET / books — get all books(public) and email filtering
app.get('/books', async (req, res) => {
  const email = req.query.email;
  const query = email ? { creatorEmail: email } : {};
  const result = await booksCollection.find(query).toArray();
  res.send(result);
})

// PATCH /books/:id — update a book
app.patch('/books/:id', async (req, res) => {
  const id = req.params.id;
  const updateData = req.body
  delete updateData._id;
  const result = await booksCollection.updateOne(
    { _id: new ObjectId(id) },
    {$set: updateData},
  )
  res.send(result)
})

// DELETE /books/:id — delete a book
app.delete('/books/:id', async (req, res) => {
  const id = req.params.id;
  const result = await booksCollection.deleteOne({ _id: new ObjectId(id) });
  res.json(result);
})

// GET /books/:id — get one book
app.get('/books/:id', async (req, res) => {
  const id = req.params.id;
  const result = await booksCollection.findOne({ _id: new ObjectId(id) });
  res.send(result);
})

// POST /borrows — borrow a book
app.post('/borrows', async(req, res) => {
  const data = req.body;
  const result = await borrowCollection.insertOne(data);
  res.send(result);
})

// GET /borrows — get the borrows of the logged in user
app.get('/borrows', async (req, res) => {
  const email = req.query.email;
  const result = await borrowCollection.find({userEmail:email}).toArray();
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