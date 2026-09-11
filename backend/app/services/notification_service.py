"""
JanSetu AI - Notification Service
Provides in-app notification routing based on role and department.
"""

from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_, desc

from app.models.notification import NotificationModel
from app.models.user import UserModel
from app.rules.roles import MUNICIPAL_ADMIN, COLLECTOR, DEPARTMENT_OFFICER


class NotificationService:
    async def get_user_notifications(
        self,
        current_user: UserModel,
        limit: int = 20,
        db: AsyncSession = None,
    ) -> List[Dict[str, Any]]:
        """Fetches relevant notifications scoped to the user's role and department."""
        query = select(NotificationModel)

        conditions = [
            NotificationModel.user_id == str(current_user.id),
            NotificationModel.role == current_user.role,
        ]

        if current_user.role == DEPARTMENT_OFFICER and current_user.department_id:
            conditions.append(NotificationModel.department_id == current_user.department_id)

        query = query.where(or_(*conditions)).order_by(desc(NotificationModel.created_at)).limit(limit)

        res = await db.execute(query)
        notifications = res.scalars().all()

        return [
            {
                "id": str(n.id),
                "title": n.title,
                "message": n.message,
                "notification_type": n.notification_type,
                "ticket_id": n.ticket_id,
                "is_read": n.is_read,
                "created_at": n.created_at.isoformat(),
            }
            for n in notifications
        ]


notification_service = NotificationService()
