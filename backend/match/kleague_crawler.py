import time
from datetime import datetime
from django.utils import timezone 

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException

from match.models import Match


class DaumKLeagueCrawler:
    BASE_URLS = [
        "https://sports.daum.net/schedule/kl",   
        "https://sports.daum.net/schedule/kl2",  
    ]

    def __init__(self):
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        self.driver = webdriver.Chrome(options=chrome_options)

    def crawl(self, month="10"):
        total_created = 0

        for url in self.BASE_URLS:
            total_created += self._crawl_league(url, month)

        self.driver.quit()
        return total_created

    def _get_text(self, el, selector):
        els = el.find_elements(By.CSS_SELECTOR, selector)
        return els[0].text.strip() if els else ""

    def _get_img_attr(self, el, attr):
        imgs = el.find_elements(By.TAG_NAME, "img")
        return imgs[0].get_attribute(attr).strip() if imgs else ""

    def _team_name(self, team_div):
        name = self._get_text(team_div, "a.link_team span.txt_team")
        if not name:
            name = self._get_text(team_div, "a.link_team")
        if not name:
            name = self._get_img_attr(team_div, "alt")
        return name

    def _team_logo(self, team_div):
        return self._get_img_attr(team_div, "src")

    def _crawl_league(self, url, month):
        print(f"📅 {url} 크롤링 중...")
        self.driver.get(url)

        try:
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_all_elements_located((By.CSS_SELECTOR, "tr[data-date]"))
            )
        except TimeoutException:
            print(f"⚠️ {url} 경기 목록 로드 실패")
            return 0

        rows = self.driver.find_elements(
            By.CSS_SELECTOR, f"tr[data-date^='2025{month.zfill(2)}']"
        )

        created_count = 0
        for row in rows:
            try:
                date_str = row.get_attribute("data-date")
                if not date_str:
                    continue

                time_text = self._get_text(row, "td.td_time")
                if not time_text:
                    continue

                dt = datetime.strptime(f"{date_str} {time_text}", "%Y%m%d %H:%M")
                date = timezone.make_aware(dt) 

                location = self._get_text(row, "td.td_area")
                state_game = self._get_text(row, ".state_game")

                td_team = row.find_element(By.CSS_SELECTOR, "td.td_team")
                home_div = td_team.find_element(By.CSS_SELECTOR, ".info_team.team_home")
                away_div = td_team.find_element(By.CSS_SELECTOR, ".info_team.team_away")

                home_name = self._team_name(home_div)
                away_name = self._team_name(away_div)

                poster_home = self._team_logo(home_div)
                poster_away = self._team_logo(away_div)

                if not (home_name and away_name):
                    continue

                state_suffix = f" ({state_game})" if state_game else ""
                title = f"{away_name} vs {home_name}{state_suffix}"

                Match.objects.update_or_create(
                    title=title,
                    date=date,
                    defaults={
                        "category": "K리그",
                        "poster1": poster_away,
                        "poster2": poster_home,
                        "location": location,
                    },
                )

                created_count += 1
                print(f"✅ {date_str} | {away_name} vs {home_name} {state_game or ''} 저장 완료")

            except NoSuchElementException:
                continue
            except Exception as e:
                print(f"⚠️ 행 파싱 실패 ({row.text[:30]}...): {e}")
                continue

        print(f"✅ {url} {month}월 경기 {created_count}건 저장 완료")
        return created_count
