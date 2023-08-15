import 'semantic-ui-css/semantic.min.css'

import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'DownTube - Next.js',
    description: 'Download YouTube videos and musics with this Next.js app.',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel='icon' href='/favicon.ico' />
            </head>
            <body className={inter.className} style={{ backgroundColor: '#323232' }}>{children}</body>
        </html>
    )
}
