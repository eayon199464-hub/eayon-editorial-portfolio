// Editorial chapter framing only; factual roles and results remain in content.js.
export const CHAPTERS = [
  {
    word: "Idea", label: "想法成形", labelEn: "GIVING AN IDEA FORM",
    line: "想法，先有了形状。", lineEn: "First, an idea\ntakes shape.",
    text: "从一句创意，到一套完整的视觉语言。带着创意团队反复打磨，让 JOYCUBE 的内容与视觉形成一个整体。",
    textEn: "From a creative thought to a coherent visual language. Working with the creative team to refine JOYCUBE's content and bring its visual system together.",
    bridge: "有了形状，接下来是日常。", bridgeEn: "From taking shape to everyday use."
  },
  {
    word: "Practice", label: "日常落地", labelEn: "MAKING IT PART OF EVERY DAY",
    line: "让想法，进入日常。", lineEn: "Then, it becomes\npart of the day.",
    text: "把视线从品牌转向一线销售。销售助手的核心功能、培训与虚拟号业务，让产品设计与真实的使用场景接上。",
    textEn: "From brand experience to frontline sales. Core app features, training and virtual phone services connect product decisions with the situations people work in.",
    bridge: "从一个工作现场，到不同的市场。", bridgeEn: "From the frontline to different markets."
  },
  {
    word: "Beyond", label: "跨越市场", labelEn: "WORKING ACROSS MARKETS",
    line: "让经验，跨过边界。", lineEn: "And beyond\na single market.",
    text: "当语言、市场与业务规则发生变化，重新理解问题。以拉美 CRM、营销自动化与 AI 实践，探索产品在不同环境中的落地。",
    textEn: "Different languages, markets and business rules call for a fresh understanding of the problem. Exploring that through LATAM CRM, marketing automation and AI product work.",
    bridge: "如无必要，勿增实体。", bridgeEn: "No more than necessary."
  }
];

export const clampPage = (page) => Math.max(0, Math.min(CHAPTERS.length, page));
export const turnFromGesture = (offset, velocity) => Math.abs(offset) > 55 || (Math.abs(offset) > 12 && Math.abs(velocity) > 450)
  ? (offset < 0 ? 1 : -1) : 0;
