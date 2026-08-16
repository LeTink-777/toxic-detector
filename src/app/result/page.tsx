'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, Check, Flag, ShieldAlert, ArrowRight, Info } from 'lucide-react';
import {
  PLANS,
  STORAGE_KEY,
  CATEGORY_NAMES,
  computeResult,
  parseAnswers,
  SITE,
  type ToxicResult,
} from '@/lib/content';
import type { PlanId, UserData } from '@/lib/types';

// Угол стрелки на мини-циферблате каждого тарифа.
const NEEDLE = [-52, 0, 52];

export default function ResultPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [result, setResult] = useState<ToxicResult | null>(null);
  const [paying, setPaying] = useState<PlanId | null>(null);
  const [payError, setPayError] = useState('');

  useEffect(() => {
    let data: UserData = {};
    try {
      data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as UserData;
    } catch {
      data = {};
    }
    const answers = parseAnswers(data.answers);
    if (!answers) {
      router.replace('/');
      return;
    }
    setUser(data);
    setResult(computeResult(answers));
  }, [router]);

  const pay = async (plan: PlanId) => {
    if (!user) return;
    setPaying(plan);
    setPayError('');
    localStorage.setItem('selected_plan', plan);
    try {
      const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, userData: user }),
      });
      const data = await res.json();
      if (data?.confirmationUrl) {
        window.location.href = data.confirmationUrl;
        return;
      }
      setPayError(data?.error || 'Не удалось создать платёж. Попробуйте ещё раз.');
    } catch {
      setPayError('Сервис оплаты временно недоступен. Попробуйте через минуту.');
    }
    setPaying(null);
  };

  if (!user || !result) {
    return (
      <main className="shell" style={{ padding: '120px 20px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Считаем результат...</p>
      </main>
    );
  }

  // Полукруглая шкала: 0% слева, 100% справа.
  const angle = -90 + (result.score / 100) * 180;

  return (
    <>
      <main className="shell" style={{ paddingTop: 48 }}>
        <motion.section
          className="meter-panel"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <svg className="meter-svg" viewBox="0 0 200 110" role="img" aria-label="Шкала токсичности">
            <path
              d="M14 100 A86 86 0 0 1 186 100"
              fill="none"
              stroke="#3A1414"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <path
              d="M14 100 A86 86 0 0 1 72 22"
              fill="none"
              stroke="#16A34A"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <path
              d="M78 19 A86 86 0 0 1 122 19"
              fill="none"
              stroke="#CA8A04"
              strokeWidth="14"
            />
            <path
              d="M128 22 A86 86 0 0 1 186 100"
              fill="none"
              stroke="#DC2626"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <motion.line
              x1="100"
              y1="100"
              x2="100"
              y2="34"
              stroke="#FEF2F2"
              strokeWidth="3"
              strokeLinecap="round"
              style={{ transformOrigin: '100px 100px' }}
              initial={{ rotate: -90 }}
              animate={{ rotate: angle }}
              transition={{ duration: 1.2, delay: 0.25, ease: 'easeOut' }}
            />
            <circle cx="100" cy="100" r="7" fill="#FEF2F2" />
          </svg>

          <p className="meter-value" data-band={result.band}>
            {result.score}%
          </p>
          <p className="meter-caption">Уровень токсичности</p>
          <h1 className="meter-type">{result.typeLabel}</h1>
        </motion.section>

        <div className="rule">
          <Flag size={17} strokeWidth={1.8} />
        </div>

        <section className="narrow">
          <div className="info-card">
            <h3>
              <ShieldAlert size={17} strokeWidth={1.9} />
              Что это значит
            </h3>
            <p>{result.bandText}</p>
          </div>

          <div className="lock-stack">
            <div className="lock-veil">
              <Lock size={26} strokeWidth={1.7} color="var(--accent)" />
              <h3>Разбор закрыт</h3>
              <p>
                Пять категорий, ваши красные флаги, объяснение происходившего и ответ
                «возвращать или нет» — открываются ниже.
              </p>
            </div>

            <div className="locked-blur" aria-hidden="true">
              <div className="info-card">
                <h3>
                  <Flag size={17} strokeWidth={1.9} />
                  Разбор по категориям
                </h3>
                {result.categories.map((c) => (
                  <div className="cat-row" key={c.category}>
                    <div className="cat-head">
                      <strong>{CATEGORY_NAMES[c.category]}</strong>
                      <span>{c.percent}%</span>
                    </div>
                    <div className="cat-bar">
                      <span style={{ width: `${c.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="info-card">
                <h3>
                  <ShieldAlert size={17} strokeWidth={1.9} />
                  Возвращать или нет
                </h3>
                <p>{result.verdict}</p>
              </div>
            </div>
          </div>

          {result.band === 'high' ? (
            <div className="help-note">
              <strong>Если сейчас тяжело.</strong> Этот тест — не диагноз и не замена
              помощи. Если отношения затрагивают вашу безопасность или вы не справляетесь с
              состоянием, есть круглосуточная бесплатная линия психологической помощи МЧС
              России: 8 (495) 989-50-50.
            </div>
          ) : null}
        </section>

        <div className="rule">
          <Flag size={17} strokeWidth={1.8} />
        </div>

        <section>
          <h2 className="section-title">Насколько глубоко смотреть</h2>
          <p className="section-lead">
            Чем дальше проворачивается стрелка, тем подробнее разбор — вплоть до плана
            восстановления на 30 дней.
          </p>

          <div className="levels">
            {PLANS.map((plan, index) => {
              const discount = Math.round((1 - plan.price / plan.oldPrice) * 100);
              return (
                <div
                  key={plan.id}
                  className="level"
                  data-featured={plan.featured ? 'true' : 'false'}
                >
                  {plan.featured ? <span className="level-badge">Выбор большинства</span> : null}

                  <div className="level-dial" aria-hidden="true">
                    <span
                      className="level-needle"
                      style={{ transform: `rotate(${NEEDLE[index]}deg)` }}
                    />
                  </div>

                  <h3>{plan.name}</h3>
                  <p className="level-tagline">{plan.tagline}</p>

                  <div className="level-price">
                    <span className="now">{plan.price} ₽</span>
                    <span className="was">{plan.oldPrice} ₽</span>
                    <span className="off">−{discount}%</span>
                  </div>

                  <ul className="level-features">
                    {plan.features.map((f) => (
                      <li key={f}>
                        <Check size={15} strokeWidth={2.4} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    className="level-cta"
                    disabled={paying !== null}
                    onClick={() => pay(plan.id)}
                  >
                    {paying === plan.id ? (
                      'Открываем оплату...'
                    ) : (
                      <>
                        Открыть разбор
                        <ArrowRight size={16} strokeWidth={2} />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {payError ? (
            <p className="field-error" style={{ textAlign: 'center', marginTop: 20 }}>
              {payError}
            </p>
          ) : null}

          <p
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              textAlign: 'center',
              marginTop: 26,
              fontSize: 13.5,
              color: 'var(--text-secondary)',
            }}
          >
            <Info size={15} strokeWidth={1.9} />
            Оплата через ЮKassa. Результат открывается сразу и дублируется на почту.
          </p>
        </section>
      </main>

      <footer className="site-foot shell">
        <p>
          <Link href="/privacy">Политика конфиденциальности</Link>
          <Link href="/offer">Публичная оферта</Link>
        </p>
        <p>
          Евдокимов Даниил Владимирович · ИНН 381928138362 · Самозанятый
          <br />
          danyavdkmvv3@gmail.com · @dvdkmv
        </p>
        <p className="disclaimer">
          {SITE.name} — развлекательный сервис. Тест не является психологической
          диагностикой и не заменяет консультацию специалиста.
        </p>
      </footer>
    </>
  );
}
