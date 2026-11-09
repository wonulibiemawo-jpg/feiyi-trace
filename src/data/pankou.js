export const sources = {
  city: 'https://www.shanghai.gov.cn/nw23216/20200820/0001-23216_19050.html',
  culture: 'https://www.meet-in-shanghai.net/cn/intangible-cultural-heritage/chinese-clothing-buckle-making-skills-729885/',
}

export const categories = ['直角扣', '琵琶扣', '花扣']

export const works = [
  { id: 'straight', name: '一字扣', category: '直角扣', art: 0, course: 'cord', feature: '横向轮廓简洁，扣头与扣环分置两侧。', use: '适合用于观察衣襟的基础开合结构。' },
  { id: 'corner', name: '直角扣结构示意', category: '直角扣', art: 1, course: 'cord', feature: '布条转折后形成清楚的边角。', use: '用于比较转角位置与衣襟边缘的关系。' },
  { id: 'pipa', name: '琵琶扣', category: '琵琶扣', art: 2, course: 'pipa', feature: '窄端与宽端相连，轮廓近似琵琶。', use: '可在中式服装衣襟上兼顾开合与装饰。' },
  { id: 'pipa-layer', name: '双层琵琶轮廓', category: '琵琶扣', art: 3, course: 'pipa', feature: '在外轮廓内再排一圈，便于观察相邻布条间距。', use: '用于练习较规整的内外两层盘形。' },
  { id: 'flower', name: '花瓣扣', category: '花扣', art: 4, course: 'flower', feature: '布条绕出连续的花瓣形。', use: '可作为衣襟的花形装饰。' },
  { id: 'butterfly', name: '蝴蝶形盘扣', category: '花扣', art: 5, course: 'flower', feature: '左右两侧盘出展开的翼形。', use: '用于比较对称造型的幅度和落点。' },
  { id: 'leaf', name: '叶片形盘扣', category: '花扣', art: 6, course: 'flower', feature: '布条由圆弧过渡到收尖的端部。', use: '用于练习衣襟装饰中的曲线与尖角。' },
  { id: 'cloud', name: '云纹造型练习', category: '花扣', art: 7, course: 'flower', feature: '数段弧线依次回卷，形成连贯的起伏。', use: '用于观察回卷线条的节奏与间距。' },
  { id: 'twin', name: '双环造型练习', category: '花扣', art: 8, course: 'flower', feature: '两个相连的环形形成简洁的重复轮廓。', use: '用于练习保持相邻弧线大小一致。' },
  { id: 'plum', name: '梅瓣造型练习', category: '花扣', art: 9, course: 'flower', feature: '围绕中心排出数个大小接近的花瓣。', use: '用于观察中心点与花瓣的位置关系。' },
]

export const courses = [
  {
    id: 'cord', name: '布条准备与试扣', intro: '从认识扣头和扣环开始，做一次基础开合练习。',
    supplies: '练习布条、针线、剪刀、尺、纸样', art: 0,
    steps: [
      { title: '准备练习布条', body: '用尺在练习布上标出等宽的长条，剪下后把两侧毛边向内折，试着缝成宽度均匀的布条。', tip: '先用废布试缝，检查折边是否包住毛边。', art: 0 },
      { title: '比对扣头与扣环', body: '用练习布条试出扣环，把已备好的扣头放在旁边比较，按实际大小调整环口。', tip: '用样布测试能否穿过环口，并检查扣合后是否容易滑出。', art: 8 },
      { title: '在样布上测试', body: '将扣头与扣环分别定位在两块样布边缘，临时缝住，再合拢并解开几次。', tip: '两侧位置应相互对齐，开合时留意布面是否起皱。', art: 1 },
    ],
  },
  {
    id: 'pipa', name: '琵琶轮廓练习', intro: '沿着窄口与宽腹的轮廓，练习均匀盘绕。',
    supplies: '练习布条、针线、纸样、定位用夹子', art: 2,
    steps: [
      { title: '在纸样上标出外形', body: '画出上窄下宽的轮廓，标出起点、窄口和最宽处。', tip: '先检查两侧轮廓是否顺畅。', art: 2 },
      { title: '从外圈盘到内圈', body: '把布条沿外轮廓放好，再沿相邻的一圈往里绕，必要时用夹子临时定位。', tip: '转弯时放慢动作，让内外圈尽量保持均匀的间距。', art: 3 },
      { title: '从背面固定', body: '检查正面轮廓后，在相邻布条的接触处从背面点缝固定，再处理末端。', tip: '边固定边检查轮廓，避免拉线过紧使宽腹变形。', art: 3 },
    ],
  },
  {
    id: 'flower', name: '花瓣盘绕练习', intro: '用重复弧线练习控制花瓣大小和位置。',
    supplies: '练习布条、针线、纸样、定位用夹子', art: 4,
    steps: [
      { title: '标记中心与瓣尖', body: '在纸样上标出中心点和各瓣尖的位置，先确认花瓣间距。', tip: '中心点和瓣尖可作为摆放布条的参照。', art: 4 },
      { title: '逐瓣回绕', body: '将布条从中心附近引向瓣尖，顺着弧线折返，再绕下一瓣。', tip: '绕好一瓣就对照纸样检查，避免误差累积。', art: 9 },
      { title: '整理并固定造型', body: '检查花瓣的大小和排布，整理接触处，再从背面点缝固定。', tip: '先调整线条，再固定末端。', art: 9 },
    ],
  },
]

const questionRows = [
  ['cord', '盘扣在中式服装上常用来做什么？', '固定衣襟并作装饰', '只用来标注尺寸', '代替衣料', '盘扣兼具服装开合和装饰作用。'],
  ['cord', '上海市级名录中，该技艺由哪个区申报？', '徐汇区', '浦东新区', '金山区', '上海市第二批非遗名录列出的申报地区为徐汇区。'],
  ['cord', '该技艺是哪一年公布为上海市级非遗的？', '2009年', '2019年', '1999年', '上海市人民政府于2009年公布第二批上海市非遗名录。'],
  ['cord', '扣头与扣环的关系是什么？', '扣头穿过扣环实现扣合', '两者叠成相同的扣头', '扣环用于遮住线迹', '扣头和扣环配合完成开合。'],
  ['cord', '练习布条时如何处理毛边？', '向内折入再试缝', '把毛边拉长', '只折一端', '把两侧毛边折入，有助于保持布条整洁。'],
  ['cord', '试扣环大小时应参照什么？', '实际使用的扣头', '纸样宽度', '尺子的长度', '扣环开口要和实际扣头匹配。'],
  ['cord', '临时缝住后先做什么？', '反复开合检查', '把扣环剪开', '立刻剪掉样布', '开合测试可以发现错位、过松或拉皱。'],
  ['cord', '网站的步骤进度代表什么？', '已查看的学习内容', '已通过专业考核', '已完成实物制作', '网站只记录步骤浏览情况。'],
  ['pipa', '琵琶扣的轮廓有什么特点？', '一端较窄，另一端较宽', '整条始终笔直', '由四个直角围成', '窄口和宽腹是这一练习的观察重点。'],
  ['pipa', '练习琵琶轮廓时第一步是什么？', '在纸样上标出外形', '直接缝死末端', '剪断内圈', '先标出起点、窄口和最宽处，再放置布条。'],
  ['pipa', '内外圈之间应注意什么？', '间距尽量均匀', '内外圈始终重叠', '转弯处留出断口', '平稳转弯有助于控制相邻布条的间距。'],
  ['pipa', '如何减少正面的明显线迹？', '从背面点缝固定', '从正面反复打结', '用剪刀压住正面', '从背面点缝可以在保留轮廓的同时减少可见线迹。'],
  ['pipa', '拉线过紧可能导致什么？', '宽腹变形', '纸样自动变大', '扣头变成扣环', '固定时应反复检查正面轮廓，避免线把布条拉歪。'],
  ['pipa', '双层琵琶轮廓适合观察什么？', '内外两圈的间距', '花瓣中心的位置', '样布的厚度', '双层轮廓便于比较相邻布条的距离。'],
  ['flower', '花瓣练习如何确定各瓣位置？', '先标出中心和瓣尖', '只标布条尾端', '盘完再决定中心', '中心和瓣尖是摆放布条时的参照。'],
  ['flower', '花瓣盘绕的基本动作是什么？', '布条向瓣尖伸出后折返', '将布条剪成不相连的小段', '用尺把所有弧线压直', '先沿一个弧线伸出再折返，就可以接着绕下一瓣。'],
  ['flower', '花瓣大小不一时应何时调整？', '固定前对照纸样调整', '固定末端后强拉', '在剪掉花瓣后调整', '逐瓣比对和固定前检查都能减少变形。'],
  ['flower', '蝴蝶形盘扣示意适合观察什么？', '左右翼形的对称关系', '钮环是否容易穿过', '纸样上的缝份', '蝴蝶形可以用来比较左右弧线的幅度和落点。'],
  ['flower', '花形练习末端应何时固定？', '整理并检查轮廓后', '画纸样之前', '绕第一瓣之前', '先调整造型再固定，能避免末端妨碍修整。'],
  ['flower', '下面哪一种是文旅资料介绍的盘扣样式大类？', '花扣', '拉链', '暗袋', '文旅资料将盘扣样式概括为直角扣、琵琶扣、花扣。'],
]

export const questions = questionRows.map(([course, prompt, correct, wrongA, wrongB, explanation], index) => {
  const answer = index % 3
  const options = [wrongA, wrongB]
  options.splice(answer, 0, correct)
  return { id: index + 1, course, prompt, options, answer, explanation }
})

export const postTypes = ['作品分享', '制作求助']
export const postStatuses = { pending: '待审核', approved: '已通过', rejected: '已退回' }

export const seedPosts = [
  { id: 'first-knot', owner: 'sample', author: '练习档案', type: '作品分享', title: '第一次排出完整的琵琶轮廓', body: '我先沿纸样摆出外圈，再绕内圈。每绕一段就对着纸样看一下，最宽处比较容易跑偏。', images: [], status: 'approved', date: '示例帖子' },
  { id: 'flower-tips', owner: 'sample', author: '练习档案', type: '制作求助', title: '花瓣总是一边大一边小，可以怎么调整？', body: '我想练一对对称的花瓣，但绕到第二瓣时，第一瓣也会被布条扯歪。大家会在哪些地方先做临时定位？', images: [], status: 'approved', date: '示例帖子' },
]

export const seedEvents = [
  { id: 'open-studio', title: '一枚盘扣的起点', mode: '线下体验', location: '教学演示教室（模拟）', description: '认识扣头与扣环，练习准备布条与基础开合。', time: '2027-03-27T14:00', deadline: '2027-03-25T18:00', capacity: 12, status: 'open' },
  { id: 'pattern-online', title: '读懂盘扣的三种轮廓', mode: '线上分享', location: '线上演示会议（模拟）', description: '通过样式图比较直角扣、琵琶扣与花扣的轮廓。', time: '2027-04-10T15:00', deadline: '2027-04-08T18:00', capacity: 20, status: 'open' },
]
