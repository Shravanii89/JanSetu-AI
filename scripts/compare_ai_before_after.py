"""
JanSetu AI - Gemini API "Before & After" Comparison Script
Demonstrates exactly how JanSetu AI analyzes complaints:
1. BEFORE API Key (Deterministic Local Rule-Based NLP)
2. AFTER API Key (Google Gemini Generative AI)
"""

import os
import sys
import json
import asyncio
from dotenv import load_dotenv

# Load environment
REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
load_dotenv(os.path.join(REPO_ROOT, "backend", ".env"))
sys.path.insert(0, os.path.join(REPO_ROOT, "backend"))

from app.ai.pipeline.orchestrator import AIOrchestrator

SAMPLE_COMPLAINTS = [
    "Water pipeline broken near Baner road, clean drinking water flowing on road since 2 days, residents getting low pressure",
    "EMERGENCY: Live electrical cable snapped and hanging over footpath outside Modern College, Shivaji Nagar! Kids walking nearby!",
]

async def run_comparison():
    print("=" * 70)
    print("JANSETU AI: BEFORE vs AFTER GEMINI API KEY COMPARISON")
    print("=" * 70)

    for i, text in enumerate(SAMPLE_COMPLAINTS, 1):
        print(f"\n[TEST {i}] Input Citizen Grievance:")
        print(f'"{text}"\n')

        # ----------------------------------------------------
        # 1. BEFORE (Simulated by disabling API key flag)
        # ----------------------------------------------------
        orch_before = AIOrchestrator()
        orch_before.has_gemini = False  # Forces Local Deterministic NLP Engine
        res_before = await orch_before.analyze_complaint(text)

        # ----------------------------------------------------
        # 2. AFTER (Using active Gemini API Key)
        # ----------------------------------------------------
        orch_after = AIOrchestrator()
        orch_after.has_gemini = True   # Uses Gemini API
        res_after = await orch_after.analyze_complaint(text)

        print(f"{'METRIC':<25} | {'BEFORE (Local NLP)':<25} | {'AFTER (Google Gemini)':<30}")
        print("-" * 85)
        print(f"{'Provider':<25} | {str(res_before.get('provider')):<25} | {str(res_after.get('provider')):<30}")
        print(f"{'Department':<25} | {str(res_before.get('department')):<25} | {str(res_after.get('department')):<30}")
        print(f"{'Priority':<25} | {str(res_before.get('priority')):<25} | {str(res_after.get('priority')):<30}")
        print(f"{'Extracted Location':<25} | {str(res_before.get('extracted_location')):<25} | {str(res_after.get('extracted_location')):<30}")
        print(f"{'Extracted Duration':<25} | {str(res_before.get('extracted_duration')):<25} | {str(res_after.get('extracted_duration')):<30}")
        print(f"{'Sentiment Score':<25} | {str(res_before.get('sentiment_score')):<25} | {str(res_after.get('sentiment_score')):<30}")
        print(f"{'Confidence':<25} | {str(res_before.get('confidence')):<25} | {str(res_after.get('confidence')):<30}")

        print("\n--- AI Contextual Reasoning (Gemini Only) ---")
        print(res_after.get("reasoning", "N/A (Rules engine uses fixed regex template)"))

        print("\n--- Clarification Question Generated ---")
        q_before = res_before.get("clarification_questions", ["None"])[0] if res_before.get("clarification_questions") else "None"
        q_after = res_after.get("clarification_questions", ["None"])[0] if res_after.get("clarification_questions") else "None"
        print(f"BEFORE: {q_before}")
        print(f"AFTER:  {q_after}")
        print("=" * 85)

if __name__ == "__main__":
    asyncio.run(run_comparison())
