import { Router, Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import { z } from 'zod';
import { usersRepo, auditRepo } from '../db/repo';
import { generateToken, requireAuth, AuthRequest } from '../middleware/auth';

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const parse = loginSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: 'Please provide a valid email and password.' });
    }

    const { email, password } = parse.data;
    const user = await usersRepo.findByEmail(email);

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid email credentials or deactivated account.' });
    }

    const isMatch = await bcryptjs.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    await auditRepo.log(user.id, 'login', 'user', user.id, { email: user.email, ip: req.ip });

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error during authentication.' });
  }
});

authRouter.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  return res.json({ user: req.user });
});

authRouter.post('/logout', requireAuth, async (req: AuthRequest, res: Response) => {
  await auditRepo.log(req.user?.id || null, 'logout', 'user', req.user?.id || null);
  return res.json({ success: true, message: 'Logged out successfully.' });
});
