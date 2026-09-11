"""
JanSetu AI - Custom Domain Exceptions
"""
class JanSetuException(Exception):
    """Base exception for JanSetu AI."""
    pass

class UnauthorizedException(JanSetuException):
    pass

class DepartmentAccessForbidden(JanSetuException):
    pass
