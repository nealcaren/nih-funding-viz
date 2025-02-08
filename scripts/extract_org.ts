import fs from 'fs';
import Papa from 'papaparse';

interface RawData {
  'ORGANIZATION NAME': string;
  'STATE OR COUNTRY NAME': string;
  'CITY': string;
  'DIRECT COST': string;
  'INDIRECT COST': string;
  'IPF': string;
  [key: string]: string;  // Allow any other string columns
}

function extractOrganization(inputFile: string, outputFile: string, targetOrg: string) {
  const csvData = fs.readFileSync(inputFile, 'utf-8');
  
  const parsedData = Papa.parse<RawData>(csvData, {
    header: true,
    skipEmptyLines: true,
    transformHeader: header => header.trim(),
    transform: value => value.trim()
  });

  const filteredData = parsedData.data.filter(row => row['ORGANIZATION NAME'] === targetOrg);

  const csv = Papa.unparse(filteredData);
  fs.writeFileSync(outputFile, csv);
  
  console.log(`Found ${filteredData.length} records for organization "${targetOrg}"`);
}

// Extract data for UNC Chapel Hill
extractOrganization(
  'public/data/nih_2024.csv', 
  'public/data/unc_chapel_hill.csv', 
  'UNIV OF NORTH CAROLINA CHAPEL HILL'
);
