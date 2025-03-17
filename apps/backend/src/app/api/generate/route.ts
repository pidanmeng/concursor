import { NextRequest } from 'next/server'
import { createDeepSeek } from '@ai-sdk/deepseek';
import { streamText } from 'ai'

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? '',
});

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  const { prompt } = await req.json()
  
  // 改为英文
  const systemPrompt = `You are a Cursor Rules generation expert. Please generate a high-quality Cursor Rule based on the user's description.
The rule must be generated strictly in the following YAML format, so that the system can parse it correctly:

\`\`\`yaml
title: A concise title of the rule, 3-5 words
description: A concise sentence describing the purpose of the rule
content: |
  The detailed content of the rule, which can include multiple sections, best practices, and code examples
\`\`\`

Please ensure that the generated rule:
1. title is concise and clear, and can clearly express the theme of the rule
2. description is a complete sentence, describing the main purpose of the rule
3. content uses a vertical line (|) and indents, ensuring that the multi-line content is formatted correctly
4. content is well-structured, with clear paragraphs, complete code examples
5. content follows industry best practices
6. content is atomic, focusing on solving a single problem or scenario

Please output the YAML format directly, without adding any additional text or explanations.
`

  // 创建并返回流式响应
  const result = await streamText({
    model: deepseek('deepseek-chat'),
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    maxTokens: 2000,
  })

  return result.toDataStreamResponse()
} 