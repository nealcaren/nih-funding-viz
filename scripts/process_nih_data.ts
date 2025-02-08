import fs from 'fs';
import Papa from 'papaparse';
import _ from 'lodash';

interface RawData {
  'ORGANIZATION NAME': string;
  'STATE OR COUNTRY NAME': string;
  'CITY': string;
  'DIRECT COST': string;
  'INDIRECT COST': string;
}

interface ProcessedOrg {
  organizationName: string;
  state: string;
  city: string;
  directCost: number;
  indirectCost: number;
  cappedIndirectCost: number;
  lostIndirect: number;
}

function processData(inputFile: string, outputFile: string) {
  const csvData = fs.readFileSync(inputFile, 'utf-8');
  
  const parsedData = Papa.parse<RawData>(csvData, {
    header: true,
    skipEmptyLines: true,
    transformHeader: header => header.trim(),
    transform: value => value.trim()
  });

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

  fs.writeFileSync(outputFile, JSON.stringify(aggregatedData, null, 2));
  console.log(`Processed ${parsedData.data.length} records into ${aggregatedData.length} organizations`);
}

// Process the data
processData('public/data/nih_2024.csv', 'public/processed_nih_2024.json');
