import { NextApiRequest, NextApiResponse } from 'next'
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
    const { email } = req.query;

    if (!email) {
      res.status(400).json({ error: 'Missing email!' })
      return
    }

    const { db } = await connect()
    const response = await db.collection('users').findOne({ email })

    if (!response) {
      res.status(404).json({ error: 'User whit this e-mail not found!' })
      return
    }
    res.status(200).json(response)
  } else {
    // Se não for post então é retornado a seguinte mensagem
    res.status(400).json({ error: 'Wrong request method!' })
  }
}
