import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { ObjectID } from 'mongodb'
import connect from '../../utils/database'

// Tipo das respostas após consulta
interface ErrorResponseType {
  error: string
}

// Tipo das respostas após consulta
interface SuccessResponseType {
  date: string
  teacher_name: string
  teacher_id: string
  student_name: string
  student_id: string
  course: string
  location: string
  appointment_link: string
}

export default async (
  req: NextApiRequest, // o que vêm do cliente
  res: NextApiResponse<ErrorResponseType | SuccessResponseType> // O que vai para o cliente
): Promise<void> => {
  // retorno de uma promise
  if (req.method === 'POST') {
    const session = await getSession({ req })

    if (!session) {
      res.status(400).json({ error: 'Please login first' })
    }

    const {
      date,
      teacher_name,
      teacher_id,
      student_name,
      student_id,
      course,
      location,
      appointment_link
    } = req.body

    if (
      !date ||
      !teacher_name ||
      !teacher_id ||
      !student_name ||
      !student_id ||
      !course ||
      !location
    ) {
      res.status(400).json({ error: 'Missing parameter on request body!' })
      return
    }

    const { db } = await connect()

    const teacherExists = await db
      .collection('users')
      .findOne({ _id: new ObjectID(teacher_id) })

    if (!teacherExists) {
      res.status(400).json({
        error: `Teacher ${teacher_name} with id ${teacher_id} does not exists!`
      })
      return
    }

    const studentsExists = await db
      .collection('users')
      .findOne({ _id: new ObjectID(student_id) })

    if (!studentsExists) {
      res.status(400).json({
        error: `Student ${student_name} with id ${student_id} does not exists!`
      })
      return
    }

    const appointment = {
      date,
      teacher_name,
      teacher_id,
      student_name,
      student_id,
      course,
      location,
      appointment_link: appointment_link || ''
    }

    await db
      .collection('users')
      .updateOne(
        { _id: new ObjectID(teacher_id) },
        { $push: { appointments: appointment } }
      )
    await db
      .collection('users')
      .updateOne(
        { _id: new ObjectID(student_id) },
        { $push: { appointments: appointment } }
      )

    res.status(200).json(appointment)
  } else {
    // Se não for post então é retornado a seguinte mensagem
    res.status(400).json({ error: 'Wrong request method!' })
  }
}
