import React, { useState } from 'react';

export default function Home() {
	const [text, setText] = useState('');
	const [result, setResult] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [copySuccess, setCopySuccess] = useState<string | null>(null);
	const [selectedModel, setSelectedModel] = useState<string>('');

	function wordCount(s: string) {
		return s.trim() === '' ? 0 : s.trim().split(/\s+/).length;
	}

	function estimateTokensFromWords(words: number) {
		return Math.ceil(words / 0.75);
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setResult(null);

		const wc = wordCount(text);
		const tokens = estimateTokensFromWords(wc);
		if (wc === 0) {
			setError('Please enter some text to rewrite.');
			return;
		}
		if (wc > 250 || tokens > 250) {
			setError('Please limit input to 250 words / ~250 tokens.');
			return;
		}

		setLoading(true);
		try {
			const res = await fetch('/api/rewrite', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text, selectedModel }),
			});
			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				throw new Error(body.error || 'API request failed');
			}
			const data = await res.json();
			setResult(data.rewritten);
		} catch (err: any) {
			setError(err.message || 'Unexpected error');
		} finally {
			setLoading(false);
		}
	}

	async function copyResult() {
		if (!result) return;
		try {
			await navigator.clipboard.writeText(result);
			setCopySuccess('Copied!');
			setTimeout(() => setCopySuccess(null), 2000);
		} catch (e) {
			setCopySuccess('Copy failed');
			setTimeout(() => setCopySuccess(null), 2000);
		}
	}

	const wc = wordCount(text);
	const estTokens = estimateTokensFromWords(wc);
	const tooLong = wc > 250 || estTokens > 250;

	return (
		<div className='min-h-screen flex items-center justify-center p-6'>
			<div className='w-full max-w-3xl bg-white rounded-xl shadow-md p-6'>
				<h1 className='text-2xl font-semibold mb-4'>AI Text Rewriter</h1>
				<form onSubmit={handleSubmit}>
					<label className='block text-sm font-medium text-gray-700'>
						Enter text (approx. 250 tokens)
					</label>
					<textarea
						value={text}
						onChange={(e) => setText(e.target.value)}
						rows={8}
						className='mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
						aria-label='Text to rewrite'
					/>

					<div className='mt-2 flex items-center justify-between text-sm text-gray-600'>
						<div>
							Words: {wc} • Est. tokens: {estTokens}
						</div>
						<div className='text-xs text-gray-500'>
							We estimate tokens from words (approx).
						</div>
					</div>

					{tooLong && (
						<p className='mt-2 text-sm text-red-600'>
							Input exceeds 250-word/token limit.
						</p>
					)}
					{error && <p className='mt-3 text-sm text-red-600'>{error}</p>}

					<div className='mt-4 flex gap-3 items-center'>
						<details className='dropdown'>
							<summary className='btn'>
								{selectedModel === '' ? 'Select Model' : selectedModel}
							</summary>
							<ul className='menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm'>
								<li>
									<a
										onClick={(event) => {
											setSelectedModel('gpt-3.5-turbo');
										}}
									>
										gpt-3.5-turbo
									</a>
								</li>
								<li>
									<a
										onClick={(event) => {
											setSelectedModel('gpt-4');
										}}
									>
										gpt-4
									</a>
								</li>
							</ul>
						</details>

						<button
							type='submit'
							className='inline-flex items-center px-4 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-60'
							disabled={loading || tooLong}
						>
							{loading ? 'Rewriting...' : 'Rewrite Text'}
						</button>

						<button
							type='button'
							className='inline-flex items-center px-4 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200'
							onClick={() => {
								setText('');
								setResult(null);
								setError(null);
							}}
						>
							Clear
						</button>
					</div>
				</form>

				{result && (
					<div className='mt-6'>
						<h2 className='text-lg font-medium mb-2'>Rewritten Text</h2>
						<div className='whitespace-pre-wrap p-4 bg-gray-50 border border-gray-200 rounded-md'>
							{result}
						</div>

						<div className='mt-3 flex items-center gap-3'>
							<button
								className='inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700'
								onClick={copyResult}
							>
								Copy
							</button>
							<button
								className='inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200'
								onClick={() => {
									setResult(null);
								}}
							>
								Hide
							</button>
							{copySuccess && (
								<div className='text-sm text-gray-600'>{copySuccess}</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
