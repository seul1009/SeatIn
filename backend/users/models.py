from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.conf import settings

class MemberManager(BaseUserManager):
    def create_user(self, email, password=None, username=None, phone=None, **extra_fields):
        if not email:
            raise ValueError("이메일은 필수입니다.")
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, phone=phone, **extra_fields)
        user.set_password(password)  # 비밀번호 해시 저장

        if not extra_fields.get("is_superuser"):
            user.is_active = False  # 기본적으로 회원을 비활성화 상태로 설정
        
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class Member(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=50, blank=True, null=True, unique=False)
    phone = models.BigIntegerField(blank=True, null=True)
    is_active = models.BooleanField(default=False)  # 이메일 인증 후 활성화 여부

    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)    
    is_superuser = models.BooleanField(default=False)

    objects = MemberManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.username} ({self.email})"

# 로그인 -> 정보 수정 시, 잠시 인증 코드 저장
class EmailVerification(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.code} ({self.created_at.strftime('%Y-%m-%d %H:%M:%S')})"