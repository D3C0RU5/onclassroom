import React from 'react'
import Head from 'next/head'
import { NextPage } from 'next'

import 'tailwindcss/tailwind.css'

//const Home: React.FC = () => {
const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Minha pagina</title>
        <h1 className="p-1">Taynara meu amor</h1>
      </Head>
    </div>
  )
}

export default Home
