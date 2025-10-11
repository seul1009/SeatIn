import os
import requests
import base64
from rest_framework.response import Response
from rest_framework.decorators import api_view
import json

@api_view(["POST"])
def home(request):
    try: