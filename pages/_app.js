// pages/_app.js
import '@/styles/globals.css'
import 'react-datepicker/dist/react-datepicker.css'
import '@/styles/datapicker.css'

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
   
      <Component {...pageProps} />
   
  )
}