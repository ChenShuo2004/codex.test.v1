"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { CAREER_SUGGESTIONS } from "@/app/data/suggestions"; // 确保路径正确

// ✅ 新增：让 TypeScript 认识所有合法键
type CareerKey = keyof typeof CAREER_SUGGESTIONS;

// ✅ 判断是不是四大维度的合法 key
const isCareerKey = (k: string): k is CareerKey =>
  ["executing", "influencing", "relationship", "strategic"].includes(k);

// ✅ 如果是 composite，就强行归到 strategic
const DIMENSION_ALIAS: Partial<Record<string, CareerKey>> = {
  composite: "strategic",
};

// ✅ 统一函数来安全取值
function getSuggestionById(rawId: unknown) {
  const id = String(rawId);
  const mapped = DIMENSION_ALIAS[id] ?? id; // composite → strategic
  if (!isCareerKey(mapped)) return null; // 防止乱来的 id
  return CAREER_SUGGESTIONS[mapped];
}

export default function ResultsPage() {
  const router = useRouter();

  // 模拟你的 tier 数据，实际用你自己的
  const tiers = useMemo(
    () => [
      { dimension: { id: "executing" }, label: "执行力" },
      { dimension: { id: "composite" }, label: "综合题" },
      { dimension: { id: "relationship" }, label: "关系力" },
    ],
    []
  );

  const processed = useMemo(() => {
    return tiers.map((tier, index) => {
      if (!tier.dimension) return tier;

      const suggestion = getSuggestionById(tier.dimension.id);
      if (!suggestion) {
        // 如果拿不到，给个兜底空对象，防止报错
        return { ...tier, roles: [], summary: "" };
      }

      const roleBuckets = [suggestion.tier1, suggestion.tier2, suggestion.tier3];
      return {
        ...tier,
        roles: roleBuckets[Math.min(index, roleBuckets.length - 1)],
        summary: suggestion.summary,
      };
    });
  }, [tiers]);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-bold text-zinc-900">测评结果</h1>

      <section className="mt-6 space-y-4">
        {processed.map((tier, i) => (
          <div key={i} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold text-zinc-900">
                {tier.label}
              </p>
              <span className="text-sm text-zinc-500">
                维度：{tier.dimension?.id ?? "未知"}
              </span>
            </div>
            <p className="mt-2 text-sm text-zinc-600">
              职业建议摘要：{tier.summary || "暂无"}
            </p>
            {Array.isArray(tier.roles) && tier.roles.length > 0 && (
              <ul className="mt-2 list-disc pl-6 text-sm text-zinc-700">
                {tier.roles.map((r: string) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>

      <div className="mt-10">
        <button
          onClick={() => router.push("/")}
          className="rounded-2xl bg-blue-600 px-6 py-3 text-white font-semibold shadow-md"
        >
          返回首页
        </button>
      </div>
    </main>
  );
}
