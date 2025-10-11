from django.core.management.base import BaseCommand
from match.epl_crawler import DaumEplCrawler  

class Command(BaseCommand):
    help = "다음스포츠 EPL 경기 일정 크롤링 후 DB에 저장"

    def handle(self, *args, **kwargs):
        crawler = DaumEplCrawler()
        month = "10"  

        self.stdout.write(self.style.SUCCESS(f"⚽ {month}월 EPL 일정 수집 시작"))
        try:
            created = crawler.crawl(month)
            self.stdout.write(self.style.SUCCESS(f"✅ {month}월 EPL 경기 {created}건 저장 완료"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ 오류 발생: {e}"))
