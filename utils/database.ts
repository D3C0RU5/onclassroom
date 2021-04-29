import { Db, MongoClient } from 'mongodb'

interface ConnectType {
    db:Db;
    client: MongoClient;
}

// Definição padrão de um cliente mongo
const client = new MongoClient(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// método que retorna o banco de dados conectado e o cliente
export default async function connect(): Promise<ConnectType> {
  // conecta se não estiver já conectado
  if (!client.isConnected()) await client.connect()

  // atribui o banco à variável
  const db = client.db('onclassroom')

  //retorna o banco de dados e o cliente de acesso do mongo
  return { db, client }
}
