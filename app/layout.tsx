import './globals.css'

export const metadata = {
  title: 'NIH Funding Analysis',
  description: 'Analysis of NIH funding data',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body suppressHydrationWarning={true} className="h-full">{children}</body>
    </html>
  )
}
