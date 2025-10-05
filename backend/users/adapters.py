# users/adapters.py
from allauth.account.adapter import DefaultAccountAdapter
from django.core.mail import send_mail
from django.template.loader import render_to_string

class CustomAccountAdapter(DefaultAccountAdapter):
    def send_mail(self, template_prefix, email, context):
        # 사용자 정의 이메일 템플릿을 사용하여 이메일 발송
        subject = render_to_string(f"account/email/{template_prefix}_subject.txt", context)
        message = render_to_string(f"account/email/{template_prefix}.html", context)
        send_mail(subject, message, self.from_email, [email])
