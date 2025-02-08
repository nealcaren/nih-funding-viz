export const metadata = {
  title: 'NIH Funding Analysis',
  description: 'Analysis of NIH funding data',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  )
}
