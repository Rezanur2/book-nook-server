import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import { MongoClient, ObjectId } from 'mongodb';
import { createRemoteJWKSet, jwtVerify } from 'jose';

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

// JWT Middleware
const verifyToken = async(req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ msg: 'Unauthorized!' });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send({ msg: 'Unauthorized!' });
  }
  
  const JWKS = createRemoteJWKSet(new URL(`${process.env.CLIENT_URL}/api/auth/jwks`));

  try {    
    const { payload } = await jwtVerify(token, JWKS);
    next();
  } catch (error) {
    return res.status(401).send({ msg: 'Server Error!' });
  }
}

// POST /books — add a book
app.post('/books', verifyToken, async (req, res) => { 
  const bookData = req.body;
  const result = await booksCollection.insertOne(bookData);
  res.send(result);
})
// GET / books — get all books(public) and email filtering and sorting with limit(query)
app.get('/books', async (req, res) => {
  const email = req.query.email;
  const limit = parseInt(req.query.limit) || 0;
  const query = email ? { creatorEmail: email } : {};
  const result = await booksCollection
    .find(query)
    .sort({ _id: -1 })
    .limit(limit)
    .toArray();
  res.send(result);
})

// PATCH /books/:id — update a book
app.patch('/books/:id', verifyToken, async (req, res) => {
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
app.delete('/books/:id', verifyToken, async (req, res) => {
  const id = req.params.id;
  const result = await booksCollection.deleteOne({ _id: new ObjectId(id) });
  res.json(result);
})

// GET /books/:id — get one book
app.get('/books/:id', verifyToken, async (req, res) => {
  const id = req.params.id;
  const result = await booksCollection.findOne({ _id: new ObjectId(id) });
  res.send(result);
})

// POST /borrows — borrow a book
app.post('/borrows', verifyToken, async (req, res) => {
  const data = req.body;

  // No Double Borrow Check
  const alreadyBorrowed = await borrowCollection.findOne({
    bookId: data.bookId,
    userEmail: data.userEmail,
  });

  if (alreadyBorrowed) {
    return res.status(400).json({
      message: "You already borrowed this book!"
    })
  }

  const result = await borrowCollection.insertOne(data);
  await booksCollection.updateOne(
    { _id: new ObjectId(data.bookId) },
    { $inc: { availableCopies: -1 } }
  );
  res.send(result);
})

// GET /borrows — get the borrows of the logged in user
app.get('/borrows', verifyToken, async (req, res) => {
  const email = req.query.email;
  const result = await borrowCollection.find({userEmail:email}).toArray();
  res.send(result);
})

// DELETE /borrows/:id — return a book and update available copies count
app.delete('/borrows/:id', verifyToken, async (req, res) => {
  const id = req.params.id;
  const borrow = await borrowCollection.findOne({ _id: new ObjectId(id) });
  const result = await borrowCollection.deleteOne({ _id: new ObjectId(id) });
  await booksCollection.updateOne(
    { _id: new ObjectId(borrow.bookId) },
    { $inc: {availableCopies: 1}}
  )
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

export default app;