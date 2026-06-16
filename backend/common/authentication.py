from rest_framework.authentication import SessionAuthentication

class CsrfExemptSessionAuthentication(SessionAuthentication):
    """
    Custom SessionAuthentication class that bypasses the DRF-level CSRF check.
    This is useful for decoupled React frontends communicating with Django.
    """
    def enforce_csrf(self, request):
        # Bypass CSRF checks for development / API communication
        return
