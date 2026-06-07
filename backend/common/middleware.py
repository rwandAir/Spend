import logging

logger = logging.getLogger(__name__)

class RequestLogMiddleware:
    """
    Middleware to log request details for audit trailing and debug.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Log basic request info
        user_info = request.user if hasattr(request, 'user') else 'Anonymous'
        logger.info(f"[{request.method}] {request.path} - User: {user_info}")

        response = self.get_response(request)

        # Log status code
        logger.info(f"[{request.method}] {request.path} -> Response status: {response.status_code}")
        return response
