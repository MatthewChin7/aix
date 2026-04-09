import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const status = searchParams.get('status');
    const name = searchParams.get('name');
    const description = searchParams.get('description');
    const products = searchParams.get('products');
    const featured = searchParams.get('featured');
    const newExhibitor = searchParams.get('newExhibitor');
    const sponsoring = searchParams.get('sponsoring');
    const employees = searchParams.get('employees');
    const marketCap = searchParams.get('marketCap');
    const additionalInfo = searchParams.get('additionalInfo');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (status && status !== 'ALL') {
        where.status = status;
    }
    if (name) {
        where.name = { contains: name };
    }
    if (description) {
        where.description = { contains: description };
    }
    if (products) {
        where.products = { contains: products };
    }
    if (featured === 'true') {
        where.featured = true;
    } else if (featured === 'false') {
        where.featured = false;
    }
    if (newExhibitor === 'true') {
        where.newExhibitor = true;
    } else if (newExhibitor === 'false') {
        where.newExhibitor = false;
    }
    if (sponsoring) {
        where.sponsoring = { not: 'No' };
    }
    if (employees) {
        where.numberOfEmployees = { contains: employees };
    }
    if (marketCap) {
        where.marketCap = { contains: marketCap };
    }
    if (additionalInfo) {
        where.additionalInfo = { contains: additionalInfo };
    }

    const companies = await prisma.company.findMany({
        where,
        orderBy: { name: 'asc' },
    });

    return NextResponse.json(companies);
}
