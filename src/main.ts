import express, { Request, Response } from 'express';
import { db } from './prisma/db';

const app = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'Server is running...' });
});

// create user
app.post('/api/create', async (req: Request, res: Response) => {
  try {
    const { name, email, username } = req.body;

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
      username: username ?? null,
    });

    // success response
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// get user
app.get('/api/users', async (req: Request, res: Response) => {
  try {
    const users = await db.orm.public.User.all();
    // success res
    res.status(200).json({ data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// update user
app.patch('/api/update/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, username } = req.body;

    // update user
    const updatedUser = await db.orm.public.User.where({
      id: id as string,
    }).update({
      name,
      email,
      username,
    });

    // validation
    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    // success response
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// delete user
app.delete('/api/delete/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // validation
    if (typeof id !== 'string') {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid user ID' });
    }

    // delete user
    await db.orm.public.User.where({ id: id as string }).delete();

    // success resposne
    res
      .status(200)
      .json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to delete user',
    });
  }
});

app.listen(3000, () => {
  console.log(`Server is running on port:${3000}`);
});
