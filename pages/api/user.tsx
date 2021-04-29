import { NextApiRequest, NextApiResponse } from 'next'
import connect from '../../utils/database'

// Tipo das respostas após consulta
interface ErrorResponseType {
  error: string
}

// Tipo das respostas após consulta
interface SuccessResponseType{
  _id: string;
  name: string;
  email:string;
  cellphone: string;
  teacher: string;
}

export default async (
  req: NextApiRequest, // o que vêm do cliente
  res: NextApiResponse<ErrorResponseType | SuccessResponseType> // O que vai para o cliente
): Promise<void> => { // retorno de uma promise
  if (req.method === 'POST') { // checagem do método utilizado pelo cliente

    //pegando dados do corpo da requisição
    const {name, email, cellphone, teacher} = req.body;
    
    if(!name || !email || !cellphone || !teacher){
      res.status(400).json({error: 'missing body parameter'});
      return;
    }

    // Pelo fato de vir depois das validações, vai ficar mais rápido
    const { db } = await connect() // retorna o banco de dados conectado

    const response = await db.collection('users').insertOne({
      name,
      email,
      cellphone,
      teacher
    }) // Realiza uma inserção e recebe a resposta

    res.status(200).json(response.ops[0]) // Retornado o response
  } else { // Se não for post então é retornado a seguinte mensagem
    res.status(400).json({ error: 'Wrong request method' })
  }
}
