import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface CsvRecord {
    [key: string]: string;
}

async function main() {
    const csvPath = path.join(__dirname, '..', 'data', 'companies.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf-8');

    const records: CsvRecord[] = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        relax_column_count: true,
        relax_quotes: true,
    });

    console.log(`Found ${records.length} companies in CSV`);

    // Clear existing data
    await prisma.company.deleteMany();

    let count = 0;
    for (const record of records) {
        const featured = (record['Featured'] || '').toLowerCase();
        const newExhibitor = (record['New Exhibitor'] || '').toLowerCase();

        await prisma.company.create({
            data: {
                url: record['URL'] || '',
                name: record['Name'] || 'Unknown',
                description: record['Description'] || record['Verified Description'] || '',
                products: record['Products'] || '',
                featured: featured === 'yes' || featured === 'true',
                newExhibitor: newExhibitor === 'yes' || newExhibitor === 'true',
                sponsoring: record['Sponsoring'] || '',
                numberOfEmployees: record['Number of Employees'] || '',
                marketCap: record['Market Cap'] || '',
                additionalInfo: record['Other Useful Information'] || record['Additional Info'] || '',
                status: 'NONE',
            },
        });
        count++;
        if (count % 100 === 0) console.log(`  Seeded ${count} companies...`);
    }

    console.log(`✅ Successfully seeded ${count} companies`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
