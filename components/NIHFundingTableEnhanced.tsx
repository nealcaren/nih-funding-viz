'use client';
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { ArrowUpDown } from "lucide-react";
import _ from 'lodash';
import type { ReactElement } from 'react';


interface Organization {
  organizationName: string;
  state: string;
  city: string;
  directCost: number;
  indirectCost: number;
  cappedIndirectCost: number;
  lostIndirect: number;
}

export default function NIHFundingTableEnhanced(): ReactElement {
  const [data, setData] = useState<Organization[]>([]);
  const [sortConfig, setSortConfig] = useState({ key: 'lostIndirect', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/nih-data');
        const result = await response.json();
        
        if (!result.data) {
          throw new Error('No data received');
        }

        const parsedData = Papa.parse(result.data, {
          header: true,
          skipEmptyLines: true,
          transformHeader: header => header.trim(),
          transform: value => value.trim()
        });

        // Process and aggregate data by organization
        const aggregatedData = _.chain(parsedData.data)
          .map(row => {
            const directCost = parseFloat(row['DIRECT COST']?.replace(/[^0-9.-]+/g, '')) || 0;
            const indirectCost = parseFloat(row['INDIRECT COST']?.replace(/[^0-9.-]+/g, '')) || 0;
            const cappedIndirectCost = Math.min(indirectCost, directCost * 0.15);
            const lostIndirect = Math.max(0, indirectCost - cappedIndirectCost);

            return {
              organizationName: row['ORGANIZATION NAME'] || 'N/A',
              state: row['STATE OR COUNTRY NAME'] || 'N/A',
              city: row['CITY'] || 'N/A',
              directCost,
              indirectCost,
              cappedIndirectCost,
              lostIndirect
            };
          })
          .groupBy('organizationName')
          .map((group, key) => ({
            organizationName: key,
            state: group[0].state,
            city: group[0].city,
            directCost: _.sumBy(group, 'directCost'),
            indirectCost: _.sumBy(group, 'indirectCost'),
            cappedIndirectCost: _.sumBy(group, 'cappedIndirectCost'),
            lostIndirect: _.sumBy(group, 'lostIndirect')
          }))
          .value();

        setData(aggregatedData);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const sortData = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortedData = () => {
    const filteredData = data.filter(item =>
      item.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Always sort the data since we have a default sort config

    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  if (loading) {
    return <div className="p-4">Loading data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col space-y-2">
        <h2 className="text-lg font-semibold">NIH Funding Analysis (Aggregated by Organization)</h2>
        <div className="text-sm text-gray-600 space-y-1">
          <p>Showing {getSortedData().length} organizations from {data.length} total</p>
          <p>Total Lost Indirect for visible rows: {formatCurrency(getSortedData().reduce((sum, row) => sum + row.lostIndirect, 0))}</p>
        </div>
        <input
          type="text"
          placeholder="Search organizations, states, or cities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-sm px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => sortData('organizationName')}
              >
                Organization Name 
                <ArrowUpDown className="inline h-4 w-4 ml-2"/>
              </th>
              <th 
                className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => sortData('directCost')}
              >
                Direct 
                <ArrowUpDown className="inline h-4 w-4 ml-2"/>
              </th>
              <th 
                className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => sortData('indirectCost')}
              >
                Indirect 
                <ArrowUpDown className="inline h-4 w-4 ml-2"/>
              </th>
              <th 
                className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => sortData('cappedIndirectCost')}
              >
                15% Capped Indirect 
                <ArrowUpDown className="inline h-4 w-4 ml-2"/>
              </th>
              <th 
                className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => sortData('lostIndirect')}
              >
                Lost Indirect 
                <ArrowUpDown className="inline h-4 w-4 ml-2"/>
              </th>
              <th 
                className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => sortData('state')}
              >
                State/Country 
                <ArrowUpDown className="inline h-4 w-4 ml-2"/>
              </th>
              <th 
                className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => sortData('city')}
              >
                City 
                <ArrowUpDown className="inline h-4 w-4 ml-2"/>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {getSortedData().map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-[200px]">
                  <div className="break-words">
                    {row.organizationName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(row.directCost)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(row.indirectCost)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(row.cappedIndirectCost)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                  {formatCurrency(row.lostIndirect)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {row.state}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {row.city}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

