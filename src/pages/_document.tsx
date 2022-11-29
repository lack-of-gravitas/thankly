import { Head, Html, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document(props: any) {
  return (
    <Html className="h-full antialiased scroll-smooth" lang="en">
      <Head>
      <link
          rel="preload"
          href="https://assets.vercel.com/raw/upload/v1587415301/fonts/2/inter-var-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Lato&family=Roboto&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=swap"
        />
        <meta name="google-site-verification" content="O_D9XS1hEQehQtqShBRF_IpeKghrLhYCjEmlL_Jto9s" />
      </Head>
      <body className="">
        {/* flex flex-col h-full  */}
        <Main />
        <NextScript />
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-01Y5P4HKGH"
        ></Script>
        <Script id="ga4">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA4_ID}', {
              page_path: window.location.pathname,
            });`}
        </Script>

        <Script
          strategy="beforeInteractive"
          id="googlemaps"
          type="text/javascript"
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOG_ADDRESSFILL}&libraries=places`}
        />
      </body>
    </Html>
  )
}
