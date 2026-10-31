import express from 'express';
import cors from 'cors';
import 'dotenv/config'

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send('Hello World!')
})

app.get('/test', (req, res) => {
    res.json({message: "This is test API"})
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})