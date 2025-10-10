import os
import requests
import base64
from rest_framework.response import Response
from rest_framework.decorators import api_view
import json

@api_view(["POST"])
def confirm_payment(request):
    try:
        data = json.loads(request.body)
        payment_key = data.get("paymentKey")
        order_id = data.get("orderId")
        amount = data.get("amount")

        secret_key = os.getenv("TOSS_SECRET_KEY")
        basic_token = base64.b64encode((secret_key + ":").encode("utf-8")).decode("utf-8")

        url = "https://api.tosspayments.com/v1/payments/confirm"
        headers = {
            "Authorization": f"Basic {basic_token}",
            "Content-Type": "application/json",
        }
        body = {
            "paymentKey": payment_key,
            "orderId": order_id,
            "amount": amount,
        }

        response = requests.post(url, json=body, headers=headers)

        if response.status_code == 200:
            return Response(response.json(), status=status.HTTP_200_OK)
        else:
            return Response(response.json(), status=response.status_code)
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )