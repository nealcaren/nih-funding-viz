'use client'
import NIHFundingTableEnhanced from '@/components/NIHFundingTableEnhanced'

export default function Home() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Estimated Impact of NIH Indirect Cost Cap Proposal</h1>
      <div className="text-gray-600 mb-8 space-y-4">
        <p>
          This analysis estimates the impact on research organizations of a proposed 15% cap on indirect costs. 
          For each <a 
            href="https://report.nih.gov/award/index.cfm" 
            className="text-blue-600 hover:text-blue-800 underline"
            target="_blank"
            rel="noopener noreferrer"
          >NIH award</a>, I calculated the threatened indirect as the difference between the current indirect and 15% of the direct costs. 
          Awards were then aggregated by organization. Note that this is based on awards in Fiscal Year 2024, not funds dispersed.
        </p>
      </div>
      <NIHFundingTableEnhanced />
    </main>
  )
}
