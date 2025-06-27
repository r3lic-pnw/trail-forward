import express from 'express';
import path from 'path';

const staticFilesPath = path.join(process.cwd(), 'public');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(staticFilesPath));

app.get('/', (req, res) => {
    res.sendFile("index.html", { root: staticFilesPath });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});