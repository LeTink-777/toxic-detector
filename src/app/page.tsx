'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Flag, ArrowLeft, ShieldAlert, ArrowRight } from 'lucide-react';
import { QUESTIONS, STORAGE_KEY, SITE } from '@/lib/content';

export default function HomePage() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const choose = (index: number) => {
    const next = [...answers];
    next[step] = index;
    setAnswers(next);
    setStep(step + 1);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@') || !email.includes('.')) {
      setError('Укажите корректный e-mail — на него придёт результат.');
      return;
    }
    setError('');
    setBusy(true);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        answers: JSON.stringify(answers),
        name: name.trim() || 'Клиент',
        email: email.trim(),
      })
    );
    router.push('/result');
  };

  const done = step >= QUESTIONS.length;
  // Красный флаг — ответ «Часто» или «Постоянно».
  const flagsSoFar = answers.filter((a) => a >= 2).length;

  return (
    <>
      <main className="shell">
        {!started ? (
          <>
            <section className="hero">
              <span className="hero-mark">
                <ShieldAlert size={14} strokeWidth={2} />
                15 вопросов · 3 минуты
              </span>
              <h1>
                Стоит ли возвращать — <em>детектор токсичности ваших отношений</em>
              </h1>
              <p className="hero-sub">
                15 вопросов о прошлых отношениях — и честный ответ, стоит ли пытаться снова.
                Без утешений и без запугивания: только то, что следует из ваших ответов.
              </p>
              <div style={{ maxWidth: 340, margin: '30px auto 0' }}>
                <button className="btn-primary" onClick={() => setStarted(true)}>
                  <Flag size={18} strokeWidth={2} />
                  Пройти детектор
                </button>
              </div>
              <p className="hero-note" style={{ marginTop: 14 }}>
                Анонимно, без регистрации. Процент и тип отношений — бесплатно.
              </p>
            </section>

            <div className="rule">
              <Flag size={17} strokeWidth={1.8} />
            </div>

            <section className="narrow">
              <h2 className="section-title">Что измеряет детектор</h2>
              <p className="section-lead">
                Пять категорий, по которым исследователи отношений отличают конфликтную пару
                от разрушительной.
              </p>

              <div style={{ marginTop: 26 }}>
                <div className="faq-item">
                  <h3>Контроль и изоляция</h3>
                  <p>
                    Проверки, отчёты, постепенное сужение круга общения. Ключевой признак —
                    не разовая ревность, а система.
                  </p>
                </div>
                <div className="faq-item">
                  <h3>Газлайтинг</h3>
                  <p>
                    Систематическое оспаривание вашей версии событий, после которого вы
                    начинаете сомневаться в собственной памяти.
                  </p>
                </div>
                <div className="faq-item">
                  <h3>Качели и лавбомбинг</h3>
                  <p>
                    Стремительное начало, затем чередование тепла и холода. Самый
                    затягивающий паттерн: непредсказуемость усиливает привязанность.
                  </p>
                </div>
                <div className="faq-item">
                  <h3>Это диагностика?</h3>
                  <p>
                    Нет. Это развлекательно-просветительский тест. Он не ставит диагнозов и
                    не заменяет консультацию психолога.
                  </p>
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="narrow" style={{ paddingTop: 56 }}>
            <div className="quiz-progress">
              {QUESTIONS.map((_, i) => (
                <span key={i} data-done={i < step ? 'true' : 'false'} />
              ))}
            </div>

            <div className="flag-counter">
              {flagsSoFar > 0 ? (
                <>
                  <Flag size={15} strokeWidth={2.2} color="var(--accent)" />
                  Красных флагов: <strong>{flagsSoFar}</strong>
                  <span className="flag-pips">
                    {QUESTIONS.map((_, i) => (
                      <i key={i} data-on={i < flagsSoFar ? 'true' : 'false'} />
                    ))}
                  </span>
                </>
              ) : null}
            </div>

            {!done ? (
              <>
                <p className="quiz-step">
                  Вопрос {step + 1} из {QUESTIONS.length}
                </p>
                <h2 className="quiz-question">{QUESTIONS[step].q}</h2>
                <div className="quiz-options">
                  {QUESTIONS[step].options.map((o, i) => (
                    <button className="quiz-option" key={i} onClick={() => choose(i)}>
                      {o.text}
                    </button>
                  ))}
                </div>
                {step > 0 ? (
                  <button className="quiz-back" onClick={() => setStep(step - 1)}>
                    <ArrowLeft size={15} strokeWidth={2} />
                    Назад
                  </button>
                ) : null}
              </>
            ) : (
              <form className="form-card" onSubmit={submit}>
                <h2 className="quiz-question" style={{ marginBottom: 8 }}>
                  Детектор отработал
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: 0, marginBottom: 22 }}>
                  Укажите почту — отправим на неё результат и PDF после открытия доступа.
                </p>

                <div className="field">
                  <label htmlFor="name">Имя</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Как к вам обращаться"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={40}
                  />
                </div>

                <div className="field">
                  <label htmlFor="email">E-mail</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {error ? <p className="field-error">{error}</p> : null}

                <button className="btn-primary" type="submit" disabled={busy}>
                  <ShieldAlert size={18} strokeWidth={2} />
                  {busy ? 'Считаем...' : 'Показать результат'}
                </button>

                <p className="consent">
                  Нажимая кнопку, вы соглашаетесь с{' '}
                  <Link href="/privacy">политикой конфиденциальности</Link> и{' '}
                  <Link href="/offer">условиями оферты</Link>.
                </p>
              </form>
            )}
          </section>
        )}

        {!started ? (
          <section className="narrow" style={{ marginTop: 48, textAlign: 'center' }}>
            <button
              className="btn-primary"
              style={{ maxWidth: 380, margin: '0 auto' }}
              onClick={() => setStarted(true)}
            >
              Пройти детектор
              <ArrowRight size={18} strokeWidth={2} />
            </button>
          </section>
        ) : null}
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
