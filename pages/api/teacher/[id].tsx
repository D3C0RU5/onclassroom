import { NextApiRequest, NextApiResponse } from 'next'
import { ObjectID } from 'mongodb'
import connect from '../../../utils/database'

// Tipo das respostas após consulta
interface ErrorResponseType {
  error: string
}

// Tipo das respostas após consulta
interface SuccessResponseType {
  _id: string
  name: string
  email: string
  cellphone: string
  teacher: boolean
  coins: number
  courses: string[]
  available_hours: object
  available_locations: string[]
  reviews: object[]
  appointments: object[]
}

export default async (
  req: NextApiRequest, // o que vêm do cliente
  res: NextApiResponse<ErrorResponseType | SuccessResponseType> // O que vai para o cliente
): Promise<void> => {
  // retorno de uma promise
  if (req.method === 'GET') {
    const id  = req.query.id as string;

    if (!id) {
      res.status(400).json({ error: 'Missing teacher ID on request body!' })
      return
    }

    let _id: ObjectID;
    try{
        _id = new ObjectID(id);
    }catch{
        res.status(400).json({ error: 'Wrong objectID' });
        return;
    }

    const { db } = await connect();

    const response = await db
      .collection('users')
      .findOne({ _id });

    if (!response) {
      res.status(404).json({ error: `Teacher woth ID ${_id} found!` });
      return;
    }
    res.status(200).json(response);
  } else {
    // Se não for post então é retornado a seguinte mensagem
    res.status(400).json({ error: 'Wrong request method!' });
  }
}
