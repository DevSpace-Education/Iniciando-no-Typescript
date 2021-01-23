import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import PasswordHash from '../config/hash';
import Users from '../models/Users';

export default {
  async create(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const hashedPassword: string = await PasswordHash.hash(password);

    const usersRepository = getRepository(Users);

    const checkUserEmail = await usersRepository.findOne({
      where: {
        email
      }
    })

    if(checkUserEmail) {
      throw new Error('Email já cadastrado')
    }

    const data = {
      name, 
      email, 
      password: hashedPassword
    }

    const user = usersRepository.create(data);

    await usersRepository.save(user);

    return res.json(user);
  }
}