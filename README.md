# Professional Sales & Revenue Analysis Dashboard

An end-to-end Data Analytics platform built to process, clean, analyze, visualize, and extract business insights from sales datasets dynamically using Python (Pandas/FastAPI) and React (Vite/Tailwind CSS/Recharts).

---

## 🌟 Key Highlights & Principles

- **No Hardcoded Analytics**: Every single KPI card, chart tick, ranking list, table row, quality score, and natural-language insight is computed dynamically from the dataset using Python/Pandas.
- **Automated Data Cleaning**: Raw CSV and Excel (.xlsx) file upload pipeline automatically handles missing values, removes duplicates, coerces dates, fixes invalid quantities, recalculates missing revenue (`Quantity × Unit Price`), and derives profit margins.
- **Indian Business Context**: All financial metrics, charts, tables, and reports are formatted in **Indian Rupees (₹)** using standard Indian comma notation (`₹25,000`, `₹1.25 Lakh`, `₹2.40 Crore`) and compact chart scales (`₹1.2L`, `₹45K`).
- **Interactive Filtering & Recalculation**: Multi-parameter filter panel (Date range, Category, Product, Region, Customer, Sales Channel, Time Grain) with a prominent **Reset Filters** button that triggers live recalculation across all dashboard modules.
- **Data Quality Scoring Engine**: Dynamic quality score (e.g. `95.4%`) calculated algorithmically based on missingness ratios, duplicate counts, date validity, and structural health.
- **Executive Exports**: Filtered data exports to CSV, Excel (.xlsx), and executive summary PDF report generation via ReportLab.

---

## 🚀 Technology Stack

### Backend & Data Processing
- **Python 3.12**
- **FastAPI**: Asynchronous RESTful API framework
- **Pandas**: Core data engine for cleaning, transformation, aggregations, and stats
- **NumPy**: Numerical arrays and histogram binning
- **ReportLab**: Executive PDF summary report generation
- **OpenPyXL**: Excel reading and export engine

### Frontend & Data Visualization
- **React 18 (Vite)**
- **Tailwind CSS**: Executive dark-mode dashboard styling with custom scrollbars
- **Recharts**: Responsive area, line, bar, donut, and composed charts
- **Lucide React**: Modern icons set

---

## 🏗️ Project Architecture

```
sales-revenue-dashboard/
│
├── backend/
│   ├── main.py                  # FastAPI server entry point
│   ├── routes/
│   │   └── api.py               # REST API endpoints
│   ├── services/
│   │   ├── cleaning_service.py  # Pandas auto-cleaning & quality audit engine
│   │   ├── data_engine.py       # Core analytics & dynamic calculation engine
│   │   ├── insights_generator.py# Automated natural language insights generator
│   │   └── pdf_generator.py     # ReportLab executive PDF report builder
│   ├── models/
│   │   └── schema.py            # Pydantic data schemas
│   ├── utils/
│   │   ├── indian_formatter.py  # INR formatting utilities (₹, Lakh, Crore)
│   │   └── sample_generator.py  # Realistic 650+ record Indian sales data generator
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/          # Sidebar & Header components
│   │   │   ├── filters/         # FilterPanel component
│   │   │   ├── dashboard/       # KPICard & InsightsWidget components
│   │   │   └── tables/          # Interactive DataTable component
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── SalesAnalysisPage.jsx
│   │   │   ├── ProductAnalysisPage.jsx
│   │   │   ├── CustomerAnalysisPage.jsx
│   │   │   ├── DataImportPage.jsx
│   │   │   ├── DataQualityPage.jsx
│   │   │   └── ReportsPage.jsx
│   │   ├── services/
│   │   │   └── api.js           # API HTTP client
│   │   ├── hooks/
│   │   │   └── useSalesData.js  # React analytical state hook
│   │   └── utils/
│   │       └── formatters.js    # INR & number formatters
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── data/
│   └── sample_sales.csv         # Standard 650+ record sample sales dataset
│
└── README.md
```

---

## 📊 Data Pipeline & Data Cleaning Methodology

When a CSV or XLSX dataset is loaded (or uploaded via the Data Import page):

1. **Validation**: Checks file existence, non-emptiness, and file extensions.
2. **Standardization**: Strips whitespace from headers and maps column names to standard keys (`Order ID`, `Date`, `Product`, `Category`, `Customer`, `Region`, `Quantity`, `Unit Price`, `Revenue`, `Profit`, `Sales Channel`, `Payment Method`).
3. **De-duplication**: Identifies and removes duplicate transaction rows.
4. **Type Coercion & Date Cleaning**: Coerces invalid text into NaN, parses dates into ISO string format (`YYYY-MM-DD`).
5. **Quantity & Price Normalization**: Corrects negative or zero quantities to `1`.
6. **Revenue Recalculation**: If `Revenue` is missing or invalid, calculates:
   $$\text{Revenue} = \text{Quantity} \times \text{Unit Price}$$
7. **Profit & Profit Margin % Calculation**: Estimates missing profit using category baseline margins and calculates:
   $$\text{Profit Margin \%} = \left(\frac{\text{Profit}}{\text{Revenue}}\right) \times 100$$
8. **Quality Score Calculation**: Computes an objective quality score:
   $$\text{Quality Score} = 100 - \left[(\text{Missing Ratio} \times 40) + (\text{Duplicate Ratio} \times 30) + (\text{Invalid Date Ratio} \times 20) + (\text{Invalid Qty Ratio} \times 10)\right] \times 100$$

---

## 📈 Dashboard Features & Pages

1. **Executive Dashboard**:
   - 7 Core KPI Cards: Total Revenue, Total Sales Volume, Total Orders, Total Profit, Average Order Value (AOV), Total Customers, Profit Margin %.
   - Period-over-period growth indicators (+12.4%).
   - Interactive Revenue & Profit Trend Area Chart.
   - Category Share Donut Chart & Regional Revenue Bar Chart.
   - Automated Natural-Language Business Insights.
   - Interactive Transaction Table preview.

2. **Sales Analysis**:
   - Dual-axis trend chart (Revenue & Profit vs Order Volume).
   - Time-grain switcher (Daily, Monthly, Yearly).
   - Category Revenue vs Profit matrix.
   - Regional breakdown.
   - Sales Channel (Online, Retail, Flipkart, Amazon, Distributor) & Payment Method (UPI, Credit Card, Net Banking, COD) distributions.

3. **Product Performance**:
   - Dynamic Top 10 product ranking toggling between **Revenue**, **Quantity**, and **Profit**.
   - Detailed product metrics table.
   - Bottom performers list with alert highlights.

4. **Customer Insights**:
   - Top 15 spending customers table.
   - Order count, Total spend, AOV, and items count per customer.
   - Regional customer density breakdown.

5. **Data Import**:
   - Drag-and-drop CSV / Excel file uploader.
   - Automated cleaning audit log.
   - Rows, columns, missing values, duplicates breakdown.
   - Cleaned raw dataset preview (first 20 records).
   - One-click sample dataset reset.

6. **Data Quality**:
   - Dynamic Data Quality Score Card out of 100%.
   - Column-by-column missingness table and data type health.
   - Cleaned vs invalid row counts.

7. **Exploratory Data Analysis (EDA) & Reports**:
   - Descriptive statistics table (Mean, Median, Min, Max, Standard Deviation, Total, Count) for numerical variables.
   - Binned distribution histograms for Revenue and Profit.
   - One-click export controls for CSV, Excel (.xlsx), and Executive PDF summary report.

---

## ⚡ How to Run the Application

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ & npm

### 2. Backend Setup & Run
```bash
# Navigate to project root
cd "sales-revenue-dashboard"

# Install Python requirements
pip install -r backend/requirements.txt

# Start FastAPI server (runs on http://127.0.0.1:8000)
python backend/main.py
```

### 3. Frontend Setup & Run
```bash
# Navigate to frontend folder
cd frontend

# Install Node dependencies
npm install

# Start Vite dev server (runs on http://localhost:3000)
npm run dev
```

Open `http://localhost:3000` in your web browser.

---

## 🧪 Verification & Quality Control

The project has been tested for:
1. **API Reliability**: Tested all 17 FastAPI endpoints with sample and uploaded data.
2. **Filter Recalculations**: Reset and custom date/category/region filtering verified against Pandas outputs.
3. **Data Quality Audit**: Evaluated file uploads with missing values and verified auto-cleaning rules.
4. **Currency Formatting**: Confirmed INR (`₹`) Lakh/Crore and comma notation formatting.
5. **PDF & Excel Exports**: Verified ReportLab PDF generation and Excel output files.
# Sales-Revenue-Analysis-Dashboard
#   S a l e s - R e v e n u e - A n a l y s i s - D a s h b o a r d  
 