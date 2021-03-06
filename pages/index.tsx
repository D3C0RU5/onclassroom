import React from 'react'
import Head from 'next/head'
import { NextPage } from 'next'
import { signIn, SignInResponse, signOut, useSession } from 'next-auth/client'

import 'tailwindcss/tailwind.css'

//const Home: React.FC = () => {
const Home: NextPage = () => {
  const [session, loading] = useSession();
  
  return (
    <div>
      <Head>
        <title>Minha pagina</title>
        <h1 className="p-1">Taynara meu amor</h1>
      </Head>
      {!session && (
        <div className="text-3xl">
          Not signed in <br />
          <button onClick={(): Promise<SignInResponse> => signIn("auth0")}>
            Sign in
          </button>
        </div>
      )}
      {session && (
        <div className="text-3xl">
          Signed in as {session.user.email} <br />
          <button onClick={(): Promise<void> => signOut()}>Sign out</button>
        </div>
      )}
      {loading && (
          <div className="text-5xl">
            <h1>Carregando</h1>
          </div>
      )}
    </div>
  );
}

export default Home
