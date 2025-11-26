import type { KnowledgeCard } from '@/types';

const conceptDatabase: Record<string, { title: string; summary: string }[]> = {
  // 数学相关
  '线性代数': [
    { title: '矩阵乘法', summary: '矩阵乘法是线性代数中的核心运算，要求第一个矩阵的列数等于第二个矩阵的行数。结果矩阵的每个元素是对应行与列的点积。' },
    { title: '行列式', summary: '行列式是一个标量值，可以从方阵的元素计算而来，它编码了矩阵所表示的线性变换的某些特性。' },
    { title: '线性方程组', summary: '线性方程组是由多个线性方程组成的系统，可以用矩阵和向量的形式表示，并通过高斯消元法等方法求解。' }
  ],
  '特征值与特征向量': [
    { title: '特征值', summary: '特征值是线性变换中只被标量缩放而不改变方向的向量的缩放因子。' },
    { title: '特征向量', summary: '特征向量是在线性变换下方向保持不变的非零向量，仅被特征值缩放。' },
    { title: '对角化', summary: '如果一个矩阵与对角矩阵相似，则称其可对角化。可对角化矩阵的特征向量构成空间的一组基。' }
  ],
  '微积分': [
    { title: '导数', summary: '导数表示函数在某一点的变化率，几何上对应函数曲线在该点的切线斜率。' },
    { title: '积分', summary: '积分是导数的逆运算，分为定积分和不定积分，定积分表示曲线下的面积。' },
    { title: '极限', summary: '极限描述了函数在自变量趋近于某一值时的行为，是微积分的基础概念。' }
  ],
  '导数': [
    { title: '链式法则', summary: '链式法则用于计算复合函数的导数，即外层函数导数乘以内层函数导数。' },
    { title: '乘积法则', summary: '乘积法则用于计算两个函数乘积的导数，即第一个函数导数乘以第二个函数加上第一个函数乘以第二个函数导数。' },
    { title: '高阶导数', summary: '高阶导数是对函数多次求导的结果，二阶导数表示导数的变化率，反映函数的凹凸性。' }
  ],

  // 计算机科学相关
  '数据结构': [
    { title: '数组', summary: '数组是连续内存中存储相同类型元素的数据结构，支持随机访问，但插入删除效率较低。' },
    { title: '链表', summary: '链表是通过指针链接的节点序列，支持高效的插入删除操作，但访问效率较低。' },
    { title: '栈', summary: '栈是遵循后进先出(LIFO)原则的数据结构，主要操作包括压入(push)和弹出(pop)。' }
  ],
  '算法': [
    { title: '排序算法', summary: '排序算法用于将数据按特定顺序排列，常见的有冒泡排序、快速排序、归并排序等。' },
    { title: '搜索算法', summary: '搜索算法用于在数据结构中查找特定元素，常见的有线性搜索、二分搜索等。' },
    { title: '动态规划', summary: '动态规划是一种通过将问题分解为子问题并保存中间结果来解决复杂问题的方法。' }
  ],
  '数据库': [
    { title: 'SQL', summary: '结构化查询语言(SQL)是用于管理关系数据库的标准语言，支持数据查询、插入、更新和删除。' },
    { title: '索引', summary: '索引是数据库中用于加速查询的数据结构，类似于书籍的目录。' },
    { title: '事务', summary: '事务是数据库操作的基本单位，具有原子性、一致性、隔离性和持久性(ACID)特性。' }
  ],

  // 自然科学相关
  '光合作用': [
    { title: '光反应', summary: '光反应发生在叶绿体类囊体膜上，将光能转化为化学能(ATP和NADPH)，同时产生氧气。' },
    { title: '卡尔文循环', summary: '卡尔文循环发生在叶绿体基质中，利用光反应产生的ATP和NADPH将二氧化碳固定为有机物。' },
    { title: '叶绿体结构', summary: '叶绿体是进行光合作用的细胞器，由外膜、内膜、类囊体和基质组成。' }
  ],
  '细胞呼吸': [
    { title: '糖酵解', summary: '糖酵解是细胞呼吸的第一阶段，在细胞质中进行，将葡萄糖分解为丙酮酸并产生少量ATP。' },
    { title: '三羧酸循环', summary: '三羧酸循环在线粒体基质中进行，将丙酮酸彻底氧化分解为二氧化碳，产生大量还原当量。' },
    { title: '氧化磷酸化', summary: '氧化磷酸化在线粒体内膜上进行，通过电子传递链和ATP合酶产生大量ATP。' }
  ],
  '牛顿运动定律': [
    { title: '牛顿第一定律', summary: '牛顿第一定律又称惯性定律，物体在不受外力或合力为零时保持静止或匀速直线运动状态。' },
    { title: '牛顿第二定律', summary: '牛顿第二定律表示合力等于质量乘以加速度(F=ma)，描述了力与运动的关系。' },
    { title: '牛顿第三定律', summary: '牛顿第三定律表示作用力与反作用力大小相等、方向相反、作用在同一直线上。' }
  ],

  // 人文社科相关
  '西方艺术史': [
    { title: '文艺复兴', summary: '文艺复兴是14-16世纪欧洲的一场文化运动，强调人文主义和古典文化复兴，代表人物有达芬奇、米开朗基罗等。' },
    { title: '印象派', summary: '印象派是19世纪后期的艺术流派，强调对光线和色彩的捕捉，代表人物有莫奈、雷诺阿等。' },
    { title: '现代主义', summary: '现代主义是20世纪初的艺术运动，反对传统艺术形式，追求创新和实验，代表人物有毕加索、康定斯基等。' }
  ],
  '心理学': [
    { title: '认知心理学', summary: '认知心理学研究人类的认知过程，包括注意、感知、记忆、思维和语言等。' },
    { title: '行为主义', summary: '行为主义强调可观察的行为，认为行为是通过学习和环境刺激形成的，代表人物有华生、斯金纳等。' },
    { title: '精神分析', summary: '精神分析由弗洛伊德创立，强调潜意识和早期经验对行为的影响，包括本我、自我、超我等概念。' }
  ],

  // 默认 fallback
  'default': [
    { title: '基础知识', summary: '这是一个重要的基础知识概念，理解它对于掌握相关领域至关重要。' },
    { title: '核心原理', summary: '这个核心原理是该领域的基础，深入理解它有助于建立完整的知识体系。' },
    { title: '实践应用', summary: '将理论知识应用于实践是学习的关键环节，通过实际操作可以加深理解。' }
  ]
};

export async function generateRelatedConcepts(topic: string): Promise<KnowledgeCard[]> {
  // 模拟AI思考延迟
  await new Promise(resolve => setTimeout(resolve, 1500));

  // 查找相关概念
  const lowerTopic = topic.toLowerCase();
  let relatedConcepts = conceptDatabase.default;

  // 在数据库中查找匹配的主题
  for (const key in conceptDatabase) {
    if (key.toLowerCase().includes(lowerTopic) || lowerTopic.includes(key.toLowerCase())) {
      relatedConcepts = conceptDatabase[key];
      break;
    }
  }

  // 如果找到匹配的主题但只有1-2个概念，补充默认概念
  if (relatedConcepts.length < 3) {
    const defaultConcepts = conceptDatabase.default;
    while (relatedConcepts.length < 3) {
      const randomConcept = defaultConcepts[Math.floor(Math.random() * defaultConcepts.length)];
      if (!relatedConcepts.find(c => c.title === randomConcept.title)) {
        relatedConcepts.push(randomConcept);
      }
    }
  }

  // 转换为KnowledgeCard格式
  return relatedConcepts.map((concept, index) => ({
    id: `${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
    title: concept.title,
    summary: concept.summary,
    status: 'pending',
    createdAt: new Date()
  }));
}