'use client'
import { NIHFundingTableEnhanced as NIHFundingTable } from '@/components/NIHFundingTableEnhanced'

export default function Home() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">NIH Funding Analysis</h1>
      <p className="text-gray-600 mb-8">
        For Fiscal Year 2025. Based on Data from{' '}
        <a 
          href="https://report.nih.gov/report-funding" 
          className="text-blue-600 hover:text-blue-800 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          report.nih.gov
        </a>
      </p>
      <NIHFundingTable />
    </main>
  )
}
