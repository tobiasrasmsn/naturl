import { NextResponse } from 'next/server';
import { getClient } from '@/lib/db';
import { z } from 'zod';

const voteSchema = z.object({
    idea_id: z.number(),
    vote_type: z.enum(['upvote', 'downvote']),
    author_id: z.string(),
});

export async function POST(request: Request) {
    const client = await getClient();
    try {
        const body = await request.json();
        const validatedData = voteSchema.parse(body);
        const { idea_id, vote_type, author_id } = validatedData;

        await client.query('BEGIN');

        const ideaResult = await client.query(
            'SELECT author_id FROM ideas WHERE id = $1',
            [idea_id]
        );

        if (ideaResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return NextResponse.json(
                { success: false, error: 'Idea not found' },
                { status: 404 }
            );
        }

        const vote_change = vote_type === 'upvote' ? 1 : -1;

        // Check if user has already voted
        const existingVoteResult = await client.query(
            'SELECT vote FROM idea_votes WHERE idea_id = $1 AND author_id = $2',
            [idea_id, author_id]
        );

        if (existingVoteResult.rows.length > 0) {
            const existingVote = existingVoteResult.rows[0].vote;
            if (existingVote === vote_change) {
                // User is casting the same vote again, so we can either ignore or return an error
                await client.query('ROLLBACK');
                return NextResponse.json(
                    {
                        success: false,
                        error: 'You have already cast this vote.',
                    },
                    { status: 409 }
                );
            } else {
                // User is changing their vote
                await client.query(
                    'UPDATE idea_votes SET vote = $1 WHERE idea_id = $2 AND author_id = $3',
                    [vote_change, idea_id, author_id]
                );
                await client.query(
                    'UPDATE ideas SET votes = votes + $1 WHERE id = $2',
                    [vote_change * 2, idea_id]
                ); // Reversing the old vote and adding the new one
            }
        } else {
            // New vote
            await client.query(
                'INSERT INTO idea_votes (idea_id, author_id, vote) VALUES ($1, $2, $3)',
                [idea_id, author_id, vote_change]
            );
            await client.query(
                'UPDATE ideas SET votes = votes + $1 WHERE id = $2',
                [vote_change, idea_id]
            );
        }

        const updatedIdea = await client.query(
            'SELECT votes FROM ideas WHERE id = $1',
            [idea_id]
        );

        await client.query('COMMIT');

        return NextResponse.json({
            success: true,
            votes: updatedIdea.rows[0].votes,
        });
    } catch (error) {
        await client.query('ROLLBACK');
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: 'Invalid input.' },
                { status: 400 }
            );
        }
        console.error('Error processing vote:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to process vote' },
            { status: 500 }
        );
    } finally {
        client.release();
    }
}
