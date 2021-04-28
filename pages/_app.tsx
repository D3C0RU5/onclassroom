import React from 'react'
import { AppProps } from 'next/app'

//const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
function MyApp ({ Component, pageProps }: AppProps) : JSX.Element {
  return <Component {...pageProps} />
}

export default MyApp
