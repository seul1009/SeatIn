import pytz
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException
from django.utils import timezone 
from match.models import Match

class DaumKboCrawler:
    BASE_URL = "https://sports.daum.net/schedule/kbo"

    def __init__(self):
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        self.driver = webdriver.Chrome(options=chrome_options)

    def crawl(self, month="10"):
        """KBO 10월 경기 일정 크롤링"""
        total_created = 0
        print(f"⚾ {month}월 KBO 경기 일정 크롤링 시작")

        total_created += self._crawl_month(month)

        self.driver.quit()
        print(f"✅ {month}월 KBO 경기 {total_created}건 저장 완료")
        return total_created

    def _get_text(self, el, selector):
        els = el.find_elements(By.CSS_SELECTOR, selector)
        return els[0].text.strip() if els else ""

    def _get_img_attr(self, el, attr):
        imgs = el.find_elements(By.TAG_NAME, "img")
        return imgs[0].get_attribute(attr).strip() if imgs else ""

    def _crawl_month(self, month):
        """지정 월 경기 크롤링"""
        url = f"{self.BASE_URL}?date=2025{month}01"
        print(f"📅 {url} 접속 중...")
        self.driver.get(url)

        try:
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_all_elements_located((By.CSS_SELECTOR, "#scheduleList tr[data-date]"))
            )
        except TimeoutException:
            print("⚠️ 경기 일정 로드 실패")
            return 0

        rows = self.driver.find_elements(By.CSS_SELECTOR, "#scheduleList tr[data-date]")
        created_count = 0

        for row in rows:
            try:
                date_str = row.get_attribute("data-date")  
                time_text = self._get_text(row, ".td_time") 
                location = self._get_text(row, ".td_area")
                state_game = self._get_text(row, ".state_game")

                if not (date_str and time_text):
                    continue

                dt = datetime.strptime(f"{date_str} {time_text}", "%Y%m%d %H:%M")
                date = timezone.make_aware(dt) 

                home_div = row.find_element(By.CSS_SELECTOR, ".info_team.team_home")
                away_div = row.find_element(By.CSS_SELECTOR, ".info_team.team_away")

                home_name = self._get_img_attr(home_div, "alt")
                away_name = self._get_img_attr(away_div, "alt")

                poster_home = self._get_img_attr(home_div, "src")
                poster_away = self._get_img_attr(away_div, "src")

                if not (home_name and away_name):
                    continue

                state_suffix = f" ({state_game})" if state_game else ""
                title = f"{away_name} vs {home_name}{state_suffix}"

                Match.objects.update_or_create(
                    title=title,
                    date=date,
                    defaults={
                        "category": "KBO",
                        "poster1": poster_away,
                        "poster2": poster_home,
                        "location": location,
                    },
                )
                created_count += 1
                print(f"✅ {date_str} | {title} 저장 완료")

            except NoSuchElementException:
                continue
            except Exception as e:
                print(f"⚠️ 행 파싱 실패 ({row.text[:30]}...): {e}")
                continue

        print(f"✅ {month}월 KBO 경기 {created_count}건 저장 완료")
        return created_count
