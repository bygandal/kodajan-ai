
import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';
import { getPromptTemplate } from '../../utils/prompts';

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });

  const { task, agentRole, context } = req.body;
  const prompt = getPromptTemplate(agentRole, task, context);

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'system', content: prompt }],
    });

    const output = completion.data.choices[0].message?.content;
    res.status(200).json({ output });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
