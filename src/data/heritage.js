/**
 * 非遗项目模拟数据
 * 每个对象代表一个非遗项目，包含展示所需的所有信息
 */
export const heritageList = [
  {
    id: 1,
    name: '京剧',
    category: '传统戏剧',
    region: '北京',
    year: 2010,
    description: '京剧是中国影响最大的戏曲剧种，以北京为中心，遍及全国各地。它融合了徽剧、汉剧、秦腔、昆曲等多种戏曲精华，形成了唱、念、做、打并重的完整表演体系。被誉为"国粹"和"东方歌剧"。',
    image: import.meta.env.BASE_URL + 'images/peking-opera.jpg',
    features: ['唱念做打', '脸谱艺术', '生旦净丑', '西皮二黄'],
    origin: '清朝乾隆年间（1790年），四大徽班进京为乾隆皇帝祝寿，随后融合各家之长，逐渐形成了京剧。',
    timeline: [
      { year: '1790年', text: '四大徽班进京为乾隆祝寿，京剧雏形初现' },
      { year: '1840年', text: '京剧正式形成，融合徽剧、汉剧、秦腔、昆曲之长' },
      { year: '1919年', text: '梅兰芳率团赴日演出，京剧首次走向世界' },
      { year: '2010年', text: '被列入联合国人类非物质文化遗产代表作名录' }
    ]
  },
  {
    id: 2,
    name: '景德镇手工制瓷技艺',
    category: '传统技艺',
    region: '江西景德镇',
    year: 2006,
    description: '景德镇手工制瓷技艺是中国陶瓷文化的杰出代表。从原料开采、坯料配制、成型、施釉到烧成，每道工序都有独特的技艺要求。景德镇瓷器"白如玉、明如镜、薄如纸、声如磬"，享誉世界。',
    image: import.meta.env.BASE_URL + 'images/jingdezhen-porcelain.jpg',
    features: ['拉坯成型', '青花绘制', '釉下五彩', '玲珑剔透'],
    origin: '景德镇制瓷始于汉代，宋代青白瓷闻名天下。元代设"浮梁瓷局"，明代成为全国制瓷中心，清代达到巅峰。',
    timeline: [
      { year: '汉代', text: '景德镇地区开始烧制陶瓷' },
      { year: '宋代', text: '青白瓷闻名天下，"景德"年号得名' },
      { year: '元代', text: '设"浮梁瓷局"，青花瓷技术成熟' },
      { year: '明清', text: '成为全国制瓷中心，技艺达到巅峰' }
    ]
  },
  {
    id: 3,
    name: '中国剪纸',
    category: '传统美术',
    region: '全国各地',
    year: 2009,
    description: '中国剪纸是用剪刀或刻刀在纸上剪刻花纹，用于装点生活的民间艺术。其风格多样，北方粗犷豪放，南方玲珑剔透。剪纸艺术蕴含丰富的民俗文化内涵，是中华民族重要的非物质文化遗产。',
    image: import.meta.env.BASE_URL + 'images/paper-cutting.jpg',
    features: ['窗花', '门笺', '喜花', '皮影'],
    origin: '剪纸艺术起源于汉代，已有两千多年历史。最初用于祭祀和祈福，后逐渐发展为装饰艺术。',
    timeline: [
      { year: '汉代', text: '造纸术改进，剪纸艺术开始萌芽' },
      { year: '南北朝', text: '剪纸用于祭祀和祈福，民间广泛流传' },
      { year: '唐宋', text: '剪纸发展为装饰艺术，出现专业艺人' },
      { year: '2009年', text: '被列入联合国人类非物质文化遗产代表作名录' }
    ]
  },
  {
    id: 4,
    name: '昆曲',
    category: '传统戏剧',
    region: '江苏苏州',
    year: 2001,
    description: '昆曲是中国最古老的剧种之一，被称为"百戏之祖"。其唱腔婉转细腻，表演载歌载舞，文学与音乐高度结合。2001年被联合国教科文组织列为首批"人类口述和非物质遗产代表作"。',
    image: import.meta.env.BASE_URL + 'images/kunqu-opera.jpg',
    features: ['水磨调', '折子戏', '工尺谱', '载歌载舞'],
    origin: '昆曲起源于元末明初（14世纪）的江苏昆山，由昆山人顾坚创始，后经魏良辅改革，形成完整的艺术体系。',
    timeline: [
      { year: '元末明初', text: '昆山人顾坚创始昆山腔，昆曲雏形诞生' },
      { year: '明代中期', text: '魏良辅改革唱腔，创立"水磨调"，形成完整体系' },
      { year: '明末清初', text: '昆曲达到鼎盛，成为全国性剧种' },
      { year: '2001年', text: '被列为首批"人类口述和非物质遗产代表作"' }
    ]
  },
  {
    id: 5,
    name: '蜀绣',
    category: '传统美术',
    region: '四川成都',
    year: 2006,
    description: '蜀绣是中国四大名绣之一，以软缎和彩丝为主要原料，针法多达130余种。蜀绣作品构图精美，色彩艳丽，富有立体感。双面绣、异色绣等技艺尤为精湛。',
    image: import.meta.env.BASE_URL + 'images/shu-embroidery.jpg',
    features: ['双面绣', '异色绣', '丝线染色', '锦纹针'],
    origin: '蜀绣起源于川西民间，最早可追溯到三星堆文明时期。汉代已相当发达，唐代成为贡品。',
    timeline: [
      { year: '古蜀时期', text: '三星堆文明中已见刺绣痕迹，蜀绣雏形诞生' },
      { year: '汉代', text: '蜀绣工艺已相当发达，名扬天下' },
      { year: '唐代', text: '成为贡品，针法日益丰富' },
      { year: '2006年', text: '被列入国家级非物质文化遗产名录' }
    ]
  },
  {
    id: 6,
    name: '太极拳',
    category: '传统体育',
    region: '河南温县',
    year: 2020,
    description: '太极拳是中国传统武术的瑰宝，以中国传统太极、阴阳辩证理念为核心思想，集颐养性情、强身健体、技击对抗等多种功能为一体。2020年被列入联合国教科文组织人类非物质文化遗产代表作名录。',
    image: import.meta.env.BASE_URL + 'images/tai-chi.jpg',
    features: ['阴阳平衡', '以柔克刚', '缠丝劲', '推手'],
    origin: '太极拳起源于明末清初，由河南温县陈家沟陈王廷创编，融合了中医经络学说、导引吐纳之术和武术搏击技巧。',
    timeline: [
      { year: '明末清初', text: '河南温县陈家沟陈王廷创编太极拳' },
      { year: '清代', text: '太极拳在陈氏家族中代代传承，流派渐丰' },
      { year: '民国时期', text: '太极拳走向全国，成为大众健身方式' },
      { year: '2020年', text: '被列入联合国人类非物质文化遗产代表作名录' }
    ]
  }
]

// 所有分类（去重）
export const categories = [...new Set(heritageList.map(item => item.category))]
