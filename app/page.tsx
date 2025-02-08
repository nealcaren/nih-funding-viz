'use client'
import NIHFundingTableEnhanced from '@/components/NIHFundingTableEnhanced'

export default function Home() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">NIH Funding Analysis</h1>
      <div className="text-gray-600 mb-8 space-y-4">
        <p>
          For Fiscal Year 2024. Based on Data from{' '}
          <a 
            href="https://report.nih.gov/report-funding" 
            className="text-blue-600 hover:text-blue-800 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            report.nih.gov
          </a>
        </p>
        <p>
          This page estimates the impact on organizations of a 15% cap on indirect costs based on awards granted in 2024. 
          For each award, I calculated the threatened indirect as the difference between the current indirect and 15% of the direct costs. 
          Awards were then aggregated by organization. Note that this is based on awards in Fiscal Year 2024, not funds dispersed.
        </p>
      </div>
      <NIHFundingTableEnhanced />
    </main>
  )
}
