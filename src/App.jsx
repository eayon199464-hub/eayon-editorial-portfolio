import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, MotionConfig, animate, motion, useIsPresent, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon, XIcon, PauseIcon, PlayIcon } from "@phosphor-icons/react";
import { EXPERIENCES, FEATURED, imageFor } from "./content";
import { CHAPTERS, clampPage, turnFromGesture } from "./narrative";
import { PROJECT_ARCHIVES, editorialAlt } from "./projectSources";
import "@fontsource/bodoni-moda/latin-400.css";
import "@fontsource/bodoni-moda/latin-400-italic.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";

const ease = [0.22, 1, 0.36, 1];
const readPreference = (key, fallback) => { try { return localStorage.getItem(key) || fallback; } catch { return fallback; } };
const writePreference = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Local storage is optional. */ } };
const range = (item, cn) => cn ? item.range : item.range.replace("至今", "Present");
const title = (item, cn) => cn && item.year === "2026" ? "岚图销售助手" : item.displayTitle;
const number = (n) => String(n + 1).padStart(2, "0");

function Narrative({ page, direction, cn, calm, select, open }) {
  const cover = page === 0;
  const item = FEATURED[Math.max(0, page - 1)];
  const chapter = CHAPTERS[Math.max(0, page - 1)];
  const wheelTime = useRef(0);
  const moved = useRef(false);
  const start = useRef({ x: 0, y: 0 });
  const pull = useMotionValue(0);
  const imagePull = useTransform(pull, value => calm ? 0 : value * .12);
  const imageTilt = useTransform(pull, value => calm ? 0 : Math.max(-4, Math.min(4, value * -.012)));
  useEffect(() => { const playback = animate(pull, 0, { duration: calm ? 0 : .65, ease }); return () => playback.stop(); }, [page, calm, pull]);
  const enter = { opacity: 1, y: 0, transition: { duration: calm ? 0 : .65, ease, staggerChildren: calm ? 0 : .07 } };
  const leave = { opacity: 0, y: calm ? 0 : -direction * 24, transition: { duration: calm ? 0 : .25 } };
  return <section className={"narrative-stage " + (cover ? "is-cover" : "is-chapter")} aria-label={cn ? "从想法到现实" : "Between idea and reality"}
    onWheel={event => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || Math.abs(event.deltaX) < 18 || performance.now() - wheelTime.current < 1000) return;
      wheelTime.current = performance.now(); select(page + Math.sign(event.deltaX));
    }}>
    <motion.div className="narrative-art" layout layoutId={"cover-" + item.year} transition={{ duration: calm ? 0 : 1.05, ease }}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div className="narrative-photo" key={item.year} custom={direction}
          variants={{ enter: d => ({ clipPath: calm ? "inset(0% 0% 0% 0%)" : d > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)" }), show: { clipPath: "inset(0% 0% 0% 0%)" }, leave: { opacity: 0 } }}
          initial="enter" animate="show" exit="leave" transition={{ duration: calm ? 0 : .95, ease }}>
          <motion.img style={{ x: imagePull, rotateY: imageTilt }} src={imageFor(item)} alt={editorialAlt(cn)} draggable="false" fetchPriority="high"
            initial={{ scale: calm ? 1 : 1.12 }} animate={{ scale: 1 }} transition={{ duration: calm ? 0 : 1.4, ease }} />
        </motion.div>
      </AnimatePresence>
      <motion.div className="page-drag-surface" drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={calm ? 0 : .13} dragMomentum={false}
        onPointerDown={e => { moved.current = false; start.current = { x: e.clientX, y: e.clientY }; }}
        onPointerMove={e => { if (Math.hypot(e.clientX - start.current.x, e.clientY - start.current.y) > 8) moved.current = true; }}
        onDrag={(_, info) => pull.set(info.offset.x)}
        onDragEnd={(_, info) => { const step = turnFromGesture(info.offset.x, info.velocity.x); if (step) select(page + step); animate(pull, 0, { duration: calm ? 0 : .65, ease }); }}
        onClick={() => { if (!moved.current && cover) select(1); }} aria-hidden="true" />
      <span className="image-folio" aria-hidden="true">{cover ? "E / 01" : number(page - 1) + " / " + chapter.word.toUpperCase()}</span>
    </motion.div>
    <AnimatePresence mode="wait" initial={false} custom={direction}>
      {cover ? <motion.div className="issue-cover-copy" key="cover" initial={{ opacity: 0 }} animate={enter} exit={leave}>
        <p className="issue-kicker">A SELECTED JOURNAL / EAYON</p>
        <h1><span>Between</span><span>idea &amp;</span><span>reality.</span></h1>
        <p className="personal-quote">{cn ? "如无必要，勿增实体。" : "No more than necessary."}</p>
        <p className="hero-byline">{cn ? "田一雄 / 数字化产品经理" : "EAYON / DIGITAL PRODUCT MANAGER"}</p>
      </motion.div> : <motion.article className="chapter-copy" key={page} aria-labelledby="chapter-title" tabIndex={-1} initial={{ opacity: 0, y: calm ? 0 : direction * 35 }} animate={enter} exit={leave}
        onAnimationComplete={() => { if (document.activeElement === document.body) document.querySelector('.chapter-copy')?.focus({ preventScroll: true }); }}>
        <p className="chapter-eyebrow"><span>{number(page - 1)}</span> {cn ? chapter.label : chapter.labelEn}</p>
        <p className="chapter-thought">{cn ? chapter.line : chapter.lineEn}</p>
        <div className="chapter-project">
          <p className="eyebrow">{item.company} / {range(item, cn)}</p>
          <h1 id="chapter-title">{title(item, cn)}</h1>
          <p className="chapter-description">{cn ? chapter.text : chapter.textEn}</p>
          <button className="text-link" onClick={() => open(item)}>{cn ? "阅读项目" : "READ THE STORY"}<ArrowUpRightIcon size={22} weight="light" /></button>
        </div>
        <div className="chapter-continuation"><p>{cn ? chapter.bridge : chapter.bridgeEn}</p><button onClick={() => page < FEATURED.length ? select(page + 1) : open("about")}>
          {page < FEATURED.length ? (cn ? "翻到下一章" : "TURN THE PAGE") : (cn ? "关于我与这句话" : "ABOUT THE PRINCIPLE")}<ArrowRightIcon size={21} weight="light" />
        </button></div>
      </motion.article>}
    </AnimatePresence>
    <span className="page-gesture-hint">{cn ? "左右拖动影像 · 翻页" : "DRAG THE IMAGE TO TURN"}</span>
  </section>;
}

function PublicArchive({ archive, cn }) {
  return <section className="public-archive" aria-labelledby="archive-heading">
    <p className="eyebrow">{cn ? "公开项目档案" : "FROM THE PROJECT ARCHIVE"}</p>
    <h3 id="archive-heading">{cn ? archive.title : archive.titleEn}</h3>
    <p className="archive-context">{cn ? archive.context : archive.contextEn}</p>
    {archive.gallery.map((photo, i) => <figure key={photo.src} className="archive-figure">
      <a href={photo.src} target="_blank" rel="noopener noreferrer" aria-label={(cn ? "查看完整图片：" : "View full image: ") + (cn ? photo.title : photo.titleEn)}>
        <img src={photo.src} width={photo.width} height={photo.height} alt={cn ? photo.alt : photo.altEn} loading="lazy" decoding="async" />
      </a>
      <figcaption><span>{number(i)}</span><div><h4>{cn ? photo.title : photo.titleEn}</h4><p>{cn ? photo.caption : photo.captionEn}</p></div></figcaption>
    </figure>)}
    <div className="archive-sources"><h4 className="eyebrow">{cn ? "延伸阅读 / 来源" : "FURTHER READING / SOURCES"}</h4>
      {archive.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer"><span>{cn ? source.label : source.labelEn}</span><small>{source.date}</small><ArrowUpRightIcon size={17} weight="light" /></a>)}
    </div>
  </section>;
}

function Story({ item, cn, calm, close, onNext }) {
  const present = useIsPresent();
  const archive = PROJECT_ARCHIVES[item.year];
  const [progress, setProgress] = useState(0);
  const detailRef = useRef(null);
  useEffect(() => { detailRef.current?.scrollTo({ top: 0 }); setProgress(0); }, [item.year]);
  return <motion.section className="story-dialog dialog" data-present={present} style={{ pointerEvents: present ? "auto" : "none" }} role="dialog" aria-modal="true" aria-hidden={!present} aria-labelledby="story-heading" tabIndex={-1}
    initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 1, transition: { duration: calm ? 0 : 0.8 } }}>
    <motion.div className={"story-image cover-media" + (archive ? " has-archive" : "")} layoutId={"cover-" + item.year} transition={{ duration: calm ? 0 : 0.8, ease }}>
      {archive ? <div className="archive-cover"><p className="eyebrow">BEIJING / 2021</p><img src={archive.hero.src} width={archive.hero.width} height={archive.hero.height} alt={cn ? archive.hero.alt : archive.hero.altEn} /></div> : <><img src={imageFor(item)} alt={editorialAlt(cn)} /><div className="cover-shade" /></>}
      <div className="story-image-caption"><span>EAYON / SELECTED WORK</span><p>{item.displayTitle}</p></div>
    </motion.div>
    <motion.div className="story-reading" ref={detailRef}
      exit={{ opacity: 0, transition: { duration: calm ? 0 : 0.25 } }}
      initial={{ opacity: 0, y: calm ? 0 : 30 }} animate={{ opacity: 1, y: 0, transition: { delay: calm ? 0 : 0.28, duration: calm ? 0 : 0.55, ease } }}
      onScroll={(event) => { const node = event.currentTarget; setProgress(node.scrollTop / Math.max(1, node.scrollHeight - node.clientHeight)); }}>
      <div className="reading-progress" style={{ transform: "scaleX(" + progress + ")" }} />
      <div className="story-toolbar"><span>{cn ? "项目专题" : "SELECTED STORY"}</span><button onClick={close} className="close-button" aria-label={cn ? "返回章节" : "Back to chapter"}><span>{cn ? "返回" : "BACK"}</span><XIcon size={22} weight="light" /></button></div>
      <div className="story-body">
        <p className="eyebrow">{range(item, cn)} / {item.company}</p>
        <h2 id="story-heading">{title(item, cn)}</h2>
        <p className="story-deck">{cn ? item.headline : item.headlineEn}</p>
        <div className="story-role"><span className="eyebrow">{cn ? "我的角色" : "MY ROLE"}</span><p>{cn ? item.role : item.roleEn}</p></div>
        <h3 className="eyebrow">{cn ? "关键工作" : "CONTRIBUTION"}</h3>
        <ol className="contributions">{(cn ? item.details : item.detailsEn).map((text, i) => <li key={text}><span>{number(i)}</span><p>{text}</p></li>)}</ol>
        <section className="story-facts"><h3 className="eyebrow">{cn ? "项目记录" : "PROJECT RECORD"}</h3>
          {(cn ? item.facts : item.factsEn).map(fact => <p key={fact}>{fact}</p>)}
        </section>
        {item.awards && <section className="story-awards"><h3 className="eyebrow">{cn ? "团队项目荣誉" : "TEAM PROJECT RECOGNITION"}</h3>{(cn ? item.awards : item.awardsEn).map(a => <p key={a}>{a}</p>)}</section>}
        {archive && <PublicArchive archive={archive} cn={cn} />}
        <button className="next-story" onClick={onNext}><span>{item.year === FEATURED.at(-1).year ? (cn ? "关于我与工作信念" : "ABOUT MY WORKING PRINCIPLE") : (cn ? "翻到下一章" : "TURN TO THE NEXT CHAPTER")}</span><ArrowRightIcon weight="light" size={28} /></button>
      </div>
    </motion.div>
  </motion.section>;
}

function Contents({ cn, calm, close, choose }) {
  const present = useIsPresent();
  const [hovered, setHovered] = useState(1);
  return <motion.section className="index-dialog dialog" data-present={present} style={{ pointerEvents: present ? "auto" : "none" }} role="dialog" aria-modal="true" aria-hidden={!present} aria-labelledby="index-heading" tabIndex={-1}
    initial={{ clipPath: calm ? "inset(0)" : "inset(100% 0 0 0)" }} animate={{ clipPath: "inset(0)" }} exit={{ clipPath: calm ? "inset(0)" : "inset(0 0 100% 0)", opacity: calm ? 0 : 1 }} transition={{ duration: calm ? 0 : 0.65, ease }}>
    <div className="dialog-top"><span className="masthead">EAYON</span><button className="close-button" onClick={close} aria-label={cn ? "关闭目录" : "Close index"}><span>{cn ? "关闭" : "CLOSE"}</span><XIcon size={24} weight="light" /></button></div>
    <div className="index-layout">
      <div className="index-title"><p className="eyebrow">{cn ? "目录 / 职业经历" : "INDEX / CAREER STORIES"}</p><h2 id="index-heading">A body<br />of work.</h2>
        <div className="index-preview"><AnimatePresence mode="wait"><motion.img key={hovered} src={imageFor(EXPERIENCES[hovered])} alt=""
          initial={{ opacity: 0, scale: calm ? 1 : 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: calm ? 0 : 0.25 }} /></AnimatePresence><span>{EXPERIENCES[hovered].company}</span></div>
      </div>
      <div className="index-list">{EXPERIENCES.map((item, i) => <button className="index-row" key={item.year} onMouseEnter={() => setHovered(i)} onFocus={() => setHovered(i)} onClick={() => choose(item)}>
        <span className="index-number">{number(i)}</span><span><strong>{item.displayTitle}</strong><small>{cn ? item.companyCn : item.company}</small></span><span className="index-year">{range(item, cn)}</span><ArrowUpRightIcon weight="thin" size={30} />
      </button>)}</div>
    </div>
  </motion.section>;
}

function About({ cn, calm, close }) {
  const present = useIsPresent();
  return <motion.section className="about-dialog dialog" data-present={present} style={{ pointerEvents: present ? "auto" : "none" }} role="dialog" aria-modal="true" aria-hidden={!present} aria-labelledby="about-heading" tabIndex={-1}
    initial={{ y: calm ? 0 : "100%" }} animate={{ y: 0 }} exit={{ y: calm ? 0 : "100%", opacity: calm ? 0 : 1 }} transition={{ duration: calm ? 0 : 0.7, ease }}>
    <div className="dialog-top"><span className="masthead">EAYON</span><button className="close-button" onClick={close} aria-label={cn ? "关闭关于" : "Close about"}><span>{cn ? "关闭" : "CLOSE"}</span><XIcon size={24} weight="light" /></button></div>
    <div className="about-layout"><p className="eyebrow">{cn ? "关于我 / 工作信念" : "ABOUT / A WORKING PRINCIPLE"}</p>
      <h2 id="about-heading">{cn ? <>如无必要，<br />勿增实体。</> : <>No more<br /><em>than necessary.</em></>}</h2>
      <div className="about-bottom"><p>{cn ? "我是田一雄，Eayon。关注汽车数字化产品、CRM、销售数字化与客户体验，也做品牌创意与 AI 产品实践。喜欢把复杂的问题想清楚，再把真正需要的东西做出来。" : "I'm Eayon, a digital product manager working across automotive CRM, sales digitalization and customer experience, with experience in brand creative and AI product exploration. I like making complex problems clear, then building what is genuinely needed."}</p>
        <div className="about-links"><a className="text-link" href="mailto:tyx553269537@163.com">{cn ? "聊聊新的可能" : "LET'S TALK"}<ArrowUpRightIcon size={20} weight="light" /></a><a className="text-link" href="./田一雄_高级数字化产品经理_中文简历.docx" download>{cn ? "下载中文简历" : "DOWNLOAD CHINESE CV"}<ArrowUpRightIcon size={20} weight="light" /></a><small>tyx553269537@163.com</small></div>
      </div>
    </div>
  </motion.section>;
}

export function App() {
  const [language, setLanguage] = useState(() => readPreference("eayon-language", "cn"));
  const [motionPreference, setMotionPreference] = useState(() => readPreference("eayon-motion", "system"));
  const systemCalm = useReducedMotion();
  const calm = motionPreference === "off" || (motionPreference === "system" && systemCalm);
  const cn = language === "cn";
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [overlay, setOverlay] = useState(null);
  const trigger = useRef(null);
  const pageRef = useRef(0);
  const select = useCallback((index) => {
    const next = clampPage(index);
    if (next === pageRef.current) return;
    setDirection(next > pageRef.current ? 1 : -1);
    pageRef.current = next; setPage(next);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);
  useEffect(() => { writePreference("eayon-language", language); document.documentElement.lang = cn ? "zh-CN" : "en"; }, [language, cn]);
  useEffect(() => { writePreference("eayon-motion", motionPreference); }, [motionPreference]);
  const open = useCallback((value) => { trigger.current = document.activeElement; setOverlay(value); }, []);
  const close = useCallback(() => setOverlay(null), []);
  useEffect(() => {
    if (!overlay) return;
    document.body.style.overflow = "hidden";
    const timer = requestAnimationFrame(() => document.querySelector('.dialog[data-present="true"]')?.focus({ preventScroll: true }));
    const trap = (event) => {
      if (event.key === "Escape") { event.preventDefault(); close(); return; }
      if (event.key !== "Tab") return;
      const dialog = document.querySelector('.dialog[data-present="true"]');
      const items = [...(dialog?.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"]') || [])].filter(el => el.getClientRects().length);
      const first = items[0], last = items.at(-1);
      if (!first) return;
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", trap);
    return () => { cancelAnimationFrame(timer); document.body.style.overflow = ""; document.removeEventListener("keydown", trap); trigger.current?.focus?.({ preventScroll: true }); };
  }, [overlay, close]);
  useEffect(() => {
    const handle = (event) => {
      if (overlay || event.altKey || event.ctrlKey || event.metaKey || event.target.closest("input,textarea,select")) return;
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); select(pageRef.current + (event.key === "ArrowRight" ? 1 : -1)); }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [overlay, select]);
  const story = typeof overlay === "object" && overlay ? overlay : null;

  return <MotionConfig reducedMotion={calm ? "always" : "never"}><LayoutGroup id="editorial">
    <main className={"publication " + (cn ? "language-cn" : "language-en") + (calm ? " calm" : "")} inert={overlay ? true : undefined}>
      <header className="publication-header">
        <button className="masthead home" onClick={() => select(0)} aria-label={cn ? "Eayon 首页" : "Eayon home"}>EAYON{cn && <span> / 田一雄</span>}</button>
        <button className="index-nav" onClick={() => open("index")}><span />INDEX<span /></button>
        <nav className="header-actions" aria-label={cn ? "主导航" : "Main navigation"}>
          <button className="about-nav" onClick={() => open("about")}>ABOUT</button><span className="nav-divider" />
          <button className={cn ? "selected-language" : ""} lang="zh-CN" aria-pressed={cn} onClick={() => setLanguage("cn")}>CN</button>
          <button className={!cn ? "selected-language" : ""} lang="en" aria-pressed={!cn} onClick={() => setLanguage("en")}>EN</button>
          <button className="motion-toggle" onClick={() => setMotionPreference(calm ? "on" : "off")} aria-label={cn ? (calm ? "开启动效" : "减弱动效") : (calm ? "Enable motion" : "Reduce motion")} aria-pressed={!calm} title={cn ? (calm ? "开启动效" : "减弱动效") : (calm ? "Enable motion" : "Reduce motion")}>{calm ? <PlayIcon size={15} weight="light" /> : <PauseIcon size={15} weight="light" />}</button>
        </nav>
      </header>
      <Narrative page={page} direction={direction} cn={cn} calm={calm} select={select} open={open} />
      <footer className={"issue-footer " + (page === 0 ? "cover-footer" : "chapter-footer")}>
        {page === 0 ? <><p className="opening-question">{cn ? "一个想法，如何走进真实的工作？" : "What happens between an idea and the real world?"}</p>
          <button className="open-issue" onClick={() => select(1)}>{cn ? "翻开这一辑" : "OPEN THE ISSUE"}<ArrowRightIcon size={30} weight="thin" /></button></>
          : <><nav className="issue-chapters" aria-label={cn ? "章节顺序" : "Chapter sequence"}>
            <button onClick={() => select(0)}>{cn ? "封面" : "COVER"}</button>
            {CHAPTERS.map((chapter, i) => <button key={chapter.word} onClick={() => select(i + 1)} aria-current={page === i + 1 ? "step" : undefined}>
              <span>{number(i)}</span><span>{cn ? chapter.label : chapter.word}</span><span className="chapter-rule">{page === i + 1 && <motion.span layoutId="active-rule" transition={{ duration: calm ? 0 : .6, ease }} />}</span>
            </button>)}
          </nav><nav className="chapter-pagination" aria-label={cn ? "翻页" : "Page navigation"}>
            <span className="page-count" aria-live="polite">{String(page).padStart(2, "0")} / 03</span>
            <button className="page-previous" onClick={() => select(page - 1)} aria-label={cn ? (page === 1 ? "返回封面" : "上一章") : (page === 1 ? "Back to cover" : "Previous chapter")} title={cn ? (page === 1 ? "返回封面" : "上一章") : (page === 1 ? "Back to cover" : "Previous chapter")}><ArrowLeftIcon size={21} weight="thin" /></button>
            <button className="page-forward" onClick={() => page < FEATURED.length ? select(page + 1) : open("about")}
              aria-label={page < FEATURED.length ? (cn ? "下一章：" : "Next chapter: ") + title(FEATURED[page], cn) : (cn ? "关于我" : "About me")}>
              <span><strong>{page < FEATURED.length ? (cn ? "下一章" : "NEXT CHAPTER") : (cn ? "关于我" : "ABOUT ME")}</strong>
                <small>{page < FEATURED.length ? title(FEATURED[page], cn) : (cn ? "工作与信念" : "MY WORKING PRINCIPLE")}</small></span>
              <ArrowRightIcon size={27} weight="light" />
            </button>
          </nav></>}
      </footer>
      <p className="sr-only" role="status">{page === 0 ? (cn ? "封面" : "Cover") : `${page} / 3: ${title(FEATURED[page - 1], cn)}`}</p>
    </main>
    <AnimatePresence>
      {story && <Story key={story.year} item={story} cn={cn} calm={calm} close={close} onNext={() => {
        const idx = FEATURED.findIndex(i => i.year === story.year);
        if (idx >= 0) { close(); if (idx < FEATURED.length - 1) select(idx + 2); else open("about"); }
        else { const i = EXPERIENCES.findIndex(i => i.year === story.year); setOverlay(EXPERIENCES[(i + 1) % EXPERIENCES.length]); }
      }} />}
      {overlay === "index" && <Contents key="index" cn={cn} calm={calm} close={close} choose={item => setOverlay(item)} />}
      {overlay === "about" && <About key="about" cn={cn} calm={calm} close={close} />}
    </AnimatePresence>
  </LayoutGroup></MotionConfig>;
}
