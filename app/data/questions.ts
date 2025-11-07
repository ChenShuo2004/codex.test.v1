export type AnswerChoice = "A_PLUS" | "A" | "NEUTRAL" | "B" | "B_PLUS";

export const CHOICE_OPTIONS: { value: AnswerChoice; label: string; short: string }[] = [
  { value: "A_PLUS", label: "⭐⭐ 特别同意A", short: "A+" },
  { value: "A", label: "⭐ 比较同意A", short: "A" },
  { value: "NEUTRAL", label: "➖ 介于两者之间", short: "0" },
  { value: "B", label: "⭐ 比较同意B", short: "B" },
  { value: "B_PLUS", label: "⭐⭐ 特别同意B", short: "B+" },
];

export const CHOICE_SCORE: Record<AnswerChoice, number> = {
  A_PLUS: 2,
  A: 1,
  NEUTRAL: 0,
  B: -1,
  B_PLUS: -2,
};

export const CHOICE_TENDENCY: Record<AnswerChoice, "A" | "B" | "NEUTRAL"> = {
  A_PLUS: "A",
  A: "A",
  NEUTRAL: "NEUTRAL",
  B: "B",
  B_PLUS: "B",
};

export type Dimension =
  | "executing"
  | "influencing"
  | "relationship"
  | "strategic"
  | "composite";

export interface Question {
  id: number;
  title: string;
  optionA: string;
  optionB: string;
  dimension: Dimension;
  subDimension?: string;
}

export interface DimensionMeta {
  id: Dimension;
  title: string;
  description: string;
  range: [number, number];
  color: string;
}

export const DIMENSION_METADATA: DimensionMeta[] = [
  {
    id: "executing",
    title: "执行力域",
    description: "关注如何把事情做成，覆盖题目1-20",
    range: [-40, 40],
    color: "bg-orange-100 text-orange-900",
  },
  {
    id: "influencing",
    title: "影响力域",
    description: "关注如何推动他人做事，覆盖题目21-40",
    range: [-40, 40],
    color: "bg-amber-100 text-amber-900",
  },
  {
    id: "relationship",
    title: "关系建立域",
    description: "关注如何建立和维护关系，覆盖题目41-60",
    range: [-40, 40],
    color: "bg-sky-100 text-sky-900",
  },
  {
    id: "strategic",
    title: "战略思维域",
    description: "关注如何做决策与规划，覆盖题目61-85",
    range: [-50, 50],
    color: "bg-indigo-100 text-indigo-900",
  },
  {
    id: "composite",
    title: "综合评估题",
    description: "跨维度的整合题，覆盖题目86-100",
    range: [-30, 30],
    color: "bg-gray-100 text-gray-900",
  },
];

export interface SubDimensionMeta {
  id: string;
  dimension: Dimension;
  title: string;
  questionRange: [number, number];
  aMessage: string;
  bMessage: string;
  neutralMessage: string;
}

export const SUB_DIMENSIONS: SubDimensionMeta[] = [
  {
    id: "executing_drive",
    dimension: "executing",
    title: "驱动与成就",
    questionRange: [1, 5],
    aMessage: "你以完成任务为荣，具备持续的成就驱动力。",
    bMessage: "你更看重质量与节奏，在灵活进度里找到安全感。",
    neutralMessage: "你在结果与节奏之间寻找平衡，需要情境触发动力。",
  },
  {
    id: "executing_focus",
    dimension: "executing",
    title: "专注与纪律",
    questionRange: [6, 10],
    aMessage: "你习惯用计划和秩序维持产出，是团队的节奏锚。",
    bMessage: "你依赖直觉和灵活度应对变化，更适合动态环境。",
    neutralMessage: "你会视项目切换模式，必要时计划、必要时放松。",
  },
  {
    id: "executing_responsibility",
    dimension: "executing",
    title: "责任与承诺",
    questionRange: [11, 15],
    aMessage: "强烈的承诺感让你可信赖，适合扛住交付节点。",
    bMessage: "你在需要时会寻求支援，擅长共享责任。",
    neutralMessage: "你愿意承担义务，也会视资源调整承诺方式。",
  },
  {
    id: "executing_organization",
    dimension: "executing",
    title: "组织与安排",
    questionRange: [16, 20],
    aMessage: "你善于流程化推进工作，喜欢标准和统一节奏。",
    bMessage: "你擅长灵活处理事务，拥抱多元而非单一方法。",
    neutralMessage: "你能在秩序与灵活间切换，视任务特性决定策略。",
  },
  {
    id: "influencing_expression",
    dimension: "influencing",
    title: "说服与表达",
    questionRange: [21, 25],
    aMessage: "言语是你的主场，善于用故事激活听众。",
    bMessage: "你通过倾听与建议建立影响力，是信任放大的节点。",
    neutralMessage: "你能够在表达与倾听之间切换，依据对象挑选策略。",
  },
  {
    id: "influencing_leadership",
    dimension: "influencing",
    title: "领导力与主动性",
    questionRange: [26, 30],
    aMessage: "你天然具备掌舵者心态，乐于主动承担决策。",
    bMessage: "你以陪伴和支持换来信任，在幕后也能影响结果。",
    neutralMessage: "你会根据团队空缺决定何时站到前台。",
  },
  {
    id: "influencing_competition",
    dimension: "influencing",
    title: "竞争与成就感",
    questionRange: [31, 35],
    aMessage: "竞争激发你，目标是拉高天花板。",
    bMessage: "你重视协作与质量，更偏好稳健贡献。",
    neutralMessage: "你同时兼顾成绩与团队氛围。",
  },
  {
    id: "influencing_charm",
    dimension: "influencing",
    title: "说服与吸引",
    questionRange: [36, 40],
    aMessage: "你在社交场合自如，能迅速拉近距离。",
    bMessage: "你擅长深度交流，在小范围建立强关系。",
    neutralMessage: "你会挑选合适的社交策略。",
  },
  {
    id: "relationship_empathy",
    dimension: "relationship",
    title: "同理心与理解",
    questionRange: [41, 45],
    aMessage: "你以情绪雷达感知团队，擅长提供情感支持。",
    bMessage: "你用理性提炼洞察，帮助他人看清脉络。",
    neutralMessage: "你能在感性与理性同理之间自如切换。",
  },
  {
    id: "relationship_adaptability",
    dimension: "relationship",
    title: "适应性与开放性",
    questionRange: [46, 50],
    aMessage: "你乐于调整节奏去兼容他人，是团队润滑剂。",
    bMessage: "你坚持原则并提供稳定预期。",
    neutralMessage: "你既能坚持立场，也能在必要时让步。",
  },
  {
    id: "relationship_trust",
    dimension: "relationship",
    title: "建立信任与深层关系",
    questionRange: [51, 55],
    aMessage: "你追求深层连结，重视长期伙伴关系。",
    bMessage: "你享受独立与空间，偏好合作也保持界限。",
    neutralMessage: "你能在亲密与独立之间找到节奏。",
  },
  {
    id: "relationship_development",
    dimension: "relationship",
    title: "包容性与发展他人",
    questionRange: [56, 60],
    aMessage: "你擅长发掘他人潜力，是典型教练型人才。",
    bMessage: "你以务实的支持让他人安心，是可靠的后盾。",
    neutralMessage: "你会根据同伴需求选择鼓励或支持模式。",
  },
  {
    id: "strategic_analysis",
    dimension: "strategic",
    title: "分析与学习",
    questionRange: [61, 65],
    aMessage: "你热爱拆解系统，依靠深度研究做判断。",
    bMessage: "你通过实践汲取经验，行动中快速学习。",
    neutralMessage: "你会交替使用理论和实践来验证想法。",
  },
  {
    id: "strategic_innovation",
    dimension: "strategic",
    title: "想象力与创新",
    questionRange: [66, 70],
    aMessage: "你富有创意，喜欢探索新的可能。",
    bMessage: "你擅长把既有方案执行到极致。",
    neutralMessage: "你能在创意与执行中寻找平衡。",
  },
  {
    id: "strategic_future",
    dimension: "strategic",
    title: "未来思维",
    questionRange: [71, 75],
    aMessage: "你常以未来机会激励团队，具备远见。",
    bMessage: "你以现实与风险角度规划，是稳健派。",
    neutralMessage: "你既仰望未来也脚踏当下。",
  },
  {
    id: "strategic_context",
    dimension: "strategic",
    title: "背景与理解",
    questionRange: [76, 80],
    aMessage: "你擅长整合背景信息，洞察因果。",
    bMessage: "你凭直觉和反应速度破解情境。",
    neutralMessage: "你在调研与直觉间切换，视时间窗口决定。",
  },
  {
    id: "strategic_priorities",
    dimension: "strategic",
    title: "决策与优先级",
    questionRange: [81, 85],
    aMessage: "你以目标和规划驱动，路径清晰。",
    bMessage: "你享受过程与弹性，顺势调整方向。",
    neutralMessage: "你会在计划和随机应对间保持弹性。",
  },
];

export const CAREER_SUGGESTIONS: Record<
  Exclude<Dimension, "composite">,
  { tier1: string[]; tier2: string[]; tier3: string[]; summary: string }
> = {
  executing: {
    tier1: ["运营管理", "项目交付"],
    tier2: ["产品运营", "供应链协调"],
    tier3: ["团队执行教练", "流程咨询"],
    summary: "偏执行型：擅长推动落地、拆解目标，适合结果导向场景。",
  },
  influencing: {
    tier1: ["销售管理", "品牌传播"],
    tier2: ["公共事务", "业务拓展"],
    tier3: ["社群运营", "培训讲师"],
    summary: "偏影响型：善用表达和社交来带动团队。",
  },
  relationship: {
    tier1: ["组织发展", "人力资源BP"],
    tier2: ["教练咨询", "客户成功"],
    tier3: ["社群负责人", "合作伙伴管理"],
    summary: "偏关系型：擅长同理、凝聚团队氛围。",
  },
  strategic: {
    tier1: ["战略规划", "产品策略"],
    tier2: ["数据分析", "研究咨询"],
    tier3: ["投资分析", "创新孵化"],
    summary: "偏战略型：擅长洞察趋势、制定路线图。",
  },
};

export const ADVANTAGE_LEVELS = [
  { min: 16, max: 25, label: "🌟 顶级优势", color: "bg-red-100 text-red-800" },
  { min: 8, max: 15, label: "⭐ 主要优势", color: "bg-orange-100 text-orange-800" },
  { min: 1, max: 7, label: "✓ 中等优势", color: "bg-yellow-100 text-yellow-800" },
  { min: -7, max: 0, label: "- 中等劣势", color: "bg-emerald-100 text-emerald-800" },
  { min: -15, max: -8, label: "✗ 明显劣势", color: "bg-blue-100 text-blue-800" },
  { min: -25, max: -16, label: "✗✗ 顶级劣势", color: "bg-slate-200 text-slate-800" },
];

const q = (id: number, title: string, optionA: string, optionB: string, dimension: Dimension, subDimension?: string): Question => ({
  id,
  title,
  optionA,
  optionB,
  dimension,
  subDimension,
});

export const QUESTIONS: Question[] = [
  q(1, "第1题 - 完成驱动力", "我喜欢每天完成任务清单上的所有项目，这让我感到充实", "我工作的目标更多是为了维持生活而非完成多少任务", "executing", "驱动与成就"),
  q(2, "第2题 - 竞争动力", "我一贯努力工作，希望比其他人更快完成任务", "我做事进展较慢，但确保质量，宁愿做得少但做好", "executing", "驱动与成就"),
  q(3, "第3题 - 赢得第一", "我力争第一，在竞争中获胜激励着我", "我重在参与，只要尽力就感到满足", "executing", "驱动与成就"),
  q(4, "第4题 - 目标设定", "我每周都会设定具体的业绩目标", "我的工作根据当日需求和情况灵活变动", "executing", "驱动与成就"),
  q(5, "第5题 - 完成的喜悦", "完成一件交给我的任务会使我激动不已", "一个新创意会使我激动不已", "executing", "驱动与成就"),
  q(6, "第6题 - 专注力", "我比大多数人更专心去完成要做的事", "我统观全局顺其自然，不过分执着于单一目标", "executing", "专注与纪律"),
  q(7, "第7题 - 优先级管理", "我能设身处地为别人着想，且分清事情的轻重缓急", "我习惯于处理纷繁复杂的事务，同时协调多项工作", "executing", "专注与纪律"),
  q(8, "第8题 - 计划偏好", "对我来说，每件事都必须事先计划好", "我喜欢顺其自然，计划太多反而会束缚我", "executing", "专注与纪律"),
  q(9, "第9题 - 秩序性", "我是一个十分整洁有序的人，喜欢一切井井有条", "我非常固执己见，坚持自己的原则和方法", "executing", "专注与纪律"),
  q(10, "第10题 - 压力反应", "当我能提前完成任务时，我的思维更清晰", "最后一刻的压力使我思想高度集中", "executing", "专注与纪律"),
  q(11, "第11题 - 可靠性", "我言而有信，说到做到，是一个可靠的人", "我总能及时完成任务，但有时承诺过多", "executing", "责任与承诺"),
  q(12, "第12题 - 决策行动", "一旦作出决定我就必须付诸行动", "行动之前我需要确认自己行动的方向无误", "executing", "责任与承诺"),
  q(13, "第13题 - 承诺遵守", "我答应别人的事一定要完成，这是我的原则", "我会尽力完成，但如果遇到困难会向他人求助", "executing", "责任与承诺"),
  q(14, "第14题 - 道德内疚", "如果自己认为不对的事就会感到内疚", "只要符合规则制度，我就能坦然接受", "executing", "责任与承诺"),
  q(15, "第15题 - 工作饱和度", "我的工作已经满负荷，时间分配很紧张", "我还有很大潜力，可以承担更多工作", "executing", "责任与承诺"),
  q(16, "第16题 - 组织能力", "我善于组织落实，把复杂的事务安排得井然有序", "我善于构思并发起一个新项目和创意", "executing", "组织与安排"),
  q(17, "第17题 - 系统偏好", "我喜欢制定统一的常规制度和标准流程", "我喜欢灵活处理，不同情况采取不同方法", "executing", "组织与安排"),
  q(18, "第18题 - 多任务处理", "我能高效率地同时处理几件事", "我习惯于一次只做一件事，深入专注", "executing", "组织与安排"),
  q(19, "第19题 - 始终一致性", "开始新任务对我很容易，但我的问题是做事有始无终", "我能够坚持把事情做完，虽然开始时可能犹豫", "executing", "组织与安排"),
  q(20, "第20题 - 细节vs全局", "我能把握工作重点，分清主次优先", "我注重细节，每一个环节都力求完美", "executing", "组织与安排"),
  q(21, "第21题 - 交谈风格", "我善于交谈，能够用言语吸引他人注意", "我善于倾听，能让别人感到被理解", "influencing", "说服与表达"),
  q(22, "第22题 - 沟通优势", "我很会讲故事，朋友常请我讲故事", "我善于辅导，朋友常请我出主意", "influencing", "说服与表达"),
  q(23, "第23题 - 表达倾向", "我喜欢讲话表达，能够把复杂的事讲得简单易懂", "我喜欢思考分析，更愿意深入思考而非立即表达", "influencing", "说服与表达"),
  q(24, "第24题 - 他人反应", "我能够使别人兴奋起来，激发他们的热情", "我能够使别人平静下来，帮助他们冷静思考", "influencing", "说服与表达"),
  q(25, "第25题 - 朋友需求", "我的朋友请我讲故事和分享经历", "我的朋友请我出主意和提供建议", "influencing", "说服与表达"),
  q(26, "第26题 - 领导渴望", "我想成为一家大公司的总裁，拥有决策权", "我为别人牵线搭桥，更喜欢在后面支持", "influencing", "领导力与主动性"),
  q(27, "第27题 - 角色期望", "我希望成为他人的领导，能够指导他们", "成为他人的知己使我满足，我更喜欢亲密关系", "influencing", "领导力与主动性"),
  q(28, "第28题 - 强势表达", "我有时会直言不讳地警告别人，甚至会威逼", "我在大人物面前感到渺小，不善于强势表达", "influencing", "领导力与主动性"),
  q(29, "第29题 - 主动性", "我能够主动承担起任务，推动事情向前进行", "我需要别人的指示和鼓励，才能采取行动", "influencing", "领导力与主动性"),
  q(30, "第30题 - 他人看法", "我不在意别人对我的所作所为怎么看，我做对自己有利的事", "我始终清楚别人对我的看法，这会影响我的决定", "influencing", "领导力与主动性"),
  q(31, "第31题 - 竞争偏好", "我喜欢竞赛，渴望与他人竞争并获得胜利", "我喜欢工作，更看重工作质量而非竞争成果", "influencing", "竞争与成就感"),
  q(32, "第32题 - 竞争满足度", "只有在竞争中赢得第一我才能感到完全满意", "只要在比赛中名列前茅我就感到高兴", "influencing", "竞争与成就感"),
  q(33, "第33题 - 他人成功", "我喜欢表扬别人，他人的成功也是我的快乐", "我喜欢受到表扬，他人的认可对我很重要", "influencing", "竞争与成就感"),
  q(34, "第34题 - 成就非凡性", "我的成就非凡，我做过超乎寻常的事情", "我一贯创造积极成果，虽然不一定是非凡的", "influencing", "竞争与成就感"),
  q(35, "第35题 - 他人评价", "别人是否把我视为可信、专业和成功人士对我很重要", "我不自负，不太在乎别人是否有此看法", "influencing", "竞争与成就感"),
  q(36, "第36题 - 社交舒适度", "与陌生人攀谈使我兴奋，我能快速建立融洽关系", "主动与陌生人交谈使我为难，我需要时间适应", "influencing", "说服与吸引"),
  q(37, "第37题 - 社交表现", "我能够在社交场合轻松愉快，并吸引他人的注意", "我在社交场合会感到紧张，更喜欢小范围交流", "influencing", "说服与吸引"),
  q(38, "第38题 - 人际特质", "我是一个通情达理的人，容易与人沟通", "我是一个有责任心的人，更关注原则和规范", "influencing", "说服与吸引"),
  q(39, "第39题 - 他人潜力", "我能够使别人认识到他们的价值和潜力", "我能够使别人有成就感，通过具体任务体现价值", "influencing", "说服与吸引"),
  q(40, "第40题 - 团队角色", "我在团队中通常是最有活力和话题最多的人", "我在团队中通常是观察者，更少主动发言", "influencing", "说服与吸引"),
  q(41, "第41题 - 情感理解", "我能够体会同事的感受，直觉上理解他们的想法", "我喜欢和同事们进行深入讨论，通过对话了解他们", "relationship", "同理心与理解"),
  q(42, "第42题 - 角度转换", "我能设身处地为别人着想，设想他们的立场", "我能够爱别人，爱所有的人，而不是针对个人", "relationship", "同理心与理解"),
  q(43, "第43题 - 差异观察", "我善于观察人们之间的区别和差异", "我平等对待所有人，不因差别而区别对待", "relationship", "同理心与理解"),
  q(44, "第44题 - 倾听效果", "通过倾听，我使人们感觉获得理解和尊重", "我能把握对别人的谈话要点，使他们感觉良好", "relationship", "同理心与理解"),
  q(45, "第45题 - 情感强度", "我对生活中遇到的事件充满激情和感受", "我对我生活中遇到的事件进行冷静分析", "relationship", "同理心与理解"),
  q(46, "第46题 - 适应倾向", "我偏爱适应他人的方式和节奏", "我倾向于按照自己的方式和原则行动", "relationship", "适应性与开放性"),
  q(47, "第47题 - 观点灵活性", "我愿意了解新事物，容易改变主意", "我的价值观很稳定，很难被改变", "relationship", "适应性与开放性"),
  q(48, "第48题 - 生活平衡", "我要自己的生活保持平衡", "我希望我的工作和家庭达到完美结合", "relationship", "适应性与开放性"),
  q(49, "第49题 - 人际包容", "我不排斥任何人，尽量与别人和睦相处", "我仔细挑选我的朋友，与志同道合的人交往", "relationship", "适应性与开放性"),
  q(50, "第50题 - 变化接纳", "我能够轻松接纳不同类型的人和想法", "我对新的变化和不同意见会感到抵触", "relationship", "适应性与开放性"),
  q(51, "第51题 - 亲密关系需求", "成为他人的亲密知己使我感到满足和被需要", "我是一个独立的人，不太需要亲密的友谊", "relationship", "建立信任与深层关系"),
  q(52, "第52题 - 被理解的渴望", "我有强烈的渴望被他人理解和接受", "我不太在乎别人是否喜欢我或理解我", "relationship", "建立信任与深层关系"),
  q(53, "第53题 - 友谊深度", "我有几个特别要好的老朋友，珍视深层关系", "我认识很多朋友，但几乎没有交情很深的", "relationship", "建立信任与深层关系"),
  q(54, "第54题 - 分离焦虑", "我想念我的朋友，需要定期与他们在一起", "我喜欢独处，能够满足于个人的思考时间", "relationship", "建立信任与深层关系"),
  q(55, "第55题 - 成长依赖", "我通过与别人分享而成长和获得满足感", "我通过独立学习而成长，不太依赖他人分享", "relationship", "建立信任与深层关系"),
  q(56, "第56题 - 团体融合", "我尽量与别人一起做事，希望没有人感到孤单", "我喜欢为别人张罗和安排，但不一定要亲自参与", "relationship", "包容性与发展他人"),
  q(57, "第57题 - 他人满足感", "我能够使别人有成就感，通过认可激励他们", "我能够使别人快乐，通过陪伴和支持温暖他们", "relationship", "包容性与发展他人"),
  q(58, "第58题 - 潜力开发", "我乐于使别人认识其自身的价值和潜力", "我乐于使别人有成就感，看到他们的进步", "relationship", "包容性与发展他人"),
  q(59, "第59题 - 优点认可", "我能够发现别人的优点，并予以认可和表扬", "我能够看到别人的需要，并主动提供帮助", "relationship", "包容性与发展他人"),
  q(60, "第60题 - 影响力来源", "我充满活力，满怀喜悦和欢乐，能感染他人", "我严肃认真，通过专注的行动赢得他人信任", "relationship", "包容性与发展他人"),
  q(61, "第61题 - 拆解倾向", "我喜欢把东西拆开，了解其工作原理和运作的奥妙", "我乐于助人，更关注如何帮助别人而非理解原理", "strategic", "分析与学习"),
  q(62, "第62题 - 思维模式", "我思考问题脚踏实地，善于借助专家寻找正确答案", "我思考问题善于创造，且有战略眼光，对规律一目了然", "strategic", "分析与学习"),
  q(63, "第63题 - 学习喜好", "我热爱学习，对知识和新事物充满渴望", "我喜欢外出实践，在行动中学习而非理论学习", "strategic", "分析与学习"),
  q(64, "第64题 - 专注持久性", "我能够长时间研究和学习复杂的问题", "我集中注意力的时间较短，需要变化和休息", "strategic", "分析与学习"),
  q(65, "第65题 - 因果思维", "我经常思考问题的因果关系，喜欢深度分析", "我遇到事情及时应对，不过分思考原因", "strategic", "分析与学习"),
  q(66, "第66题 - 创意驱动", "一个新创意会使我激动不已，我常有新想法", "完成一件交给我的任务会使我激动不已", "strategic", "想象力与创新"),
  q(67, "第67题 - 思维敏捷性", "我思维敏捷，经常提出独特的观点和创意", "我的谈话使人愉快，更擅长表达而非创新", "strategic", "想象力与创新"),
  q(68, "第68题 - 解决方案思维", "我能够把握对别人的谈话要点，使他们感觉良好", "我能够发现新的可能性和创新的解决方案", "strategic", "想象力与创新"),
  q(69, "第69题 - 方法多样性", "我寻找各种不同的做事方法，不受约束", "我确立常规的做事方法，喜欢稳定的系统", "strategic", "想象力与创新"),
  q(70, "第70题 - 学习反思", "我常常从失败中总结教训，反思改进", "我只关注如何把我最擅长的事做得尽善尽美", "strategic", "想象力与创新"),
  q(71, "第71题 - 未来谈论频率", "我每天多次谈到自己对未来的展望和梦想", "我愿意腾出时间思考未来，但不频繁表达", "strategic", "未来思维"),
  q(72, "第72题 - 未来关注焦点", "我注重未来可能取得的成就和机会", "我注重应对未来可能发生的问题和风险", "strategic", "未来思维"),
  q(73, "第73题 - 激励来源", "未来可能取得的成就激励我，我充满希望", "过去发生的事激励我，我学习历史规律", "strategic", "未来思维"),
  q(74, "第74题 - 历史意义", "我通过研究我的历史我可以预测未来", "我的过去与我的未来无关，我向前看", "strategic", "未来思维"),
  q(75, "第75题 - 准备方式", "我想象未来可能的情景，并为之做准备", "我理解造成当前形势的原因，基于现实规划", "strategic", "未来思维"),
  q(76, "第76题 - 因素全面性", "我能够理解影响形势的所有因素和背景", "我充满活力和热情，能够迅速做出反应", "strategic", "背景与理解"),
  q(77, "第77题 - 因果观念", "我知道世上没有巧合，一切都事出有因", "对我来说巧合指运气、机遇、侥幸和偶然", "strategic", "背景与理解"),
  q(78, "第78题 - 历史兴趣", "我对历史和大战的起因充满兴趣", "我对50年后的世界经济充满想象和兴趣", "strategic", "背景与理解"),
  q(79, "第79题 - 预测方法", "我习惯于根据统计数字预测未来", "我习惯于根据当前形势预测未来", "strategic", "背景与理解"),
  q(80, "第80题 - 世界观", "我对生活持有一种健康的怀疑态度", "我相信自己与全人类相连，万物有因果", "strategic", "背景与理解"),
  q(81, "第81题 - 人生目标", "我的人生有清晰的目标和方向指引", "我的生活充满欢乐和即时的快乐", "strategic", "决策与优先级"),
  q(82, "第82题 - 计划执行", "我按照自己对未来的书面规划而行动", "我走一步看一步，根据情况灵活调整", "strategic", "决策与优先级"),
  q(83, "第83题 - 发展动力", "我致力于自我发展和不断成长", "我信守自己的价值观，坚持原则不变", "strategic", "决策与优先级"),
  q(84, "第84题 - 工作生活观", "我要我的工作和生活融为一体，和谐统一", "工作只是一种谋生的手段，生活才是真实的", "strategic", "决策与优先级"),
  q(85, "第85题 - 决策风格", "我凭感觉进行重要决策，相信直觉", "我凭理智进行重要决策，收集充分信息", "strategic", "决策与优先级"),
  q(86, "第86题", "我能够同时照顾好几件事，全面兼顾", "我愿意为别人作出牺牲，放弃一些个人追求", "composite"),
  q(87, "第87题", "我是一个好老师，擅长教育和启蒙他人", "我是一个好顾问，擅长提供专业建议", "composite"),
  q(88, "第88题", "我能够使很多人在一起同甘共苦相互合作", "我能够刺激员工相互竞争，激发最大潜能", "composite"),
  q(89, "第89题", "我能够分析问题的根本原因并提出解决方案", "我能够快速采取行动，不喜欢分析拖延", "composite"),
  q(90, "第90题", "我尽力使别人发挥其特长和优势", "我尽力使每个人都能得到全面进步", "composite"),
  q(91, "第91题", "我比较容易原谅别人的错误和不足", "我比较容易被别人的不诚实行为伤害", "composite"),
  q(92, "第92题", "我关注当下，根据当前需要专注做好眼前的事", "我着眼于未来的发展，规划长期目标", "composite"),
  q(93, "第93题", "我习惯通过与他人沟通和讨论来解决问题", "我习惯独立思考，自己找出问题的答案", "composite"),
  q(94, "第94题", "遇到困难需要圆满完成任务时，我往往亲自动手", "遇到困难时，我会依靠团队成员各自的优势", "composite"),
  q(95, "第95题", "我能够观察生活，理解现象和规律", "我能够主宰自己的生活，创造想要的结果", "composite"),
  q(96, "第96题", "我的性格外向，天生善于社交和交际", "在必要时我能够表现开朗大方，但不是天性", "composite"),
  q(97, "第97题", "我喜欢解释事情的原理和逻辑", "我喜欢做事情，通过行动实现目标", "composite"),
  q(98, "第98题", "我认为永远没有理由说谎，要坚持诚实", "有时候出于善意的谎言是可以接受的", "composite"),
  q(99, "第99题", "我能够从数据中发现规律和洞察机会", "我能够帮助别人解决难题，排除故障", "composite"),
  q(100, "第100题", "我特别善于通过描绘未来远景鼓励别人", "我特别善于通过举例过去成就来鼓舞别人", "composite"),
];
