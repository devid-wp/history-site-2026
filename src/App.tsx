import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'

/* ---------- локальні копії історичних зображень (Wikimedia Commons) ---------- */

const IMG = {
  boxTelephone: 'images/bell-box-telephone-1876.jpg',
  portrait: 'images/bell-portrait-1895.jpg',
  patent: 'images/bell-patent-1876.jpg',
  watson: 'images/thomas-watson.jpg',
  switchroom: 'images/switchroom-1893.jpg',
  exchange: 'images/exchange-1910.jpg',
  wires: 'images/wires-1890.jpg',
  telegraphKey: 'images/telegraph-key-1876.jpg',
  boxOpen: 'images/bell-box-1877.jpg',
}

/* ---------- дані ---------- */

const TOTAL = 9

const CHAIN = [
  'ГОЛОС',
  'МЕМБРАНА',
  'ЕЛЕКТРИЧНИЙ СИГНАЛ',
  'ПРОВІД',
  'МЕМБРАНА',
  'ЗВУК',
]

const TIMELINE: {
  year: string
  title: string
  text: string
  image: string
  caption: string
  alt: string
  shape: Shape
}[] = [
  {
    year: '1876',
    title: 'Патент і перший дзвінок',
    text: 'Белл подає заявку на патент 14 лютого й отримує патент US 174 465 7 березня. 10 березня — перша успішна передача живої мови по дроту.',
    image: IMG.patent,
    caption: 'Креслення з патенту US 174 465, 1876',
    alt: 'Креслення телефону з патенту Белла 1876 року',
    shape: 'patent',
  },
  {
    year: '1880',
    title: 'Телефон стає пристроєм',
    text: 'Моделі стають простішими й дешевшими. З’являються настінні та настільні апарати, а телефонні лінії будують усе більше міст.',
    image: IMG.boxOpen,
    caption: 'Телефон Белла зі знятою кришкою, 1877',
    alt: 'Ранній телефонний апарат Белла без кришки',
    shape: 'landscape',
  },
  {
    year: '1890',
    title: 'Міста в дротах',
    text: 'Телефонні та телеграфні дроти густо вкривають вулиці великих міст. У 1892 році в США відкривають першу автоматичну телефонну станцію.',
    image: IMG.wires,
    caption: 'Дроти над Бродвеєм, 1890',
    alt: 'Історична гравюра: густа мережа дротів над вулицею Нью-Йорка',
    shape: 'portrait',
  },
  {
    year: '1900',
    title: 'Телефон у повсякденному житті',
    text: 'З’єднання ще робить телефонистка на комутаторі, але телефон уже звичний у конторах, крамницях, лікарнях і вдома в заможних містах.',
    image: IMG.switchroom,
    caption: 'Комутаторна зала, 1893',
    alt: 'Історична фотографія великої комутаторної зали з рядами телефонисток',
    shape: 'landscape',
  },
]

const MILESTONES_1876 = [
  {
    date: '14 ЛЮТОГО 1876',
    title: 'Заявка на патент',
    text: 'Белл подає до патентного відомства США заявку на свій пристрій. Того самого дня там з’являється й заявка Елайші Грея — пізніше саме цей збіг став причиною довгих суперечок про першість.',
  },
  {
    date: '7 БЕРЕЗНЯ 1876',
    title: 'Патент US 174 465',
    text: 'Відомство видає Беллу патент на «удосконалення в телеграфі». У документі описано передавання голосу електричним сигналом — саме це й стало патентом на телефон.',
  },
  {
    date: '10 БЕРЕЗНЯ 1876',
    title: 'Перший успішний дзвінок',
    text: 'Белл уперше передає по дроту живу людську мову, і його помічник чує ці слова на іншому кінці лінії. Ідея довела свою працездатність.',
  },
]

const SIGNAL_STEPS = [
  {
    title: 'Звук',
    text: 'Коли людина говорить, повітря навколо неї коливається. Ці коливання і є звуком.',
  },
  {
    title: 'Мембрана',
    text: 'Тонка металева пластина в передавачі вловлює коливання повітря і починає рухатися разом із ними.',
  },
  {
    title: 'Електричний сигнал',
    text: 'Мембрана змінює опір у ланцюгу, тому сила струму в лінії змінюється так само плавно, як звук.',
  },
  {
    title: 'Провід',
    text: 'Змінний струм іде по дроту до другого апарата. Сигнал безперервний, а не переривчастий, як у телеграфі.',
  },
  {
    title: 'Звук знову',
    text: 'У слухавці струм проходить через електромагніт, мембрана коливається — і людина чує голос.',
  },
]

const SPREAD = [
  {
    date: '1877',
    title: 'Перша телефонна компанія',
    text: 'У липні 1877 року засновано Bell Telephone Company: винахід починають продавати й обслуговувати як послугу.',
  },
  {
    date: '1878',
    title: 'Перша телефонна станція',
    text: 'У січні 1878 року в Нью-Гейвені (США) відкривають першу комерційну телефонну станцію: абонентів більше не з’єднують напряму один з одним.',
  },
  {
    date: '1880-ті',
    title: 'Міські мережі',
    text: 'Лінії розростаються в містах США та Європи. Абонента з’єднує телефонистка на комутаторі — вручну, штекерами.',
  },
  {
    date: '1891–1892',
    title: 'Автоматичні станції',
    text: 'Елмон Строуджер пропонує кроковий шукач, і 1892 року в місті Ла-Порт (США) починає працювати перша автоматична телефонна станція.',
  },
]

const IMPACT = [
  {
    title: 'Бізнес',
    text: 'Домовленості, замовлення й термінові питання вирішували за хвилини, а не за дні листування. Телефони з’явилися в конторах, крамницях і на складах.',
  },
  {
    title: 'Зв’язок між містами',
    text: 'Міжміські лінії поступово з’єднали сусідні міста, а далі — цілі регіони. Відстань перестала бути головною перешкодою для розмови.',
  },
  {
    title: 'Повсякденне спілкування',
    text: 'Можна було узгодити зустріч або почути голос рідної людини, яка перебувала далеко. Розмова стала звичною частиною дня.',
  },
  {
    title: 'Робота організацій',
    text: 'Лікарні, поліція, пожежна служба, залізниці та редакції газет отримали швидкий спосіб координувати дії під час подій у місті.',
  },
]

/* ---------- дрібні компоненти ---------- */

type Shape = 'wide' | 'portrait' | 'tall' | 'landscape' | 'square' | 'patent'

function Section({
  index,
  revealed,
  className = '',
  children,
}: {
  index: number
  revealed: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <section
      data-index={index}
      className={`section ${className}${revealed ? ' in' : ''}`}
    >
      <div className="inner">{children}</div>
    </section>
  )
}
function Button({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button className="btn" onClick={onClick} disabled={disabled} type="button">
      {children}
    </button>
  )
}

function Figure({
  src,
  alt,
  caption,
  shape = 'wide',
}: {
  src: string
  alt: string
  caption: string
  shape?: Shape
}) {
  return (
    <figure className={`figure ${shape}`}>
      <img src={src} alt={alt} loading="lazy" decoding="async" />
      <figcaption>{caption}</figcaption>
    </figure>
  )
}

/* запуск CSS-анімації сигналу: зміна ключа перезапускає анімацію */
function useSignal(duration = 2800) {
  const [run, setRun] = useState(0)
  const [busy, setBusy] = useState(false)
  const timer = useRef<number | null>(null)

  const fire = useCallback(() => {
    setRun((r) => r + 1)
    setBusy(true)
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setBusy(false), duration)
  }, [duration])

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current)
    },
    [],
  )

  return { run, busy, fire }
}

/* схема: голос -> ... -> звук */
function SignalChain() {
  const { run, busy, fire } = useSignal()

  return (
    <div className="chain-wrap">
      <div className={`chain${run > 0 ? ' go' : ''}`} key={run}>
        <span className="rail">
          <span className="rail-fill" />
        </span>
        {run > 0 && <span className="signal" />}
        <ol>
          {CHAIN.map((label, i) => (
            <li key={label + i} style={{ '--i': i } as CSSProperties}>
              <span className="dot" />
              <span className="label">{label}</span>
            </li>
          ))}
        </ol>
      </div>
      <Button onClick={fire} disabled={busy}>
        {busy ? 'Сигнал у дорозі…' : 'Передати сигнал'}
      </Button>
    </div>
  )
}

/* перший дзвінок: BELL --- SIGNAL --- WATSON */
function BellToWatson() {
  const { run, busy, fire } = useSignal(2600)

  return (
    <div className="call">
      <div className={`call-line${run > 0 ? ' go' : ''}`} key={run}>
        <span className="call-side">BELL</span>
        <span className="wire">
          <span className="wire-fill" />
          {run > 0 && <span className="signal" />}
          <span className="wire-label">SIGNAL</span>
        </span>
        <span className="call-side">WATSON</span>
      </div>
      <Button onClick={fire} disabled={busy}>
        {busy ? 'З’єднання…' : 'Зателефонувати'}
      </Button>
    </div>
  )
}

/* timeline 1876 -> 1900 з кліком по роках */
function Timeline() {
  const [open, setOpen] = useState(0)
  const item = TIMELINE[open]

  return (
    <div className="timeline">
      <div className="years" role="tablist" aria-label="Роки">
        {TIMELINE.map((t, i) => (
          <button
            key={t.year}
            type="button"
            role="tab"
            aria-selected={open === i}
            className={`year${open === i ? ' on' : ''}`}
            onClick={() => setOpen(i)}
          >
            {t.year}
          </button>
        ))}
      </div>
      <div className="year-card" key={item.year}>
        <div className="year-copy">
          <p className="year-title">{item.title}</p>
          <p className="year-text">{item.text}</p>
        </div>
        <Figure
          src={item.image}
          alt={item.alt}
          caption={item.caption}
          shape={item.shape}
        />
      </div>
    </div>
  )
}

/* ---------- застосунок ---------- */

export default function App() {
  const deckRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState<Set<number>>(() => new Set([0]))
  const [freeScroll, setFreeScroll] = useState(false)

  const go = useCallback((i: number) => {
    const n = Math.max(0, Math.min(TOTAL - 1, i))
    const sections = deckRef.current?.querySelectorAll('section')
    sections?.[n]?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  /* активна секція — для індикатора */
  useEffect(() => {
    const deck = deckRef.current
    if (!deck) return
    const sections = Array.from(deck.querySelectorAll('section'))
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActive(Number((e.target as HTMLElement).dataset.index))
          }
        })
      },
      { root: deck, rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  /* показ вмісту: будь-яка видима частина секції залишається проявленою */
  useEffect(() => {
    const deck = deckRef.current
    if (!deck) return
    const sections = Array.from(deck.querySelectorAll('section'))
    const io = new IntersectionObserver(
      (entries) => {
        setVisible((prev) => {
          const next = new Set(prev)
          entries.forEach((e) => {
            const i = Number((e.target as HTMLElement).dataset.index)
            if (e.isIntersecting) next.add(i)
            else next.delete(i)
          })
          return next
        })
      },
      { root: deck, threshold: 0 },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  /* прилипання до секцій лише тоді, коли весь вміст вміщується на екран */
  useEffect(() => {
    const deck = deckRef.current
    if (!deck) return
    const sections = Array.from(deck.querySelectorAll('section'))
    const apply = () => {
      const h = deck.clientHeight
      setFreeScroll(
        sections.some((s) => (s as HTMLElement).scrollHeight > h + 8),
      )
    }
    apply()
    window.addEventListener('resize', apply)
    return () => window.removeEventListener('resize', apply)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault()
        go(active + 1)
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        go(active - 1)
      } else if (e.key === 'Home') {
        e.preventDefault()
        go(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        go(TOTAL - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, go])

  const shown = String(active + 1).padStart(2, '0')
  const total = String(TOTAL).padStart(2, '0')

  return (
    <>
      <header className="brand">
        <span>1876 · ТЕЛЕФОН</span>
        <span className="brand-count">
          {shown} / {total}
        </span>
      </header>

      <nav className="nav" aria-label="Навігація по секціях">
        {Array.from({ length: TOTAL }, (_, i) => (
          <button
            key={i}
            type="button"
            className={active === i ? 'on' : ''}
            onClick={() => go(i)}
            aria-label={`Секція ${i + 1}`}
          >
            {String(i + 1).padStart(2, '0')}
          </button>
        ))}
      </nav>

      <div className={`deck${freeScroll ? ' free' : ''}`} ref={deckRef}>
        {/* 1 — INTRO */}
        <Section index={0} revealed={visible.has(0)} className="intro">
          <div className="hero-text">
            <p className="eyebrow">винахід XIX століття</p>
            <h1 className="huge">1876</h1>
            <p className="word">ТЕЛЕФОН</p>
            <p className="quote">
              «Як людина навчилася передавати голос на відстань»
            </p>
            <Button onClick={() => go(1)}>Почати →</Button>
          </div>
          <Figure
            src={IMG.boxTelephone}
            alt="Телефонний апарат Белла «велика скринька» 1876 року"
            caption="Телефон Белла «велика скринька», 1876. Національний музей американської історії, Вашингтон"
            shape="portrait"
          />
        </Section>

        {/* 2 — ДО ТЕЛЕФОНУ */}
        <Section index={1} revealed={visible.has(1)}>
          <p className="eyebrow">розділ 02</p>
          <h2>До телефону</h2>
          <div className="steps">
            {[
              ['Лист', 'тижні й місяці'],
              ['Кур’єр', 'дні й тижні'],
              ['Телеграф', 'хвилини, але лише текст'],
            ].map(([name, time]) => (
              <div className="step" key={name}>
                <span className="step-name">{name}</span>
                <span className="step-time">{time}</span>
              </div>
            ))}
          </div>

          <div className="facts">
            <div className="fact">
              <span className="k">ЛИСТ</span>
              <h3>Папір, чорнило, пошта</h3>
              <p>
                Найдешевший спосіб. Лист із Європи до Америки йшов тижнями, а
                іноді — місяцями, і відповіді доводилося чекати так само довго.
              </p>
            </div>
            <div className="fact">
              <span className="k">КУР’ЄР</span>
              <h3>Верхова пошта й посильні</h3>
              <p>
                Швидше за звичайну пошту, але людина все одно мала фізично
                подолати всю відстань. Швидкість залежала від доріг, коней і
                погоди.
              </p>
            </div>
            <div className="fact">
              <span className="k">ТЕЛЕГРАФ</span>
              <h3>Електричний сигнал по дроту</h3>
              <p>
                З 1840-х років телеграф передавав повідомлення за хвилини. Але
                код Морзе — це лише точки й тире: текст, а не голос.
              </p>
            </div>
          </div>

          <div className="media flip">
            <div className="stack">
              <h3 className="sub">Чому телеграф не передавав голос?</h3>
              <p className="note">
                Телеграф працював із простим сигналом: струм є — струму немає.
                Цього досить, щоб передати точки й тире, але замало для живої
                мови. Людський голос — це складні безперервні коливання, і щоб
                передати його дротом, потрібен був сигнал, який змінюється так
                само плавно, як звук. Раніше для дальнього зв’язку
                використовували й оптичний телеграф — вежі з рухомими крилами,
                але він працював лише в межах прямої видимості.
              </p>
            </div>
            <Figure
              src={IMG.telegraphKey}
              alt="Телеграфний ключ і приймач Western Electric, близько 1876 року"
              caption="Телеграфний ключ і приймач Western Electric, бл. 1876. Історичний музей Вісконсина"
              shape="landscape"
            />
          </div>
        </Section>

        {/* 3 — БЕЛЛ */}
        <Section index={2} revealed={visible.has(2)}>
          <p className="eyebrow">розділ 03</p>
          <h2>Олександр Грем Белл</h2>
          <div className="media photo-first">
            <div className="stack">
              <p className="lead">
                <strong>1847–1922.</strong> Народився в Единбурзі (Шотландія),
                згодом переїхав до Канади, а потім до США. Був винахідником,
                інженером і викладачем глухих.
              </p>
              <p className="lead">
                Його мати погано чула, а дружина Мейбл була глухою. Тому звук і
                мова для Белла були не абстрактною темою, а щоденною справою: він
                навчав глухих дітей говорити й досліджував, як саме утворюється
                людський голос.
              </p>
              <p className="lead">
                У 1870-х роках Белл працював над «гармонійним телеграфом» —
                спробою передавати кілька повідомлень одним дротом. Саме в цих
                дослідах він дійшов думки, що дротом можна передавати не лише
                переривчастий сигнал, а й безперервні коливання — тобто голос.
              </p>
              <p className="lead">
                Разом із помічником Томасом Ватсоном він збирав і перевіряв
                моделі. У 1876 році Белл отримав патент США №174 465 — саме цей
                документ закріпив за ним винахід телефону.
              </p>
            </div>
            <Figure
              src={IMG.portrait}
              alt="Портрет Александра Грема Белла, близько 1895 року"
              caption="Олександр Грем Белл, бл. 1895. Національна портретна галерея, Лондон"
              shape="portrait"
            />
          </div>
        </Section>

        {/* 4 — ЯК ПРАЦЮЄ */}
        <Section index={3} revealed={visible.has(3)}>
          <p className="eyebrow">розділ 04</p>
          <h2>Як працює телефон</h2>
          <div className="media">
            <SignalChain />
            <Figure
              src={IMG.boxOpen}
              alt="Ранній телефон Белла зі знятою кришкою, 1877 рік"
              caption="Телефон Белла зі знятою кришкою: видно мембрану й магніт, 1877"
              shape="landscape"
            />
          </div>

          <div className="explain">
            <h3 className="sub">Що відбувається із сигналом?</h3>
            <ol>
              {SIGNAL_STEPS.map((s) => (
                <li key={s.title}>
                  <b>{s.title}</b>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
            <p className="note">
              У телефоні Белла звук перетворювався на безперервний електричний
              сигнал, а не на набір точок і тире. Саме тому телефон міг передати
              голос, а телеграф — ні.
            </p>
          </div>
        </Section>

        {/* 5 — 1876 */}
        <Section index={4} revealed={visible.has(4)}>
          <p className="eyebrow">розділ 05</p>
          <h2 className="huge small">1876</h2>
          <p className="lead">
            Рік, коли ідея передавати голос дротом стала реальністю. Три дати
            цього року визначають всю подальшу історію телефону.
          </p>

          <div className="media">
            <ul className="milestones">
              {MILESTONES_1876.map((m) => (
                <li key={m.date}>
                  <span className="date">{m.date}</span>
                  <div>
                    <h3>{m.title}</h3>
                    <p>{m.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Figure
              src={IMG.patent}
              alt="Креслення з патенту Александра Грема Белла US 174 465, 7 березня 1876"
              caption="Креслення патенту US 174 465, 7 березня 1876. Національний архів США"
              shape="patent"
            />
          </div>

          <Timeline />
        </Section>

        {/* 6 — ПЕРША РОЗМОВА */}
        <Section index={5} revealed={visible.has(5)}>
          <p className="eyebrow">розділ 06</p>
          <h2>Перший телефонний дзвінок</h2>
          <p className="lead">
            10 березня 1876 року Белл вимовив у пристрій фразу до свого
            помічника: «Mr. Watson, come here, I want to see you» («Містере
            Ватсон, зайдіть сюди, я хочу вас бачити»). Ватсон почув ці слова по
            дроту — так відбувся перший успішний телефонний виклик.
          </p>

          <div className="media photo-first">
            <div className="stack">
              <div>
                <h3 className="sub">Хто такий Томас Ватсон</h3>
                <p className="note">
                  Томас А. Ватсон (1854–1934) — молодий механік і електрик,
                  помічник Белла. Він виготовляв деталі апаратів і чергував на
                  протилежному кінці лінії, тому саме він почув перші слова.
                </p>
              </div>
              <div>
                <h3 className="sub">Де це відбувалося</h3>
                <p className="note">
                  У Бостоні (США), у будинку на Ексетер-стріт, 5, де Белл
                  облаштував лабораторію. Белл і Ватсон перебували в різних
                  кімнатах, з’єднаних дротом.
                </p>
              </div>
              <div>
                <h3 className="sub">Чому це важливо</h3>
                <p className="note">
                  Уперше живу людську мову вдалося передати й почути на відстані.
                  Телефон перестав бути схемою на папері й став працюючим
                  пристроєм.
                </p>
              </div>
            </div>
            <Figure
              src={IMG.watson}
              alt="Томас А. Ватсон тримає модель першого телефону Белла"
              caption="Томас А. Ватсон із моделлю першого телефону Белла. Бібліотека Конгресу, США"
              shape="portrait"
            />
          </div>

          <BellToWatson />
        </Section>

        {/* 7 — ПОШИРЕННЯ */}
        <Section index={6} revealed={visible.has(6)}>
          <p className="eyebrow">розділ 07</p>
          <h2>Поширення телефону</h2>
          <p className="lead">
            Після 1876 року телефон швидко перетворився з лабораторної моделі на
            міську мережу: з’явилися компанії, станції та професія телефонистки.
          </p>

          <div className="media">
            <ul className="milestones">
              {SPREAD.map((m) => (
                <li key={m.date}>
                  <span className="date">{m.date}</span>
                  <div>
                    <h3>{m.title}</h3>
                    <p>{m.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Figure
              src={IMG.switchroom}
              alt="Комутаторна зала Metropolitan Telephone and Telegraph Company, 1893"
              caption="Комутаторна зала Metropolitan Telephone Co., Нью-Йорк, 1893"
              shape="landscape"
            />
          </div>

          <div className="media flip">
            <Figure
              src={IMG.exchange}
              alt="Будівля телефонної станції в Окленді, 1910 рік"
              caption="Будівля телефонної станції, Окленд (США), 1910"
              shape="landscape"
            />
            <div className="stack">
              <h3 className="sub">Ручні станції та телефонистки</h3>
              <p className="note">
                Спочатку з’єднання було ручним: абонент називав номер, а
                телефонистка на комутаторі вручну з’єднувала лінії штекерами. На
                великих станціях одночасно працювали десятки людей, і від їхньої
                уваги залежав увесь зв’язок міста.
              </p>
              <h3 className="sub">Від міста до міста</h3>
              <p className="note">
                Перші лінії були міськими й короткими. Поступово з’явилися
                міжміські лінії, які з’єднали сусідні міста, а згодом — цілі
                регіони.
              </p>
            </div>
          </div>
        </Section>

        {/* 8 — ВПЛИВ */}
        <Section index={7} revealed={visible.has(7)}>
          <p className="eyebrow">розділ 08</p>
          <h2>Як телефон змінив життя</h2>
          <p className="lead">
            Телефонія змінила не лише техніку, а й щоденні звички: як люди
            домовляються, працюють і підтримують зв’язок.
          </p>

          <div className="impact">
            {IMPACT.map((i) => (
              <div key={i.title}>
                <h3>{i.title}</h3>
                <p>{i.text}</p>
              </div>
            ))}
          </div>

          <div className="media flip">
            <div className="stack">
              <p className="note">
                Телефон не замінив пошту й телеграф одразу: якийсь час усі три
                способи зв’язку існували поруч і доповнювали один одного. Листи
                залишалися для довгих текстів і документів, телеграф — для
                коротких термінових повідомлень, а телефон — для живої розмови.
              </p>
            </div>
            <Figure
              src={IMG.wires}
              alt="Гравюра: дроти телефону й телеграфу над Бродвеєм, 1890 рік"
              caption="Телефонні та телеграфні дроти над Бродвеєм, 1890"
              shape="portrait"
            />
          </div>
        </Section>

        {/* 9 — ФІНАЛ */}
        <Section index={8} revealed={visible.has(8)}>
          <p className="eyebrow">розділ 09</p>
          <h2 className="final">
            Від першого телефону
            <br />
            до смартфона
          </h2>
          <p className="word">1876 → сьогодні</p>
          <p className="lead">
            Принцип залишився тим самим: звук перетворюють у сигнал, передають
            далі й знову відтворюють як звук. Змінилися лише матеріали, швидкість
            і масштаб мереж.
          </p>
          <Button onClick={() => go(0)}>На початок ↑</Button>
          <p className="credits">
            Зображення: Wikimedia Commons — портрет Белла, 1895 (CC0); телефон
            «велика скринька», 1876 (CC0); креслення патенту US 174 465, 1876
            (public domain, Національний архів США); Т. Ватсон (public domain,
            Бібліотека Конгресу); комутаторна зала, 1893 (public domain);
            телефонна станція в Окленді, 1910 (Internet Archive, без обмежень);
            дроти над Бродвеєм, 1890 (public domain); телеграфний ключ Western
            Electric, бл. 1876 (CC0).
          </p>
        </Section>
      </div>
    </>
  )
}
