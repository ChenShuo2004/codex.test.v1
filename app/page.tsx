"use client";

import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  AnswerChoice,
  CHOICE_OPTIONS,
  DIMENSION_METADATA,
  QUESTIONS,
} from "@/app/data/questions";

const STORAGE_KEY = "gallup-strengths-answers";

type AnswerMap = Record<number, AnswerChoice>;

type DimensionIntro = Record<
  (typeof DIMENSION_METADATA)[number]["id"],
  { heading: string; detail: string }
>;

const DIMENSION_INTRO: DimensionIntro = {
  executing: {
    heading: "第一部分：执行力维度（1-20题）",
    detail: "特点：关注如何把事情做成",
  },
  influencing: {
    heading: "第二部分：影响力维度（21-40题）",
    detail: "特点：关注如何推动他人做事",
  },
  relationship: {
    heading: "第三部分：关系建立维度（41-60题）",
    detail: "特点：关注如何和他人建立联系",
  },
  strategic: {
    heading: "第四部分：战略思维维度（61-85题）",
    detail: "特点：关注如何做决策和规划",
  },
  composite: {
    heading: "第五部分：综合评估题（86-100题）",
    detail: "跨维度的整合题，检验整体协同力",
  },
};

const INFO_BLOCKS = [
  {
    title: "测试说明",
    content:
      "本问卷帮助你识别自己的天赋特长，覆盖执行力、影响力、关系建立和战略思维四个维度。",
  },
  {
    title: "答题方式",
    content:
      "请根据真实想法，从“特别同意A”到“特别同意B”五个选项中选择一个，所有题目都需要作答。",
  },
  {
    title: "评分提示",
    content:
      "提交后系统会按题目区间自动统计分值与优势等级，提供维度排序与职业建议。",
  },
];

const optionTone = (index: number) => {
  const colors = ["text-red-600", "text-orange-600", "text-zinc-500", "text-sky-600", "text-indigo-600"];
  return colors[index] ?? "text-zinc-600";
};

const groupQuestions = () => {
  const byDimension = new Map<
    (typeof DIMENSION_METADATA)[number]["id"],
    { title: string; description: string; sections: { title: string; questions: typeof QUESTIONS }[] }
  >();

  DIMENSION_METADATA.forEach((meta) => {
    byDimension.set(meta.id, {
      title: DIMENSION_INTRO[meta.id].heading,
      description: DIMENSION_INTRO[meta.id].detail,
      sections: [],
    });
  });

  QUESTIONS.forEach((question) => {
    const dimension = byDimension.get(question.dimension);
    if (!dimension) {
      return;
    }

    const sectionTitle = question.subDimension ?? dimension.title;
    let section = dimension.sections.find((item) => item.title === sectionTitle);

    if (!section) {
      section = { title: sectionTitle, questions: [] };
      dimension.sections.push(section);
    }

    section.questions.push(question);
  });

  return Array.from(byDimension.entries()).map(([dimensionId, data]) => ({
    id: dimensionId,
    ...data,
  }));
};

const QUESTION_SECTIONS = groupQuestions();

function OptionButton({
  label,
  short,
  selected,
  onSelect,
  index,
}: {
  label: string;
  short: string;
  selected: boolean;
  index: number;
  onSelect: () => void;
}) {
  const base = "flex flex-col items-center gap-1 rounded-2xl border px-3 py-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500";
  const selectedStyles = selected
    ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
    : "border-zinc-200 bg-white text-zinc-600 hover:border-blue-300";

  return (
    <button
      type="button"
      className={`${base} ${selectedStyles}`}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <span className={`text-xs font-semibold ${optionTone(index)}`}>{short}</span>
      <span className="text-[13px] leading-4 text-center">{label}</span>
    </button>
  );
}

function QuestionCard({
  question,
  value,
  onChange,
  showError,
}: {
  question: (typeof QUESTIONS)[number];
  value?: AnswerChoice;
  onChange: (choice: AnswerChoice) => void;
  showError: boolean;
}) {
  return (
    <div
      id={`question-${question.id}`}
      data-question-id={question.id}
      className={`rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm ${showError ? "ring-2 ring-red-400" : ""}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-blue-700">{question.title}</p>
          <p className="mt-1 text-base font-medium text-zinc-900">选项A</p>
          <p className="text-sm text-zinc-600">{question.optionA}</p>
          <p className="mt-3 text-base font-medium text-zinc-900">选项B</p>
          <p className="text-sm text-zinc-600">{question.optionB}</p>
        </div>
        <span className="text-sm font-medium text-zinc-500">#{question.id}</span>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-5">
        {CHOICE_OPTIONS.map((option, index) => (
          <OptionButton
            key={option.value}
            label={option.label}
            short={option.short}
            index={index}
            selected={value === option.value}
            onSelect={() => onChange(option.value)}
          />
        ))}
      </div>
      {showError ? (
        <p className="mt-3 text-sm text-red-600">请回答本题后再继续。</p>
      ) : null}
    </div>
  );
}

export default function SurveyPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [missingIds, setMissingIds] = useState<number[]>([]);

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const totalQuestions = QUESTIONS.length;
  const completion = Math.round((answeredCount / totalQuestions) * 100);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const cached = window.sessionStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as AnswerMap;
        startTransition(() => {
          setAnswers(parsed);
        });
      } catch {
        // ignore broken cache
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  }, [answers]);

  const handleChange = useCallback((id: number, choice: AnswerChoice) => {
    setAnswers((prev) => ({ ...prev, [id]: choice }));
    setMissingIds((prev) => prev.filter((missingId) => missingId !== id));
  }, []);

  const handleSubmit = () => {
    const stillMissing = QUESTIONS.filter((question) => !answers[question.id]).map(
      (question) => question.id,
    );

    if (stillMissing.length > 0) {
      setMissingIds(stillMissing);
      const target = document.getElementById(`question-${stillMissing[0]}`);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setPendingSubmit(true);
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    router.push("/results");
  };

  const resetForm = () => {
    setAnswers({});
    setMissingIds([]);
    window.sessionStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <header className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium text-blue-600">盖洛普优势测试完整版</p>
          <h1 className="mt-2 text-3xl font-semibold text-zinc-900">
            🎯 100道题天赋优势调查表
          </h1>
          <p className="mt-2 text-zinc-600">
            四大维度 × 100 道题，完整复刻盖洛普优势评估体验。完成所有题目后，系统会自动生成得分曲线、优势等级以及职业建议。
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {INFO_BLOCKS.map((block) => (
              <div key={block.title} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-zinc-900">{block.title}</p>
                <p className="mt-1 text-sm text-zinc-600">{block.content}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl bg-blue-50 p-4 text-sm text-blue-900">
            <span className="font-semibold">答题进度</span>
            <div className="h-2 w-48 rounded-full bg-blue-100">
              <div
                className="h-2 rounded-full bg-blue-600"
                style={{ width: `${completion}%` }}
              />
            </div>
            <span>
              {answeredCount}/{totalQuestions}（{completion}%）
            </span>
            <button
              type="button"
              className="ml-auto text-xs font-medium text-blue-800 underline"
              onClick={resetForm}
            >
              清空答题
            </button>
          </div>
        </header>

        <main className="mt-10 space-y-12">
          {QUESTION_SECTIONS.map((section) => (
            <section key={section.id} className="space-y-6">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-zinc-400">
                  {section.id.toUpperCase()}
                </p>
                <h2 className="text-2xl font-semibold text-zinc-900">
                  {section.title}
                </h2>
                <p className="text-sm text-zinc-600">{section.description}</p>
              </div>
              {section.sections.map((sub) => (
                <div key={sub.title} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <h3 className="text-lg font-semibold text-zinc-900">{sub.title}</h3>
                  </div>
                  <div className="space-y-6">
                    {sub.questions.map((question) => (
                      <QuestionCard
                        key={question.id}
                        question={question}
                        value={answers[question.id]}
                        showError={missingIds.includes(question.id)}
                        onChange={(choice) => handleChange(question.id, choice)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </section>
          ))}
        </main>

        <div className="sticky bottom-4 mt-12 flex flex-col gap-4 rounded-3xl border border-zinc-200 bg-white/90 p-6 backdrop-blur">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-base font-semibold text-zinc-900">
              进度 {answeredCount}/{totalQuestions}
            </p>
            <p className="text-sm text-zinc-500">
              完成全部题目后才能生成维度结论和职业建议
            </p>
          </div>
          {missingIds.length > 0 ? (
            <p className="text-sm text-red-600">
              还有 {missingIds.length} 题未作答，请补齐后再提交。
            </p>
          ) : null}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={pendingSubmit || answeredCount !== totalQuestions}
            className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-lg shadow-blue-200 transition disabled:cursor-not-allowed disabled:bg-zinc-300"
          >
            {answeredCount === totalQuestions
              ? pendingSubmit
                ? "生成结论中..."
                : "保存并查看结论"
              : "答完所有题目后解锁结论"}
          </button>
        </div>
      </div>
    </div>
  );
}
