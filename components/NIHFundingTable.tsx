'use client'

interface FundingData {
  // Add your funding data interface here
}

export default function NIHFundingTable() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Project</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Year</th>
          </tr>
        </thead>
        <tbody>
          {/* Add your table rows here */}
          <tr>
            <td className="border px-4 py-2">Sample Project</td>
            <td className="border px-4 py-2">$100,000</td>
            <td className="border px-4 py-2">2024</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
