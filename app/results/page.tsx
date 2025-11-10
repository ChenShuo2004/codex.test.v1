"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ADVANTAGE_LEVELS,
  AnswerChoice,
  CAREER_SUGGESTIONS,
  CHOICE_SCORE,
  CHOICE_TENDENCY,
  DIMENSION_METADATA,
  QUESTIONS,
  SUB_DIMENSIONS,
} from "@/app/data/questions";

const STORAGE_KEY = "gallup-strengths-answers";

type AnswerMap = Record<number, AnswerChoice>;

type AdvantageLevel = (typeof ADVANTAGE_LEVELS)[number];

type DimensionResult = {
  id: (typeof DIMENSION_METADATA)[number]["id"];
  title: string;
  description: string;
  totalScore: number;
  range: [number, number];
  aCount: number;
  bCount: number;
  netScore: number;
  level: AdvantageLevel;
};

type SubInsight = {
  id: string;
  dimensionId: DimensionResult["id"];
  title: string;
  range: [number, number];
  aCount: number;
  bCount: number;
  message: string;
};

const findAdvantageLevel = (net: number): AdvantageLevel => {
  return (
    ADVANTAGE_LEVELS.find(
      (level) => net >= level.min && net <= level.max,
    ) ?? ADVANTAGE_LEVELS[ADVANTAGE_LEVELS.length - 1]
  );
};

const formatRange = (range: [number, number]) => `${range[0]} 至 ${range[1]}`;

export default function ResultsPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<AnswerMap | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const cached = window.sessionStorage.getItem(STORAGE_KEY);
    if (!cached) {
      router.replace("/");
      return;
    }
    try {
      const parsed = JSON.parse(cached) as AnswerMap;
      startTransition(() => {
        setAnswers(parsed);
      });
    } catch {
      router.replace("/");
    }
  }, [router]);

  const dimensionResults = useMemo<DimensionResult[]>(() => {
    if (!answers) {
      return [];
    }

    return DIMENSION_METADATA.map((meta) => {
      const dimensionQuestions = QUESTIONS.filter(
        (question) => question.dimension === meta.id,
      );

      let totalScore = 0;
      let aCount = 0;
      let bCount = 0;

      dimensionQuestions.forEach((question) => {
        const answer = answers[question.id];
        if (!answer) {
          return;
        }
        totalScore += CHOICE_SCORE[answer];
        const tendency = CHOICE_TENDENCY[answer];
        if (tendency === "A") {
          aCount += 1;
        } else if (tendency === "B") {
          bCount += 1;
        }
      });

      const netScore = aCount - bCount;

      return {
        id: meta.id,
        title: meta.title,
        description: meta.description,
        totalScore,
        range: meta.range,
        aCount,
        bCount,
        netScore,
        level: findAdvantageLevel(netScore),
      };
    });
  }, [answers]);

  const subInsights = useMemo<SubInsight[]>(() => {
    if (!answers) {
      return [];
    }
    return SUB_DIMENSIONS.map((sub) => {
      const relevantQuestions = QUESTIONS.filter(
        (question) =>
          question.id >= sub.questionRange[0] && question.id <= sub.questionRange[1],
      );

      let aCount = 0;
      let bCount = 0;

      relevantQuestions.forEach((question) => {
        const answer = answers[question.id];
        if (!answer) {
          return;
        }
        const tendency = CHOICE_TENDENCY[answer];
        if (tendency === "A") {
          aCount += 1;
        } else if (tendency === "B") {
          bCount += 1;
        }
      });

      let message = sub.neutralMessage;
      if (aCount >= 3) {
        message = sub.aMessage;
      } else if (bCount >= 3) {
        message = sub.bMessage;
      }

      return {
        id: sub.id,
        title: sub.title,
        dimensionId: sub.dimension,
        range: sub.questionRange,
        aCount,
        bCount,
        message,
      };
    });
  }, [answers]);

  const rankedCoreDimensions = useMemo(() => {
    return dimensionResults
      .filter((dimension) => dimension.id !== "composite")
      .sort((a, b) => b.totalScore - a.totalScore);
  }, [dimensionResults]);

  const compositeResult = dimensionResults.find(
    (dimension) => dimension.id === "composite",
  );

  const leadingDimension = rankedCoreDimensions[0];
  const secondaryDimension = rankedCoreDimensions[1];
  const tertiaryDimension = rankedCoreDimensions[2];

  const careerPlan = useMemo(() => {
    const tiers: { label: string; dimension?: DimensionResult; roles?: string[]; summary?: string }[] = [
      { label: "一级适配", dimension: leadingDimension },
      { label: "二级适配", dimension: secondaryDimension },
      { label: "三级适配", dimension: tertiaryDimension },
    ];

    return tiers.map((tier, index) => {
      if (!tier.dimension) {
        return tier;
      }
      const suggestion = CAREER_SUGGESTIONS[tier.dimension.id];
      if (!suggestion) {
        return tier;
      }
      const roleBuckets = [suggestion.tier1, suggestion.tier2, suggestion.tier3];
      return {
        ...tier,
        roles: roleBuckets[Math.min(index, roleBuckets.length - 1)],
        summary: suggestion.summary,
      };
    });
  }, [leadingDimension, secondaryDimension, tertiaryDimension]);

  if (!answers || dimensionResults.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center text-zinc-600">
        <p className="text-lg font-semibold">正在加载你的作答结果…</p>
        <p className="mt-2 text-sm">如长时间未跳转，请返回表单重新提交。</p>
        <button
          type="button"
          className="mt-6 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
          onClick={() => router.replace("/")}
        >
          返回调查表
        </button>
      </div>
    );
  }

  const summaryText = leadingDimension
    ? `你的核心优势来自 ${leadingDimension.title}（净分 ${leadingDimension.netScore}），${leadingDimension.level.label}。`
    : "完成作答即可查看完整分析。";

  const followupText = secondaryDimension
    ? `次要优势为 ${secondaryDimension.title}，说明你在该领域也有稳定输出。`
    : "";

  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <header className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium text-blue-600">结果解读</p>
          <h1 className="mt-2 text-3xl font-semibold text-zinc-900">🎯 盖洛普优势测试结论</h1>
          <p className="mt-3 text-zinc-700">{summaryText} {followupText}</p>
          {compositeResult ? (
            <p className="mt-1 text-sm text-zinc-500">
              综合评估题总分 {compositeResult.totalScore}（范围 {formatRange(compositeResult.range)}），帮助你审视跨维度协同能力。
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-2xl border border-zinc-200 px-5 py-2 text-sm font-semibold text-zinc-800"
              onClick={() => router.push("/")}
            >
              返回修改问卷
            </button>
            <button
              type="button"
              className="rounded-2xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              回到顶部
            </button>
          </div>
        </header>

        <section className="mt-10 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-zinc-900">维度得分与优势等级</h2>
            <p className="text-sm text-zinc-600">
              总分来自题目得分（A+/A 为正，B+/B 为负），净分为 A 倾向题数减去 B 倾向题数，对应优势等级。范围列展示理论最高/最低值。
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {dimensionResults.map((dimension) => (
              <div
                key={dimension.id}
                className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-600">
                      {dimension.title}
                    </p>
                    <p className="text-xs text-zinc-500">{dimension.description}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${dimension.level.color}`}
                  >
                    {dimension.level.label}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs text-zinc-500">总分</p>
                    <p className="text-xl font-semibold text-zinc-900">
                      {dimension.totalScore}
                    </p>
                    <p className="text-xs text-zinc-500">范围 {formatRange(dimension.range)}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs text-zinc-500">净分（A-B）</p>
                    <p className="text-xl font-semibold text-zinc-900">
                      {dimension.netScore}
                    </p>
                    <p className="text-xs text-zinc-500">
                      A 倾向 {dimension.aCount} / B 倾向 {dimension.bCount}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-zinc-900">子维度洞察</h2>
            <p className="text-sm text-zinc-600">
              每个子维度统计 5 道题（战略思维含 5 组），A 倾向 ≥ 3 判定为 A 风格，B 倾向 ≥ 3 判定为 B 风格。
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {subInsights.map((insight) => (
              <div key={insight.id} className="rounded-3xl border border-zinc-200 bg-white p-5">
                <div className="flex items-center justify-between text-sm">
                  <p className="font-semibold text-zinc-900">{insight.title}</p>
                  <span className="text-xs text-zinc-500">题号 {insight.range[0]}-{insight.range[1]}</span>
                </div>
                <p className="mt-2 text-xs text-zinc-500">
                  A 倾向 {insight.aCount}｜B 倾向 {insight.bCount}
                </p>
                <p className="mt-3 text-sm text-zinc-700">{insight.message}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-zinc-900">职业适配建议</h2>
            <p className="text-sm text-zinc-600">
              根据维度排序给出三层次建议，可结合个人经验进一步筛选目标岗位。
            </p>
          </div>
          <div className="space-y-4">
            {careerPlan.map((tier) => (
              <div
                key={tier.label}
                className="rounded-3xl border border-zinc-200 bg-white p-5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {tier.label}
                  </span>
                  {tier.dimension ? (
                    <p className="text-sm font-semibold text-zinc-900">
                      {tier.dimension.title} · 净分 {tier.dimension.netScore}
                    </p>
                  ) : (
                    <p className="text-sm font-semibold text-zinc-500">
                      待完成更多题目
                    </p>
                  )}
                </div>
                {tier.summary ? (
                  <p className="mt-2 text-sm text-zinc-600">{tier.summary}</p>
                ) : null}
                {tier.roles ? (
                  <p className="mt-3 text-sm text-zinc-900">
                    推荐岗位：{tier.roles.join("、")}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-zinc-900">下一步如何应用结果</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-sm text-zinc-700">
            <li>在团队分工时优先承担与你优势维度匹配的职责，发挥自然动力。</li>
            <li>关注净分较低的维度，寻找互补伙伴或设定增强计划。</li>
            <li>复盘重大决策，将优势维度作为判断依据，弱项维度引入外部视角。</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
