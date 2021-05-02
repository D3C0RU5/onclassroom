import { NextApiRequest, NextApiResponse } from 'next'
import connect from '../../utils/database'

// Tipo das respostas após consulta
interface ErrorResponseType {
  error: string
}

export default async (
  req: NextApiRequest, // o que vêm do cliente
  res: NextApiResponse<ErrorResponseType | object[]> // O que vai para o cliente
): Promise<void> => {
  // retorno de uma promise
  if (req.method === 'GET') {
    const { courses } = req.body

    if (!courses) {
      res.status(400).json({ error: 'Missing course name on request body!' })
      return
    }

    const { db } = await connect()

    const response = await db
      .collection('users')
      .find({ courses: { $in: [new RegExp(`^${courses}`, 'i')] } })
      .toArray()

    if (response.length === 0) {
      res.status(404).json({ error: 'Course not found!' })
      return
    }
    res.status(200).json(response)
  } else {
    // Se não for post então é retornado a seguinte mensagem
    res.status(400).json({ error: 'Wrong request method!' })
  }
}
