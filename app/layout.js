import './globals.css'

export const metadata = {
  title: 'Flor survey',
  description: 'Survey regarding member retention.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
