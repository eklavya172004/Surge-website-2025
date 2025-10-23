import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { name, rating, feedback } = await req.json();

    // Validate required fields
    if (!feedback) {
      return new Response(
        JSON.stringify({ error: 'Feedback is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate rating if provided (should be between 1 and 5)
    if (rating !== undefined && rating !== 0 && (rating < 1 || rating > 5)) {
      return new Response(
        JSON.stringify({ error: 'Rating must be between 1 and 5' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Create the feedback record
    const createdFeedback = await prisma.feedback.create({
      data: {
        name: name || null, // Allow name to be optional
        rating: rating || 0,
        feedback,
      },
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Feedback submitted successfully',
        id: createdFeedback.id,
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error submitting feedback:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  try {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 100, // Limit to last 100 feedbacks
    });

    return new Response(JSON.stringify({ success: true, feedbacks }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } finally {
    await prisma.$disconnect();
  }
}