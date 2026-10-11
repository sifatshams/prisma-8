import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.send({ message: 'Server is running...' });
});

app.listen(3000, () => {
  console.log(`Server is running on port:${3000}`);
});
