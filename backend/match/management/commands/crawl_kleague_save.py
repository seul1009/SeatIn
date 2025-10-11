from django.core.management.base import BaseCommand
from match.kleague_crawler import DaumKLeagueCrawler

class Command(BaseCommand):
    help = "다음스포츠 K리그1,2 경기 일정을 Selenium으로 크롤링 후 DB에 저장"

    def handle(self, *args, **kwargs):
        crawler = DaumKLeagueCrawler()
        month = "10"  

        self.stdout.write(self.style.SUCCESS(f"⚽ {month}월 K리그1,2 경기 일정 크롤링 시작"))

        try:
            created = crawler.crawl(month)
            self.stdout.write(self.style.SUCCESS(f"✅ {month}월 경기 {created}건 저장 완료"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ 오류 발생: {e}"))
