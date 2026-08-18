from fastapi import APIRouter, UploadFile, File, HTTPException, Body
from fastapi.responses import Response, StreamingResponse
import pandas as pd
import io
import os
from typing import Optional, Dict, Any

from backend.models.schema import FilterRequest, TableRequest, ExportRequest
from backend.services.cleaning_service import clean_and_validate_dataframe
from backend.services.data_engine import DataEngine
from backend.services.insights_generator import InsightsGenerator
from backend.services.pdf_generator import generate_pdf_report
from backend.utils.sample_generator import generate_sample_sales

router = APIRouter(prefix="/api")

# In-memory global state engine for currently loaded dataset
CURRENT_RAW_DF: pd.DataFrame = None
CURRENT_CLEAN_DF: pd.DataFrame = None
CURRENT_AUDIT_REPORT: Dict[str, Any] = {}
DATA_ENGINE: DataEngine = None

def init_default_data():
    global CURRENT_RAW_DF, CURRENT_CLEAN_DF, CURRENT_AUDIT_REPORT, DATA_ENGINE
    curr_dir = os.path.dirname(os.path.abspath(__file__))
    sample_path = os.path.abspath(os.path.join(curr_dir, "..", "..", "data", "sample_sales.csv"))
    
    if os.path.exists(sample_path):
        raw = pd.read_csv(sample_path)
    else:
        raw = generate_sample_sales(650, sample_path)
        
    cleaned, report = clean_and_validate_dataframe(raw)
    CURRENT_RAW_DF = raw
    CURRENT_CLEAN_DF = cleaned
    CURRENT_AUDIT_REPORT = report
    DATA_ENGINE = DataEngine(cleaned)

# Initialize on module import
init_default_data()

@router.get("/filters")
def get_filters():
    return DATA_ENGINE.get_filter_options()

@router.post("/kpis")
def get_kpis(filters: Optional[FilterRequest] = Body(None)):
    return DATA_ENGINE.compute_kpis(filters)

@router.post("/trends")
def get_trends(filters: Optional[FilterRequest] = Body(None)):
    grain = filters.time_grain if filters and filters.time_grain else "Monthly"
    return DATA_ENGINE.compute_trends(filters, grain=grain)

@router.post("/categories")
def get_categories(filters: Optional[FilterRequest] = Body(None)):
    return DATA_ENGINE.compute_category_analysis(filters)

@router.post("/products")
def get_products(filters: Optional[FilterRequest] = Body(None)):
    return DATA_ENGINE.compute_product_analysis(filters)

@router.post("/regions")
def get_regions(filters: Optional[FilterRequest] = Body(None)):
    return DATA_ENGINE.compute_regional_analysis(filters)

@router.post("/channels")
def get_channels(filters: Optional[FilterRequest] = Body(None)):
    return DATA_ENGINE.compute_channel_payment_analysis(filters)

@router.post("/customers")
def get_customers(filters: Optional[FilterRequest] = Body(None)):
    return DATA_ENGINE.compute_customer_analysis(filters)

@router.post("/eda")
def get_eda(filters: Optional[FilterRequest] = Body(None)):
    return DATA_ENGINE.compute_eda_summary(filters)

@router.post("/insights")
def get_insights(filters: Optional[FilterRequest] = Body(None)):
    gen = InsightsGenerator(DATA_ENGINE)
    return gen.generate_insights(filters)

@router.post("/quality")
def get_quality():
    return CURRENT_AUDIT_REPORT

@router.post("/table")
def get_table(req: TableRequest = Body(...)):
    df_filtered = DATA_ENGINE.filter_dataframe(req.filters).copy()
    
    # Global search across text columns
    if req.search:
        search_lower = req.search.lower()
        mask = pd.Series(False, index=df_filtered.index)
        for col in ["Order ID", "Product", "Category", "Customer", "Region", "Sales Channel", "Payment Method"]:
            if col in df_filtered.columns:
                mask = mask | df_filtered[col].astype(str).str.lower().str.contains(search_lower, na=False)
        df_filtered = df_filtered[mask]

    # Sorting
    if req.sort_by and req.sort_by in df_filtered.columns:
        ascending = (req.sort_order == "asc")
        df_filtered = df_filtered.sort_values(by=req.sort_by, ascending=ascending)

    total_records = len(df_filtered)
    page_size = max(1, req.page_size)
    total_pages = max(1, (total_records + page_size - 1) // page_size)
    page = max(1, min(req.page, total_pages))

    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    df_page = df_filtered.iloc[start_idx:end_idx]

    records = df_page.to_dict(orient="records")

    return {
        "records": records,
        "total_records": total_records,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages
    }

@router.post("/upload")
async def upload_dataset(file: UploadFile = File(...)):
    global CURRENT_RAW_DF, CURRENT_CLEAN_DF, CURRENT_AUDIT_REPORT, DATA_ENGINE
    
    if not file.filename.endswith(('.csv', '.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Only CSV and Excel (.xlsx, .xls) files are supported.")
        
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="The uploaded file is empty.")

    try:
        if file.filename.endswith('.csv'):
            df_raw = pd.read_csv(io.BytesIO(contents))
        else:
            df_raw = pd.read_excel(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse data file: {str(e)}")

    if df_raw.empty:
        raise HTTPException(status_code=400, detail="Uploaded dataset contains 0 rows.")

    cleaned_df, audit_report = clean_and_validate_dataframe(df_raw)
    
    CURRENT_RAW_DF = df_raw
    CURRENT_CLEAN_DF = cleaned_df
    CURRENT_AUDIT_REPORT = audit_report
    DATA_ENGINE = DataEngine(cleaned_df)

    preview_records = cleaned_df.head(20).to_dict(orient="records")

    return {
        "filename": file.filename,
        "status": "success",
        "audit": audit_report,
        "columns": list(cleaned_df.columns),
        "preview": preview_records,
        "filter_options": DATA_ENGINE.get_filter_options()
    }

@router.post("/reload-sample")
def reload_sample():
    init_default_data()
    return {"status": "success", "message": "Sample dataset reloaded."}

@router.post("/export")
def export_dataset(req: ExportRequest = Body(...)):
    df_filtered = DATA_ENGINE.filter_dataframe(req.filters)
    fmt = req.export_format.lower()

    if fmt == "csv":
        output = io.StringIO()
        df_filtered.to_csv(output, index=False)
        output.seek(0)
        return StreamingResponse(
            io.BytesIO(output.getvalue().encode('utf-8')),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=sales_analysis_export.csv"}
        )
    elif fmt == "excel":
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df_filtered.to_excel(writer, index=False, sheet_name="Sales Analysis")
        output.seek(0)
        return StreamingResponse(
            output,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": "attachment; filename=sales_analysis_export.xlsx"}
        )
    elif fmt == "pdf":
        kpis = DATA_ENGINE.compute_kpis(req.filters)
        gen = InsightsGenerator(DATA_ENGINE)
        insights = gen.generate_insights(req.filters)
        prods = DATA_ENGINE.compute_product_analysis(req.filters).get("top_revenue", [])
        cats = DATA_ENGINE.compute_category_analysis(req.filters)

        pdf_bytes = generate_pdf_report(kpis, insights, prods, cats)
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=sales_executive_report.pdf"}
        )
    else:
        raise HTTPException(status_code=400, detail="Invalid export format specified.")
