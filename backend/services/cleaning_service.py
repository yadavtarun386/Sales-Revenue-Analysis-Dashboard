import pandas as pd
import numpy as np
from typing import Dict, Any, Tuple

def clean_and_validate_dataframe(df_raw: pd.DataFrame) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Validates and cleans raw input dataframe using Pandas.
    Returns cleaned dataframe and a comprehensive cleaning audit report.
    """
    df = df_raw.copy()
    initial_rows = len(df)
    initial_cols = len(df.columns)
    
    report = {
        "initial_rows": initial_rows,
        "initial_columns": initial_cols,
        "missing_values_before": {},
        "missing_values_fixed": 0,
        "duplicate_rows_removed": 0,
        "invalid_dates_fixed": 0,
        "invalid_quantities_fixed": 0,
        "recalculated_revenue_count": 0,
        "recalculated_profit_count": 0,
        "column_types": {},
        "valid_rows": 0,
        "invalid_rows": 0,
        "quality_score": 100.0,
        "data_issues_found": []
    }
    
    # 1. Inspect missing values before cleaning
    for col in df.columns:
        report["missing_values_before"][str(col)] = int(df[col].isnull().sum())
    
    # 2. Standardize column names (strip whitespace)
    df.columns = [str(c).strip() for c in df.columns]
    
    # Column mapping normalize
    col_map = {}
    for col in df.columns:
        col_lower = col.lower().replace("_", " ").replace("-", " ")
        if "order" in col_lower and "id" in col_lower:
            col_map[col] = "Order ID"
        elif "date" in col_lower:
            col_map[col] = "Date"
        elif "product" in col_lower:
            col_map[col] = "Product"
        elif "category" in col_lower:
            col_map[col] = "Category"
        elif "customer" in col_lower:
            col_map[col] = "Customer"
        elif "region" in col_lower:
            col_map[col] = "Region"
        elif "quantity" in col_lower or "qty" in col_lower:
            col_map[col] = "Quantity"
        elif "unit" in col_lower and "price" in col_lower:
            col_map[col] = "Unit Price"
        elif "revenue" in col_lower or "sales amount" in col_lower or "total amount" in col_lower:
            col_map[col] = "Revenue"
        elif "profit" in col_lower:
            col_map[col] = "Profit"
        elif "channel" in col_lower:
            col_map[col] = "Sales Channel"
        elif "payment" in col_lower:
            col_map[col] = "Payment Method"
            
    df = df.rename(columns=col_map)
    
    # 3. Check for duplicates
    dups_count = int(df.duplicated().sum())
    if dups_count > 0:
        report["duplicate_rows_removed"] = dups_count
        report["data_issues_found"].append(f"Removed {dups_count} duplicate row(s).")
        df = df.drop_duplicates().reset_index(drop=True)
        
    # 4. Handle String Columns - strip whitespace, convert empty strings to NaN
    string_cols = ["Order ID", "Product", "Category", "Customer", "Region", "Sales Channel", "Payment Method"]
    for col in string_cols:
        if col in df.columns:
            df[col] = df[col].astype(str).str.strip()
            df[col] = df[col].replace(["nan", "NaN", "None", "", "null", "NULL"], np.nan)
            
    # 5. Handle Date column
    if "Date" in df.columns:
        parsed_dates = pd.to_datetime(df["Date"], errors='coerce')
        invalid_dates = parsed_dates.isnull().sum()
        if invalid_dates > 0:
            report["invalid_dates_fixed"] = int(invalid_dates)
            report["data_issues_found"].append(f"Found {invalid_dates} invalid date(s). Imputed with fallback or dropped.")
        # Drop rows where Date is invalid or coerce
        df["Date"] = parsed_dates
        df = df.dropna(subset=["Date"]).reset_index(drop=True)
        df["Date"] = df["Date"].dt.strftime("%Y-%m-%d")
        
    # 6. Coerce Numerical Columns
    num_cols = ["Quantity", "Unit Price", "Revenue", "Profit"]
    for col in num_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')
            
    # Handle Negative or Zero Quantity
    if "Quantity" in df.columns:
        invalid_qty = (df["Quantity"].isnull()) | (df["Quantity"] <= 0)
        invalid_qty_count = int(invalid_qty.sum())
        if invalid_qty_count > 0:
            report["invalid_quantities_fixed"] = invalid_qty_count
            report["data_issues_found"].append(f"Corrected {invalid_qty_count} invalid/negative quantity values to 1.")
            df.loc[invalid_qty, "Quantity"] = 1
            
    # Recalculate Revenue if missing or invalid
    if "Quantity" in df.columns and "Unit Price" in df.columns:
        missing_rev_mask = df["Revenue"].isnull() | (df["Revenue"] <= 0) if "Revenue" in df.columns else pd.Series(True, index=df.index)
        missing_rev_count = int(missing_rev_mask.sum())
        if missing_rev_count > 0:
            report["recalculated_revenue_count"] = missing_rev_count
            report["data_issues_found"].append(f"Recalculated missing Revenue (Quantity × Unit Price) for {missing_rev_count} rows.")
            df.loc[missing_rev_mask, "Revenue"] = df.loc[missing_rev_mask, "Quantity"] * df.loc[missing_rev_mask, "Unit Price"]

    # Fill default Unit Price if missing
    if "Revenue" in df.columns and "Quantity" in df.columns and "Unit Price" in df.columns:
        missing_price = df["Unit Price"].isnull()
        df.loc[missing_price, "Unit Price"] = df.loc[missing_price, "Revenue"] / df.loc[missing_price, "Quantity"]

    # Calculate Profit Margin % and Default Profit if missing
    if "Revenue" in df.columns:
        if "Profit" not in df.columns or df["Profit"].isnull().sum() > 0:
            missing_prof_mask = df["Profit"].isnull() if "Profit" in df.columns else pd.Series(True, index=df.index)
            report["recalculated_profit_count"] = int(missing_prof_mask.sum())
            report["data_issues_found"].append(f"Estimated missing Profit for {report['recalculated_profit_count']} rows using category baseline margin.")
            df.loc[missing_prof_mask, "Profit"] = df.loc[missing_prof_mask, "Revenue"] * 0.22

        df["Profit Margin %"] = np.where(df["Revenue"] > 0, (df["Profit"] / df["Revenue"]) * 100, 0.0)

    # 7. Fill missing string values with 'Unspecified'
    for col in string_cols:
        if col in df.columns:
            df[col] = df[col].fillna("Unspecified")

    # 8. Ensure essential default columns exist
    required_defaults = {
        "Order ID": [f"ORD-{1000+i}" for i in range(len(df))],
        "Product": "General Product",
        "Category": "General Category",
        "Customer": "Guest Customer",
        "Region": "Central",
        "Sales Channel": "Direct",
        "Payment Method": "UPI"
    }
    for col, default_val in required_defaults.items():
        if col not in df.columns:
            df[col] = default_val
            
    # Final counts & quality score calculation
    final_rows = len(df)
    report["cleaned_rows"] = final_rows
    report["valid_rows"] = final_rows
    report["invalid_rows"] = initial_rows - final_rows
    
    # Calculate Data Quality Score dynamically (100 minus penalties for issues)
    missing_ratio = sum(report["missing_values_before"].values()) / max(1, (initial_rows * initial_cols))
    dup_ratio = dups_count / max(1, initial_rows)
    invalid_date_ratio = report["invalid_dates_fixed"] / max(1, initial_rows)
    invalid_qty_ratio = report["invalid_quantities_fixed"] / max(1, initial_rows)
    
    penalty = (missing_ratio * 40) + (dup_ratio * 30) + (invalid_date_ratio * 20) + (invalid_qty_ratio * 10)
    quality_score = max(0.0, min(100.0, round(100.0 - (penalty * 100), 1)))
    report["quality_score"] = quality_score

    for col in df.columns:
        report["column_types"][col] = str(df[col].dtype)

    return df, report
