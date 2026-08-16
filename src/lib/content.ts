import type { Plan, SiteConfig, UserData, Section, PlanId } from './types';
import { PLAN_LABELS } from './types';

export const SITE: SiteConfig = {
  name: 'Детектор токсичности отношений',
  domain: 'vernut-byvshego.online',
  url: 'https://vernut-byvshego.online',
  accent: '#DC2626',
  theme: 'dark',
  pdfFont: 'PTSans',
};

export const STORAGE_KEY = 'toxic_detector_data';

export const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Поверхностно',
    price: 290,
    oldPrice: 890,
    tagline: 'Стрелка на первом делении',
    features: [
      'Точный процент токсичности',
      'Тип отношений с расшифровкой',
      'Главный вывод',
    ],
  },
  {
    id: 'full',
    name: 'Глубоко',
    price: 590,
    oldPrice: 1990,
    tagline: 'Полный разбор по категориям',
    featured: true,
    features: [
      'Всё из «Поверхностно»',
      'Разбор по пяти категориям',
      'Список ваших красных флагов',
      'Ответ: возвращать или нет',
      'Почему это происходило',
    ],
  },
  {
    id: 'premium',
    name: 'Полностью',
    price: 990,
    oldPrice: 3490,
    tagline: 'Разбор и план восстановления',
    features: [
      'Всё из «Глубоко»',
      'План восстановления на 30 дней',
      'Признаки здоровых отношений',
      'Выход из созависимости',
      'Аудиоподдержка',
    ],
  },
];

export type Category = 'control' | 'isolation' | 'gaslighting' | 'abuse' | 'lovebombing';

export const CATEGORY_NAMES: Record<Category, string> = {
  control: 'Контроль',
  isolation: 'Изоляция',
  gaslighting: 'Газлайтинг',
  abuse: 'Эмоциональное давление',
  lovebombing: 'Качели и лавбомбинг',
};

const CATEGORY_HIGH: Record<Category, string> = {
  control:
    'Контроль был высоким. Проверки телефона, отчёты о передвижениях, решения за вас — всё это подаётся как забота, но работает как надзор. Здоровые отношения не требуют доказательств лояльности.',
  isolation:
    'Изоляция выражена сильно. Круг общения сужался постепенно: сначала «твоя подруга мне не нравится», потом ссоры после каждой встречи с друзьями. Изоляция — не побочный эффект ревности, а механизм: чем меньше людей рядом, тем меньше внешних оценок происходящего.',
  gaslighting:
    'Газлайтинг присутствовал заметно. Вам говорили, что вы преувеличиваете, придумываете, неправильно запомнили. Главный признак: вы начали сомневаться в собственной памяти и вести мысленный учёт событий, чтобы «доказать» самой себе, что не выдумали.',
  abuse:
    'Эмоциональное давление было систематическим: обесценивание, молчание как наказание, публичные шутки в ваш адрес. Отдельно каждый эпизод выглядит мелочью — именно поэтому его так трудно назвать вслух.',
  lovebombing:
    'Цикл «качелей» выражен ярко: периоды исключительной нежности сменялись холодом без объяснений. Это самый затягивающий паттерн из существующих — непредсказуемое вознаграждение формирует привязанность сильнее, чем стабильно хорошее отношение.',
};

const CATEGORY_LOW: Record<Category, string> = {
  control: 'Контроль был в пределах нормы: личные границы в целом соблюдались.',
  isolation: 'Изоляции не было — ваш круг общения сохранялся.',
  gaslighting: 'Признаков газлайтинга мало: ваша версия событий не оспаривалась систематически.',
  abuse: 'Систематического эмоционального давления не прослеживается.',
  lovebombing: 'Резких качелей не было — отношение к вам было относительно ровным.',
};

export interface Question {
  q: string;
  category: Category;
  options: { text: string; score: number }[];
}

const SCALE = [
  { text: 'Никогда', score: 0 },
  { text: 'Редко', score: 1 },
  { text: 'Часто', score: 2 },
  { text: 'Постоянно', score: 3 },
];

export const QUESTIONS: Question[] = [
  { q: 'Партнёр проверял ваш телефон, переписки или соцсети?', category: 'control', options: SCALE },
  { q: 'Вам приходилось отчитываться, где вы и с кем?', category: 'control', options: SCALE },
  { q: 'Решения о ваших деньгах, работе или внешности принимал партнёр?', category: 'control', options: SCALE },
  { q: 'Партнёр был недоволен, когда вы виделись с друзьями или роднёй?', category: 'isolation', options: SCALE },
  { q: 'Ваш круг общения за время отношений заметно сузился?', category: 'isolation', options: SCALE },
  { q: 'Вам говорили, что вы всё придумали или преувеличиваете?', category: 'gaslighting', options: SCALE },
  { q: 'Вы начинали сомневаться в собственной памяти после разговоров?', category: 'gaslighting', options: SCALE },
  { q: 'Партнёр отрицал сказанное им ранее, хотя вы точно помнили?', category: 'gaslighting', options: SCALE },
  { q: 'Вас обесценивали — ваши успехи, внешность, чувства?', category: 'abuse', options: SCALE },
  { q: 'Партнёр наказывал вас молчанием?', category: 'abuse', options: SCALE },
  { q: 'Над вами шутили при других так, что было неприятно?', category: 'abuse', options: SCALE },
  { q: 'Вы чувствовали вину за то, что расстроили партнёра, даже не понимая чем?', category: 'abuse', options: SCALE },
  { q: 'Периоды исключительной нежности сменялись резким холодом?', category: 'lovebombing', options: SCALE },
  { q: 'В начале отношений всё развивалось стремительно — подарки, планы, «ты моя судьба»?', category: 'lovebombing', options: SCALE },
  { q: 'Вы ловили себя на том, что стараетесь вернуть «того человека, каким он был вначале»?', category: 'lovebombing', options: SCALE },
];

export interface ToxicResult {
  score: number;
  band: 'high' | 'medium' | 'low';
  typeLabel: string;
  bandText: string;
  verdict: string;
  categories: { category: Category; percent: number; text: string }[];
  flags: string[];
  why: string;
  recovery: string;
  healthy: string;
  codependency: string;
}

export function parseAnswers(value: string | undefined): number[] | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed) || parsed.length !== QUESTIONS.length) return null;
    return parsed.map((n) => Number(n) || 0);
  } catch {
    return null;
  }
}

export function computeResult(answers: number[]): ToxicResult {
  const totals: Record<Category, { sum: number; max: number }> = {
    control: { sum: 0, max: 0 },
    isolation: { sum: 0, max: 0 },
    gaslighting: { sum: 0, max: 0 },
    abuse: { sum: 0, max: 0 },
    lovebombing: { sum: 0, max: 0 },
  };

  QUESTIONS.forEach((q, i) => {
    const value = q.options[answers[i]]?.score ?? 0;
    totals[q.category].sum += value;
    totals[q.category].max += 3;
  });

  const sum = Object.values(totals).reduce((a, t) => a + t.sum, 0);
  const max = QUESTIONS.length * 3;
  const score = Math.round((sum / max) * 100);

  const band = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';

  const categories = (Object.keys(totals) as Category[]).map((category) => {
    const percent = Math.round((totals[category].sum / totals[category].max) * 100);
    return {
      category,
      percent,
      text: percent >= 50 ? CATEGORY_HIGH[category] : CATEGORY_LOW[category],
    };
  });

  const typeLabel =
    band === 'high'
      ? categories.find((c) => c.category === 'gaslighting')!.percent >= 60
        ? 'Нарциссические отношения'
        : 'Эмоционально-абьюзивные отношения'
      : band === 'medium'
        ? 'Созависимые отношения'
        : 'Отношения без систематической токсичности';

  const bandText =
    band === 'high'
      ? `${score}% — высокая токсичность. Паттерны, которые вы описали, характерны для отношений с систематическим нарушением границ. Важно понимать: набор из контроля, обесценивания и качелей не бывает случайным и почти никогда не проходит сам.`
      : band === 'medium'
        ? `${score}% — средняя токсичность, серая зона. Это не абьюз, но и не здоровые отношения: часть паттернов повторялась достаточно регулярно, чтобы влиять на вас. Такие отношения поддаются изменению, если оба человека этого хотят.`
        : `${score}% — низкая токсичность. Судя по ответам, систематических разрушительных паттернов в этих отношениях не было. Скорее всего, они закончились по другим причинам: несовпадение целей, усталость, разные жизненные этапы.`;

  const verdict =
    band === 'high'
      ? 'Возвращение в эти отношения с высокой вероятностью воспроизведёт те же паттерны. Люди меняются, но не от того, что партнёр вернулся, — а только от долгой собственной работы, признаков которой в описанном нет. Если вы всё же рассматриваете возвращение, поставьте себе конкретные наблюдаемые условия и срок, а не надежду.'
      : band === 'medium'
        ? 'Возвращение имеет смысл только при одном условии: оба назовут вслух, что именно не работало, и договорятся о конкретных изменениях. Возвращение «просто потому что скучаем» приведёт вас в ту же точку через несколько месяцев.'
        : 'Эти отношения не были разрушительными, и возвращение возможно. Стоит честно ответить себе на другой вопрос: вы скучаете по этому человеку — или по состоянию, в котором были рядом с ним?';

  const flags = categories
    .filter((c) => c.percent >= 50)
    .map((c) => `${CATEGORY_NAMES[c.category]} — выражен на ${c.percent}%`);

  const why =
    'Такие отношения держатся не на любви, а на непредсказуемом подкреплении. Когда хорошее отношение приходит нерегулярно и без понятной причины, психика начинает искать закономерность и удваивать усилия. Именно поэтому из токсичных отношений так трудно выйти: чем менее предсказуем партнёр, тем сильнее привязанность. Это работает у всех людей одинаково и не говорит ни о вашей слабости, ни о вашем уме.';

  const recovery =
    'План на 30 дней.\n\nДни 1–7: полный контакт-стоп. Никаких сообщений, сторис, просмотров профиля. Это не про гордость — это единственный способ прервать цикл подкрепления.\n\nДни 8–14: восстановление круга общения. Напишите трём людям, с которыми перестали общаться за время отношений. Не для того, чтобы рассказать о расставании, — просто чтобы вернуть связь.\n\nДни 15–21: возвращение своей жизни. Верните одно занятие, от которого отказались в отношениях. Одно, но регулярно.\n\nДни 22–30: работа с фактами. Выпишите десять конкретных эпизодов, после которых вам было плохо. В момент тоски перечитывайте этот список — память избирательна и склонна сохранять только хорошее.';

  const healthy =
    'Признаки здоровых отношений, по которым стоит сверяться в будущем: вы можете сказать «мне это не нравится» и не получить наказание молчанием; ваш круг общения растёт, а не сужается; вы помните события так же, как партнёр, и вашу версию не оспаривают; хорошее отношение стабильно, а не приходит волнами после конфликтов; вы знаете, чего ожидать завтра.';

  const codependency =
    'Выход из созависимости строится на трёх опорах. Первая: перестать быть тем, кто чинит чужое состояние — чужие эмоции не ваша зона ответственности. Вторая: вернуть себе право на «нет» без объяснительной записки. Третья: восстановить источники удовольствия, не связанные с партнёром, — работа, тело, друзья, дело. Пока единственным источником хорошего остаётся один человек, любая его реакция будет управлять вами.';

  return {
    score,
    band,
    typeLabel,
    bandText,
    verdict,
    categories,
    flags,
    why,
    recovery,
    healthy,
    codependency,
  };
}

export function pdfTitle(userData: UserData): string {
  const answers = parseAnswers(userData.answers);
  if (!answers) return SITE.name;
  return `Детектор токсичности — ${computeResult(answers).score}%`;
}

export function buildSections(userData: UserData, plan: PlanId): Section[] {
  const answers = parseAnswers(userData.answers);

  if (!answers) {
    return [
      {
        title: 'Данные не распознаны',
        content:
          'Не удалось прочитать ответы теста. Вернитесь на сайт и пройдите детектор заново.',
      },
    ];
  }

  const r = computeResult(answers);
  const sections: Section[] = [];

  sections.push({ title: 'Уровень токсичности', content: r.bandText });
  sections.push({ title: 'Тип отношений', content: r.typeLabel });

  if (plan === 'full' || plan === 'premium') {
    sections.push({
      title: 'Разбор по категориям',
      content: r.categories
        .map((c) => `${CATEGORY_NAMES[c.category]} — ${c.percent}%. ${c.text}`)
        .join('\n\n'),
    });
    sections.push({
      title: 'Ваши красные флаги',
      content: r.flags.length
        ? r.flags.map((f, i) => `${i + 1}. ${f}`).join('\n')
        : 'Категорий с выраженной токсичностью не обнаружено.',
    });
    sections.push({ title: 'Почему это происходило', content: r.why });
    sections.push({ title: 'Возвращать или нет', content: r.verdict });
  }

  if (plan === 'premium') {
    sections.push({ title: 'План восстановления на 30 дней', content: r.recovery });
    sections.push({ title: 'Признаки здоровых отношений', content: r.healthy });
    sections.push({ title: 'Выход из созависимости', content: r.codependency });
    sections.push({
      title: 'Аудиоподдержка',
      content:
        'Аудиоверсия разбора записывается индивидуально и приходит отдельным письмом в течение 6 часов.',
    });
  }

  if (r.band === 'high') {
    sections.push({
      title: 'Важно',
      content:
        'Описанные вами паттерны выходят за рамки обычных конфликтов. Этот текст — не диагноз и не замена помощи. Если отношения затрагивают вашу безопасность или вы не справляетесь с состоянием, обратитесь к психологу или на горячую линию психологической помощи МЧС России: 8 (495) 989-50-50, круглосуточно и бесплатно.',
    });
  }

  sections.push({
    title: 'О документе',
    content: `Тариф: ${PLAN_LABELS[plan]}. Материал носит развлекательный и просветительский характер, не является психологической диагностикой и не заменяет консультацию специалиста.`,
  });

  return sections;
}
