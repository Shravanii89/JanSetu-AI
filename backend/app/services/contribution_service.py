"""
JanSetu AI - Civic Contribution & Recognition Service
Server-side Civic Credits calculation, duplicate event protection, and badge unlocks.
"""

from typing import Optional, Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.exc import IntegrityError

from app.models.contribution import UserContributionModel
from app.models.badge import BadgeModel, UserBadgeModel
from app.models.complaint import ComplaintModel
from app.core.time import get_ist_now


class ContributionService:
    @staticmethod
    def get_level_for_credits(credits: int) -> str:
        """Determines citizen recognition level based on accumulated Civic Credits."""
        if credits >= 750:
            return "JanSetu Champion"
        elif credits >= 351:
            return "Civic Champion"
        elif credits >= 151:
            return "Community Contributor"
        elif credits >= 51:
            return "Active Citizen"
        return "Citizen"

    async def get_total_credits(self, user_id: str, db: AsyncSession) -> int:
        """Calculates total validated Civic Credits earned by a user."""
        res = await db.execute(
            select(func.coalesce(func.sum(UserContributionModel.credits), 0))
            .where(UserContributionModel.user_id == user_id)
        )
        return int(res.scalar() or 0)

    async def award_credits(
        self,
        user_id: str,
        event_type: str,
        credits: int,
        reference_id: Optional[str],
        description: str,
        db: AsyncSession,
    ) -> Optional[UserContributionModel]:
        """
        Awards Civic Credits to a user with strict server-side duplicate prevention.
        Only awards once per (user_id, event_type, reference_id).
        """
        if not user_id:
            return None

        # Check existing contribution
        if reference_id:
            existing = await db.execute(
                select(UserContributionModel).where(
                    UserContributionModel.user_id == user_id,
                    UserContributionModel.event_type == event_type,
                    UserContributionModel.reference_id == reference_id,
                )
            )
            if existing.scalars().first():
                return None

        contribution = UserContributionModel(
            user_id=user_id,
            event_type=event_type,
            credits=credits,
            reference_id=reference_id,
            description=description,
            created_at=get_ist_now(),
        )
        db.add(contribution)
        try:
            await db.flush()
        except IntegrityError:
            # Caught duplicate race condition
            return None

        # Check for newly unlocked badges
        await self.evaluate_and_award_badges(user_id, db)
        return contribution

    async def evaluate_and_award_badges(self, user_id: str, db: AsyncSession) -> List[str]:
        """Evaluates badge eligibility and unlocks any qualifying civic badges."""
        if not user_id:
            return []

        # Get existing user badges
        existing_res = await db.execute(
            select(UserBadgeModel.badge_id).where(UserBadgeModel.user_id == user_id)
        )
        existing_badges = set(existing_res.scalars().all())

        # Gather metrics for evaluation
        total_credits = await self.get_total_credits(user_id, db)

        actions_res = await db.execute(
            select(func.count(UserContributionModel.id)).where(UserContributionModel.user_id == user_id)
        )
        total_actions = int(actions_res.scalar() or 0)

        complaints_res = await db.execute(
            select(func.count(ComplaintModel.id)).where(ComplaintModel.citizen_id == user_id)
        )
        total_complaints = int(complaints_res.scalar() or 0)

        clarifications_res = await db.execute(
            select(func.count(UserContributionModel.id)).where(
                UserContributionModel.user_id == user_id,
                UserContributionModel.event_type.in_(["CLARIFICATION_PROVIDED", "EVIDENCE_UPLOADED"])
            )
        )
        has_detail = int(clarifications_res.scalar() or 0) > 0

        resolved_res = await db.execute(
            select(func.count(UserContributionModel.id)).where(
                UserContributionModel.user_id == user_id,
                UserContributionModel.event_type.in_(["COMPLAINT_RESOLVED", "VERIFIED_REPORT"])
            )
        )
        has_resolved = int(resolved_res.scalar() or 0) > 0

        unlocked: List[str] = []

        async def _award(badge_id: str):
            if badge_id not in existing_badges:
                ub = UserBadgeModel(
                    user_id=user_id,
                    badge_id=badge_id,
                    earned_at=get_ist_now(),
                )
                db.add(ub)
                existing_badges.add(badge_id)
                unlocked.append(badge_id)

        # 1. First Voice: 1 or more complaints submitted
        if total_complaints >= 1:
            await _award("first_voice")

        # 2. Civic Starter: 5 or more civic contribution actions
        if total_actions >= 5:
            await _award("civic_starter")

        # 3. Detail Contributor: provided clarification or evidence
        if has_detail:
            await _award("detail_contributor")

        # 4. Community Reporter: 2 or more complaints submitted
        if total_complaints >= 2:
            await _award("community_reporter")

        # 5. Civic Champion: 350+ credits accumulated
        if total_credits >= 350:
            await _award("civic_champion")

        # 6. Responsible Citizen: verified resolution feedback
        if has_resolved:
            await _award("responsible_citizen")

        if unlocked:
            try:
                await db.flush()
            except IntegrityError:
                pass

        return unlocked

    async def get_user_badges_summary(self, user_id: str, db: AsyncSession) -> Dict[str, Any]:
        """Returns list of earned badges and all available badges with criteria."""
        all_badges_res = await db.execute(select(BadgeModel).order_by(BadgeModel.required_credits))
        all_badges = all_badges_res.scalars().all()

        user_badges_res = await db.execute(
            select(UserBadgeModel).where(UserBadgeModel.user_id == user_id)
        )
        user_badges_map = {ub.badge_id: ub.earned_at for ub in user_badges_res.scalars().all()}

        badges_list = []
        for b in all_badges:
            is_earned = b.id in user_badges_map
            badges_list.append({
                "id": b.id,
                "name": b.name,
                "icon": b.icon,
                "description": b.description,
                "criteria": b.criteria,
                "required_credits": b.required_credits,
                "is_earned": is_earned,
                "earned_at": user_badges_map.get(b.id),
            })

        return {
            "total_earned": len(user_badges_map),
            "badges": badges_list,
        }

    async def get_user_contributions_history(self, user_id: str, db: AsyncSession) -> List[Dict[str, Any]]:
        """Returns chronological activity history of credits earned by user."""
        res = await db.execute(
            select(UserContributionModel)
            .where(UserContributionModel.user_id == user_id)
            .order_by(UserContributionModel.created_at.desc())
        )
        rows = res.scalars().all()
        return [
            {
                "id": r.id,
                "event_type": r.event_type,
                "credits": r.credits,
                "reference_id": r.reference_id,
                "description": r.description,
                "created_at": r.created_at,
            }
            for r in rows
        ]


contribution_service = ContributionService()
