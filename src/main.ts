import express, { Request, Response } from 'express';
import { db } from './prisma/db';

const app = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'Server is running...' });
});

// create user
app.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    // validation
    if (!name || !email) {
      return res
        .status(400)
        .json({ success: false, message: 'Name and email are required' });
    }

    // create user
    const user = await db.orm.public.User.create({
      name,
      email,
    });

    // success response
    res
      .status(201)
      .json({
        success: true,
        message: 'User created successfully',
        data: user,
      });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Internal server error', error });
  }
});

app.listen(3000, () => {
  console.log(`Server is running on port:${3000}`);
});
