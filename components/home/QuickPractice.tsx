"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Check, CircleCheck, MessageCircle, RotateCcw } from "lucide-react";
import { getPracticeStartIndex, HOME_PRACTICE_QUESTIONS } from "@/lib/home-practice";
import styles from "./QuickPractice.module.css";

export function QuickPractice({ initialIndex }: { initialIndex: number }) {
  const [startIndex] = useState(() => getPracticeStartIndex(initialIndex));
  const [step, setStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const hasInteracted = useRef(false);
  const questionRef = useRef<HTMLLegendElement>(null);
  const finishedRef = useRef<HTMLHeadingElement>(null);
  const total = HOME_PRACTICE_QUESTIONS.length;
  const question = HOME_PRACTICE_QUESTIONS[(startIndex + step) % total];
  const isCorrect = selectedAnswer === question.correctAnswer;

  useEffect(() => {
    if (!hasInteracted.current) return;
    if (isFinished) finishedRef.current?.focus();
    else questionRef.current?.focus();
  }, [step, isFinished]);

  function checkAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selectedAnswer === null || isChecked) return;
    setIsChecked(true);
  }

  function nextQuestion() {
    hasInteracted.current = true;
    if (step === total - 1) {
      setIsFinished(true);
      return;
    }
    setStep((current) => current + 1);
    setSelectedAnswer(null);
    setIsChecked(false);
  }

  function restart() {
    hasInteracted.current = true;
    setStep(0);
    setSelectedAnswer(null);
    setIsChecked(false);
    setIsFinished(false);
  }

  return (
    <section className={styles.practice} aria-labelledby="home-practice-title">
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.icon}><MessageCircle size={18} aria-hidden="true" /></span>
          <h2 id="home-practice-title">Мініпрактика</h2>
        </div>
        <span className={styles.badge}>Без оцінки</span>
      </header>

      {isFinished ? (
        <div className={styles.finished}>
          <span className={styles.finishedIcon}><CircleCheck size={28} aria-hidden="true" /></span>
          <h3 ref={finishedRef} tabIndex={-1}>Практику завершено</h3>
          <p>Шість ситуацій для впевненої розмови з покупцем. Повертайтеся, коли захочете потренуватися ще.</p>
          <button type="button" className={styles.action} onClick={restart}>
            Повторити практику <RotateCcw size={16} aria-hidden="true" />
          </button>
        </div>
      ) : (
        <form onSubmit={checkAnswer} className={styles.form}>
          <div className={styles.context}>
            <span>{question.topic}</span>
            <span className={styles.counter}>{step + 1}<span> / {total}</span></span>
          </div>
          <div className={styles.progress} role="progressbar" aria-label="Прогрес мініпрактики" aria-valuemin={0} aria-valuemax={total} aria-valuenow={step + 1}>
            {HOME_PRACTICE_QUESTIONS.map((item, index) => <span key={item.id} className={index <= step ? styles.progressActive : undefined} />)}
          </div>

          <fieldset className={styles.question} disabled={isChecked}>
            <legend ref={questionRef} tabIndex={-1}>{question.situation}</legend>
            <div className={styles.answers}>
              {question.answers.map((answer, index) => {
                const correctChoice = isChecked && index === question.correctAnswer;
                const wrongChoice = isChecked && index === selectedAnswer && !isCorrect;
                return (
                  <label key={question.id + index} className={[styles.choice, correctChoice ? styles.choiceCorrect : "", wrongChoice ? styles.choiceIncorrect : ""].filter(Boolean).join(" ")}>
                    <input type="radio" name="practice-answer" value={index} checked={selectedAnswer === index} onChange={() => setSelectedAnswer(index)} />
                    <span>{answer}</span>
                    {correctChoice && <Check size={16} className={styles.answerCheck} aria-label="Правильна відповідь" />}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className={styles.feedback} role="status" aria-live="polite" aria-atomic="true">
            {isChecked && (
              <div className={isCorrect ? styles.feedbackCorrect : styles.feedbackHint}>
                <strong>{isCorrect ? "Саме так!" : "Є кращий підхід"}</strong>
                <p>{question.explanation}</p>
              </div>
            )}
          </div>
          <footer className={styles.footer}>
            <span>{isChecked ? "Спробуйте наступну ситуацію." : "Оберіть один варіант."}</span>
            {isChecked ? (
              <button type="button" className={styles.action} onClick={nextQuestion}>
                {step === total - 1 ? "Завершити практику" : "Наступна ситуація"} <ArrowRight size={16} aria-hidden="true" />
              </button>
            ) : (
              <button type="submit" className={styles.action} disabled={selectedAnswer === null}>Перевірити відповідь <ArrowRight size={16} aria-hidden="true" /></button>
            )}
          </footer>
        </form>
      )}
    </section>
  );
}
