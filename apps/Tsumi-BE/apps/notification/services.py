from .models import Notification


def notify(user_id, kind, title, body="", errand=None):
    """Write an in-app notification. Call inside the caller's transaction so it
    only exists if the action it describes committed."""
    return Notification.objects.create(
        user_id=user_id, kind=kind, title=title, body=body, errand=errand
    )
