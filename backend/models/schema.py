from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class FilterRequest(BaseModel):
    date_start: Optional[str] = None
    date_end: Optional[str] = None
    product: Optional[str] = None
    category: Optional[str] = None
    region: Optional[str] = None
    customer: Optional[str] = None
    sales_channel: Optional[str] = None
    payment_method: Optional[str] = None
    time_grain: Optional[str] = "Monthly" # Daily, Monthly, Yearly

class TableRequest(BaseModel):
    filters: Optional[FilterRequest] = None
    search: Optional[str] = ""
    sort_by: Optional[str] = "Date"
    sort_order: Optional[str] = "desc" # asc or desc
    page: int = 1
    page_size: int = 15

class ExportRequest(BaseModel):
    filters: Optional[FilterRequest] = None
    export_format: str = "csv" # csv, excel, pdf
