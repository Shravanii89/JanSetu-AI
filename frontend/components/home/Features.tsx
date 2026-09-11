"use client";

import React from "react";
import { Brain, Route, Clock, HeartHandshake, Sparkles } from "lucide-react";
import { useTranslation } from "../../context/LanguageContext";

export const Features: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      title: t("features.card1Title"),
      desc: t("features.card1Desc"),
      icon: Brain,
      tag: t("features.card1Tag"),
    },
    {
      title: t("features.card2Title"),
      desc: t("features.card2Desc"),
      icon: Route,
      tag: t("features.card2Tag"),
    },
    {
      title: t("features.card3Title"),
      desc: t("features.card3Desc"),
      icon: Clock,
      tag: t("features.card3Tag"),
    },
    {
      title: t("features.card4Title"),
      desc: t("features.card4Desc"),
      icon: HeartHandshake,
      tag: t("features.card4Tag"),
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-[#F5F4F0] border-b border-[#E9E9E9]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#1F5E91]/10 px-3.5 py-1 text-xs font-bold text-[#1F5E91] border border-[#1F5E91]/20 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-[#F39A32]" />
            <span>{t("features.tag")}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#123B5D] tracking-tight">
            {t("features.title")}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#667085]">
            {t("features.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#E9E9E9] bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5F4F0] text-[#1F5E91] group-hover:bg-[#1F5E91] group-hover:text-white transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-bold text-[#667085] bg-[#F5F4F0] px-2 py-0.5 rounded border border-[#E9E9E9]">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#1F2933] group-hover:text-[#1F5E91] transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-[#667085] mt-2 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#F5F4F0] flex items-center gap-1.5 text-xs font-bold text-[#1F5E91]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F39A32]" />
                  <span>{t("features.pmcVerified")}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
