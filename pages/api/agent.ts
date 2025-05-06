
import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { getPromptTemplate } from '../../utils/prompts';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed.' });
  }

  const { task, agentRole, context } = req.body;

  if (!task || !agentRole) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const prompt = getPromptTemplate(agentRole, task, context || '');

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: prompt }],
    });

    const output = completion.choices[0].message?.content;
    res.status(200).json({ output });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'OpenAI API error' });
  }
}
