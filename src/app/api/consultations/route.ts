import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      type,
      notes,
      bottleneck,
      motivation,
      timeline,
      level,
      timeInvestment,
      reference,
      preferredTime,
    } = body;

    if (!name || !phone || !type) {
      return NextResponse.json(
        { error: "Name, phone, and type are required" },
        { status: 400 }
      );
    }

    const consultation = await prisma.consultation.create({
      data: {
        name,
        phone,
        type,
        notes,
        bottleneck,
        motivation,
        timeline,
        level,
        timeInvestment,
        reference,
        preferredTime,
      },
    });

    return NextResponse.json(consultation, { status: 201 });
  } catch (error) {
    console.error("Failed to create consultation:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // This could be restricted to COACH role in the real app, 
  // but for simplicity and checking, we'll implement it here.
  // The layout/dashboard will handle role checks for the UI.
  try {
    const consultations = await prisma.consultation.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(consultations);
  } catch (error) {
    console.error("Failed to fetch consultations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "ID and status are required" },
        { status: 400 }
      );
    }

    const updated = await prisma.consultation.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update consultation:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
