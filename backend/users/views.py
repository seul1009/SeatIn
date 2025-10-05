import requests
from dj_rest_auth.registration.views import RegisterView
from .serializers import CustomRegisterSerializer
from django.conf import settings
from django.core.mail import send_mail, EmailMultiAlternatives
from django.shortcuts import redirect, render
from django.http import JsonResponse
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.html import strip_tags
from django.template.loader import render_to_string
from django.contrib.auth import get_user_model, authenticate
from .tokens import account_activation_token
from django.utils.encoding import force_bytes
from django.urls import reverse
from rest_framework.response import Response
from rest_framework import status, serializers
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# ✅ 이메일 인증 메일 전송 함수
def send_activation_email(user, request):
    token = account_activation_token.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))

    # ✅ 로컬 개발 환경에서는 localhost:8000 사용
    domain = "localhost:8000"

    # ✅ 실제 배포 시에는 settings에 DOMAIN 설정값을 쓰는 게 좋음
    # domain = getattr(settings, "DOMAIN", "localhost:8000")

    activate_url = f"http://{domain}{reverse('account_activate', kwargs={'uidb64': uid, 'token': token})}"

    mail_subject = "[SeatIn] 이메일 인증을 완료해주세요"

    # ✅ HTML 템플릿 렌더링
    html_message = render_to_string(
        "email/email_verification.html",
        {
            "user": user,
            "activate_url": activate_url,
        },
    )

    # ✅ 텍스트 버전 (HTML 제거)
    plain_message = strip_tags(html_message)

    # ✅ 이메일 생성 (멀티파트)
    email = EmailMultiAlternatives(
        subject=mail_subject,
        body=plain_message,
        from_email=settings.EMAIL_HOST_USER,
        to=[user.email],
    )
    email.attach_alternative(html_message, "text/html")

    # ✅ 발송
    email.send()


# ✅ 이메일 인증 링크 클릭 시 처리
def activate(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = get_user_model().objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, get_user_model().DoesNotExist):
        return JsonResponse({"error": "Invalid user or token"}, status=400)

    if account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()

        # ✅ 이메일 인증 후 JWT 자동 발급
        refresh = RefreshToken.for_user(user)
        return render(request, "email/email_verification_success.html", {
            "user": user,
        })
    else:
        return render(request, "email/email_verification_failed.html", status=400)

# ✅ 회원가입 후 이메일 인증 보내도록 오버라이드
class CustomRegisterView(RegisterView):
    serializer_class = CustomRegisterSerializer

    def perform_create(self, serializer):
        user = serializer.save(self.request)
        user.is_active = False  # 이메일 인증 전 비활성화
        user.save()
        send_activation_email(user, self.request)
        return user

    # ✅ 아래에서 `self.get_object()` → `serializer.instance` 로 수정해야 오류 방지됨
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.perform_create(serializer)

        # ✅ JWT 직접 생성 (이메일 인증 완료 후 로그인 가능)
        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "회원가입이 완료되었습니다. 이메일 인증 후 로그인해주세요.",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }, status=status.HTTP_201_CREATED)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # ✅ 이메일 인증 여부 확인
        if not self.user.is_active:
            raise serializers.ValidationError(
                {"detail": "이메일 인증을 완료해야 로그인할 수 있습니다."}
            )

        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# ✅ 네이버 소셜 로그인 콜백
def naver_callback(request):
    code = request.GET.get("code")
    state = request.GET.get("state")

    if not code or not state:
        return JsonResponse({"error": "Missing code or state"}, status=400)

    token_url = "https://nid.naver.com/oauth2.0/token"
    params = {
        "grant_type": "authorization_code",
        "client_id": settings.NAVER_CLIENT_ID,
        "client_secret": settings.NAVER_CLIENT_SECRET,
        "code": code,
        "state": state,
    }

    try:
        token_res = requests.get(token_url, params=params).json()
        access_token = token_res.get("access_token")

        if not access_token:
            return JsonResponse({"error": "Failed to get access token from Naver"}, status=400)

        profile_res = requests.get(
            "https://openapi.naver.com/v1/nid/me",
            headers={"Authorization": f"Bearer {access_token}"}
        ).json()

        return JsonResponse(profile_res)
    except requests.exceptions.RequestException as e:
        return JsonResponse({"error": f"Request failed: {str(e)}"}, status=500)


# ✅ 구글 소셜 로그인 콜백
def google_callback(request):
    code = request.GET.get("code")

    if not code:
        return JsonResponse({"error": "Missing code"}, status=400)

    token_url = "https://oauth2.googleapis.com/token"
    data = {
        "code": code,
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "redirect_uri": "http://localhost:8000/api/users/google/callback/",
        "grant_type": "authorization_code",
    }

    try:
        token_res = requests.post(token_url, data=data).json()
        access_token = token_res.get("access_token")

        if not access_token:
            return JsonResponse({"error": "Failed to get access token from Google"}, status=400)

        profile_res = requests.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"}
        ).json()

        return JsonResponse(profile_res)
    except requests.exceptions.RequestException as e:
        return JsonResponse({"error": f"Request failed: {str(e)}"}, status=500)
