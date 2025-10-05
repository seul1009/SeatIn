import os
import requests
import base64
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json

@csrf_exempt
@require_POST
def confirm_payment(request):
    """
    프론트에서 paymentKey, orderId, amount를 받아 Toss API로 결제 승인
    """
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
        return JsonResponse(response.json())
    else:
        return JsonResponse(response.json(), status=response.status_code)
