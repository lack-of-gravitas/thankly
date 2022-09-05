import { Head, Html, Main, NextScript } from 'next/document'

export default function Document(props: any) {
  return (
    <Html className="h-full antialiased scroll-smooth" lang="en">
      <Head>
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
        
        {/* <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-MN6W52S');`,
            }}
          ></script> */}
        {/* <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src='https://www.googletagmanager.com/ns.html?id=GTM-MN6W52S' height='0' width='0' style='display:none;visibility:hidden'></iframe>`,
            }}
          ></noscript> */}
      </Head>
      <body className="">
        {/* flex flex-col h-full  */}
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

// import { Head, Html, Main, NextScript } from 'next/document'

// export default function Document() {
//   return (
//     <Html className='h-full antialiased bg-gray-50' lang='en'>
//       <Head />
//       <body className='flex flex-col h-full'>
//         <Main />
//         <NextScript />
//       </body>
//     </Html>
//   )
// }
