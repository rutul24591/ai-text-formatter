import type { NextApiRequest, NextApiResponse } from 'next';

type Data = { rewritten?: string; error?: string };

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>,
) {
	if (req.method !== 'POST') {
		res.setHeader('Allow', 'POST');
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const { text } = req.body as {
		text?: string;
	};

	const { selectedModel = 'gpt-3.5-turbo' } = req.body as {
		selectedModel?: string;
	};

	if (!text || typeof text !== 'string') {
		return res.status(400).json({ error: 'Missing `text` in request body' });
	}

	const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
	if (wordCount === 0) return res.status(400).json({ error: 'Input is empty' });
	if (wordCount > 250)
		return res.status(400).json({ error: 'Input exceeds 250 words limit' });

	const prompt = `Rewrite the following text to improve clarity, grammar, and style while preserving meaning. Keep it concise and natural:\n\n${text}`;

	try {
		const apiKey = process.env.OPENAI_API_KEY;
		if (!apiKey)
			return res
				.status(500)
				.json({ error: 'OpenAI API key not configured in server.' });

		const completion = await fetch(
			'https://api.openai.com/v1/chat/completions',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${apiKey}`,
				},
				body: JSON.stringify({
					// model: 'gpt-5.1', //gpt-3.5-turbo
					model: selectedModel || 'gpt-3.5-turbo',
					messages: [
						{
							role: 'system',
							content:
								'You are a helpful assistant that rewrites text to improve clarity, grammar, and style while preserving original meaning.',
						},
						{ role: 'user', content: prompt },
					],
					// max_completion_tokens: 800, // for 5.1
					max_tokens: 800,
					// max_output_tokens: 800,
					temperature: 0.7,
				}),
			},
		);

		if (!completion.ok) {
			const textBody = await completion.text();
			return res.status(500).json({ error: `OpenAI API error: ${textBody}` });
		}

		const data = await completion.json();
		const content = data?.choices?.[0]?.message?.content;
		if (!content)
			return res.status(500).json({ error: 'No content returned from OpenAI' });

		return res.status(200).json({ rewritten: content });
	} catch (err: any) {
		return res.status(500).json({ error: err.message || 'Unknown error' });
	}
}
