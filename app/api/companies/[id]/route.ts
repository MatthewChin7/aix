import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!['NONE', 'WISHLIST', 'REJECTED'].includes(status)) {
        return NextResponse.json(
            { error: 'Invalid status. Must be NONE, WISHLIST, or REJECTED' },
            { status: 400 }
        );
    }

    const company = await prisma.company.update({
        where: { id: parseInt(id) },
        data: { status },
    });

    return NextResponse.json(company);
}
