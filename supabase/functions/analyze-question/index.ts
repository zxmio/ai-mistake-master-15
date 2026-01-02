import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, subject, imageUrls } = await req.json();

    if (!content && (!imageUrls || imageUrls.length === 0)) {
      return new Response(
        JSON.stringify({ error: '请提供题目内容或图片' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `你是一位专业的学科教师和错题分析专家。请分析学生的错题并提供详细的指导。

请按照以下JSON格式返回分析结果：
{
  "cause": "错误原因分析（详细说明学生可能出错的原因）",
  "correctAnswer": "正确解答（完整的解题过程和答案）",
  "knowledgePoints": [
    {
      "title": "知识点标题",
      "explanation": "深入浅出、通俗易懂的知识点讲解",
      "examples": ["生动形象的例子1", "例子2"]
    }
  ],
  "similarQuestions": [
    {
      "question": "题目内容",
      "difficulty": "basic",
      "hint": "解题提示"
    },
    {
      "question": "题目内容",
      "difficulty": "medium",
      "hint": "解题提示"
    },
    {
      "question": "题目内容",
      "difficulty": "advanced",
      "hint": "解题提示"
    }
  ]
}

注意：
1. similarQuestions必须包含3道题：basic（基础）、medium（中等）、advanced（提高）各一道
2. 知识点讲解要生动形象，适合学生理解
3. 只返回JSON，不要有其他内容`;

    // Build user message with multimodal support for images
    let userMessageContent: any;
    
    if (imageUrls && imageUrls.length > 0) {
      // Use multimodal format for vision capability
      const textContent = `学科：${subject}\n题目内容：${content || '请仔细查看图片中的题目内容，分析学生的错误并提供详细指导。'}`;
      
      userMessageContent = [
        { type: 'text', text: textContent },
        ...imageUrls.map((url: string) => ({
          type: 'image_url',
          image_url: { url }
        }))
      ];
    } else {
      userMessageContent = `学科：${subject}\n题目内容：${content}`;
    }

    console.log('Analyzing question:', { 
      subject, 
      contentLength: content?.length, 
      imageCount: imageUrls?.length,
      hasImages: imageUrls && imageUrls.length > 0
    });

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-pro-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessageContent }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: '请求过于频繁，请稍后再试' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI服务额度不足，请联系管理员' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'AI分析服务暂时不可用' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const analysisText = data.choices?.[0]?.message?.content;

    if (!analysisText) {
      console.error('No content in AI response:', data);
      return new Response(
        JSON.stringify({ error: 'AI返回结果为空' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the JSON response
    let analysis;
    try {
      // Remove markdown code blocks if present - handle multiple formats
      let cleanedText = analysisText.trim();
      
      // Handle ```json ... ``` format
      if (cleanedText.startsWith('```')) {
        // Remove opening ``` or ```json
        cleanedText = cleanedText.replace(/^```(?:json)?\s*\n?/, '');
        // Remove closing ```
        cleanedText = cleanedText.replace(/\n?```\s*$/, '');
      }
      
      cleanedText = cleanedText.trim();
      analysis = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', analysisText);
      console.error('Parse error:', parseError);
      return new Response(
        JSON.stringify({ error: '解析AI响应失败', rawResponse: analysisText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analysis completed successfully');

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-question function:', error);
    const errorMessage = error instanceof Error ? error.message : '分析过程中发生错误';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
