from django.http import HttpResponse, FileResponse
from fpdf import FPDF
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import numpy as np
import os
from rest_framework.decorators import api_view
from reportAI.settings import BASE_DIR

import matplotlib
matplotlib.use('Agg')

class PDF(FPDF):
    def header(self):
        self.set_fill_color(27, 26, 85)  # Navy blue background
        self.rect(0, 0, 210, 76, 'F')  # Header rectangle

        self.set_text_color(255, 255, 255)  # White text
        self.set_font('font', 'B', 24)  # Use the registered Unicode font
        self.set_xy(10, 15)
        self.cell(0, 20, 'Falcon 님의 분석 리포트', 0, 1, 'L')

        self.set_font('font', 'B', 12)
        self.set_xy(180, 15)
        self.cell(0, 20, 'SCF', 0, 1, 'R')

    def footer(self):
        self.set_y(-15)
        self.set_font('font', 'B', 8)
        self.set_text_color(128)
        self.cell(0, 10, f'- {self.page_no()} -', 0, 0, 'C')

    def add_section(self, title, value, x, y, w=50, h=30):
        self.set_xy(x, y)
        self.set_fill_color(255, 255, 255)
        self.rect(x, y, w, h, 'F')
        self.rect(x, y, w, h)

        self.set_text_color(0, 0, 0)
        self.set_font('font', 'B', 16)
        self.set_xy(x, y + 5)
        self.cell(w, 10, title, 0, 1, 'C')

        self.set_font('font', 'B', 24)
        self.set_xy(x, y + 15)
        self.cell(w, 10, value, 0, 1, 'C')

    def add_analysis_section(self, title, x, y, w, h, image_path=None):
        self.set_xy(x, y)
        self.set_fill_color(255, 255, 255)
        self.rect(x, y, w, h, 'F')
        self.rect(x, y, w, h)

        self.set_text_color(0, 0, 0)
        self.set_font('font', 'B', 12)
        self.set_xy(x + 2, y)
        self.cell(w, 10, title, 0, 1, 'L')

        if image_path:
            # Adjust the height to make sure it fits within the section
            img_w = w - 4  # Width with padding
            img_h = h - 20  # Height with padding (title space)
            self.image(image_path, x + 2, y + 12, img_w, img_h)  # Added padding for image placement

def create_hexagonal_radar_chart():
    categories = ['Input', 'List', 'Print', 'Graph', 'Python', 'CS']
    values = [100, 63, 20, 51, 60, 0]

    angles = np.linspace(0, 2 * np.pi, len(categories), endpoint=False).tolist()
    values += values[:1]
    angles += angles[:1]

    fig, ax = plt.subplots(figsize=(4, 4), subplot_kw=dict(polar=True))  # Adjust size to fit the section
    ax.fill(angles, values, color='blue', alpha=0.25)
    ax.plot(angles, values, color='blue', linewidth=2)

    ax.set_yticklabels([])
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(categories)

    plt.title('Accuracy Rate', size=15, color='blue', y=1.1)
    plt.savefig('hexagonal_radar_chart.png', bbox_inches='tight', pad_inches=0, dpi=100)
    plt.close()

def create_bar_chart():
    categories = ['1st', '2nd', '3rd', 'Below 4th']
    values = [1, 3, 2, 5]

    fig, ax = plt.subplots(figsize=(4, 4))  # Adjust size to fit the section
    ax.bar(categories, values, color='blue')

    ax.set_xlabel('Rank')
    ax.set_ylabel('Count')
    ax.set_title('Recent History')

    plt.savefig('bar_chart.png', bbox_inches='tight', pad_inches=0, dpi=100)
    plt.close()

def generate_pdf():
    pdf = PDF()

    # 유니코드 폰트 등록
    base_dir = os.path.dirname(os.path.abspath(__file__))
    font_path = os.path.join(base_dir, 'fonts', 'NotoSansKR-Regular.ttf')
    pdf.add_font('font', '', font_path, uni=True)

    font_path = os.path.join(base_dir, 'fonts', 'NotoSansKR-Bold.ttf')
    pdf.add_font('font', 'B', font_path, uni=True)

    # 페이지 추가
    pdf.add_page()

    # 정보 추가 (해결한 문제 수, 시도한 문제 수, 멀티 평균 순위)
    pdf.add_section('해결한 문제 수', '26개', 20, 60)
    pdf.add_section('시도한 문제 수', '16개', 80, 60)
    pdf.add_section('멀티 평균 순위', '6위', 140, 60)

    # 분석 섹션 추가 (AI 종합 분석, 영역별 분석, 최근 기록 분석, AI 추천 문제)
    create_hexagonal_radar_chart()
    create_bar_chart()

    pdf.add_analysis_section('AI 종합 분석', 20, 100, 170, 45)
    pdf.add_analysis_section('영역별 분석', 20, 155, 80, 65, 'hexagonal_radar_chart.png')
    pdf.add_analysis_section('최근 기록 분석', 110, 155, 80, 65, 'bar_chart.png')
    pdf.add_analysis_section('AI 추천 문제', 20, 230, 170, 45)

    # 임시 파일 생성
    output_path = './analysis_report.pdf'
    pdf.output(output_path)
    return output_path

@api_view(['GET'])
def index(request):
    pdf_path = generate_pdf()

    # PDF 파일을 읽어 HttpResponse로 반환
    with open(pdf_path, 'rb') as pdf_file:
        response = HttpResponse(pdf_file.read(), content_type='application/pdf')
        response['Content-Disposition'] = 'inline; filename="analysis_report.pdf"'

    # PDF 파일 삭제 (옵션)
    os.remove(pdf_path)
    os.remove('hexagonal_radar_chart.png')
    os.remove('bar_chart.png')

    return response
