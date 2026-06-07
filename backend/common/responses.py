from rest_framework.response import Response
from rest_framework import status

def success_response(data=None, message=None, status_code=status.HTTP_200_OK, **kwargs):
    response_data = {"success": True}
    if message is not None:
        response_data["message"] = message
    if data is not None:
        if isinstance(data, dict):
            response_data.update(data)
        else:
            response_data["data"] = data
    if kwargs:
        response_data.update(kwargs)
    return Response(response_data, status=status_code)

def error_response(error_message, status_code=status.HTTP_400_BAD_REQUEST, **kwargs):
    response_data = {
        "success": False,
        "error": error_message
    }
    if kwargs:
        response_data.update(kwargs)
    return Response(response_data, status=status_code)
