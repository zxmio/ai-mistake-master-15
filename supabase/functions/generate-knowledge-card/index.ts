import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

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
    const { subject, originalQuestion, knowledgePoints, cause, questionId } = await req.json();

    if (!knowledgePoints || knowledgePoints.length === 0) {
      return new Response(
        JSON.stringify({ error: '没有知识点数据' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build a prompt for generating a beautiful knowledge card image
    const knowledgeText = knowledgePoints.map((kp: any, i: number) => 
      `${i + 1}. ${kp.title}: ${kp.explanation}`
    ).join('\n');

    const subjectNames: Record<string, string> = {
      math: '数学',
      physics: '物理',
      chemistry: '化学',
      biology: '生物',
      chinese: '语文',
      english: '英语',
      history: '历史',
      geography: '地理',
      politics: '政治',
    };

    const subjectName = subjectNames[subject] || subject;

    const prompt = `生成一张精美的知识点学习卡片图片，要求：
- 整体风格：现代简约、教育主题、适合学生学习
- 卡片尺寸：适合手机屏幕查看的竖版卡片
- 顶部标题区域：显示"${subjectName}知识卡"，使用醒目的渐变色标题
- 主体内容区域：清晰展示以下知识点（用可视化的方式呈现，如图标、分隔线等）：
${knowledgeText}
- 配色方案：使用柔和的教育主题色彩（蓝色、紫色渐变）
- 底部：添加小提示"错题回顾 · AI智能分析"
- 整体要美观大方，文字清晰可读，适合保存分享

请生成这张知识点学习卡片。`;

    console.log('Generating knowledge card for subject:', subject);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-pro-image-preview',
        messages: [
          { role: 'user', content: prompt }
        ],
        modalities: ['image', 'text'],
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
          JSON.stringify({ error: 'AI服务额度不足' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: '图片生成服务暂时不可用' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('AI response received');

    // Extract the image from the response
    const images = data.choices?.[0]?.message?.images;
    
    if (!images || images.length === 0) {
      console.error('No image in response:', data);
      return new Response(
        JSON.stringify({ error: '未能生成图片' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const imageUrl = images[0]?.image_url?.url;

    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: '图片数据无效' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If questionId is provided, save the image to storage
    let savedImageUrl = imageUrl;
    
    if (questionId) {
      try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Convert base64 to blob
        const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, '');
        const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        
        const fileName = `knowledge-cards/${questionId}_${Date.now()}.png`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('question-images')
          .upload(fileName, binaryData, {
            contentType: 'image/png',
            upsert: true,
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('question-images')
            .getPublicUrl(fileName);
          savedImageUrl = publicUrl;
          console.log('Image saved to storage:', savedImageUrl);
        }
      } catch (storageError) {
        console.error('Storage error:', storageError);
        // Continue with base64 image if storage fails
      }
    }

    console.log('Knowledge card generated successfully');

    return new Response(
      JSON.stringify({ 
        imageUrl: savedImageUrl,
        isBase64: savedImageUrl.startsWith('data:'),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-knowledge-card function:', error);
    const errorMessage = error instanceof Error ? error.message : '生成过程中发生错误';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
