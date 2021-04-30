import { NextApiRequest, NextApiResponse } from 'next'
import connect from '../../utils/database'

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
  if (req.method === 'POST') {
    // checagem do método utilizado pelo cliente

    //pegando dados do corpo da requisição
    const {
      name,
      email,
      cellphone,
      teacher,
      courses,
      available_hours,
      available_locations
    } = req.body

    if (!teacher) {
      if (!name || !email || !cellphone) {
        res.status(400).json({ error: 'missing body parameter' })
        return
      }
    } else if (teacher) {
      if (
        !name ||
        !email ||
        !cellphone ||
        !courses ||
        !available_hours ||
        !available_locations
      ) {
        res.status(400).json({ error: 'missing body parameter' })
        return
      }
    } else {
      res.status(400).json({ error: 'missing body parameter' })
      return
    }

    // Pelo fato de vir depois das validações, vai ficar mais rápido
    const { db } = await connect() // retorna o banco de dados conectado

    const response = await db.collection('users').insertOne({
      name,
      email,
      cellphone,
      teacher,
      coins: 1,
      courses: courses || [],
      available_hours: available_locations || {},
      available_locations: available_locations || [],
      reviews: [],
      appointments: []
    }) // Realiza uma inserção e recebe a resposta

    res.status(200).json(response.ops[0]) // Retornado o response
  } else if (req.method === 'GET') {
    const { email } = req.body

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
