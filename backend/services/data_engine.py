import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from backend.models.schema import FilterRequest
from backend.utils.indian_formatter import format_inr, format_number_inr

class DataEngine:
    def __init__(self, df: pd.DataFrame):
        self.df = df

    def filter_dataframe(self, filters: Optional[FilterRequest]) -> pd.DataFrame:
        """Applies interactive filters dynamically to Pandas DataFrame."""
        if not filters:
            return self.df
        
        filtered = self.df.copy()

        if filters.date_start:
            filtered = filtered[filtered["Date"] >= filters.date_start]
        if filters.date_end:
            filtered = filtered[filtered["Date"] <= filters.date_end]
        if filters.product and filters.product != "All":
            filtered = filtered[filtered["Product"] == filters.product]
        if filters.category and filters.category != "All":
            filtered = filtered[filtered["Category"] == filters.category]
        if filters.region and filters.region != "All":
            filtered = filtered[filtered["Region"] == filters.region]
        if filters.customer and filters.customer != "All":
            filtered = filtered[filtered["Customer"] == filters.customer]
        if filters.sales_channel and filters.sales_channel != "All":
            filtered = filtered[filtered["Sales Channel"] == filters.sales_channel]
        if filters.payment_method and filters.payment_method != "All":
            filtered = filtered[filtered["Payment Method"] == filters.payment_method]

        return filtered

    def get_filter_options(self) -> Dict[str, List[str]]:
        """Returns unique dropdown options for frontend filter controls."""
        if self.df.empty:
            return {
                "categories": ["All"],
                "products": ["All"],
                "regions": ["All"],
                "customers": ["All"],
                "sales_channels": ["All"],
                "payment_methods": ["All"],
                "min_date": "",
                "max_date": ""
            }

        return {
            "categories": ["All"] + sorted([str(x) for x in self.df["Category"].dropna().unique().tolist()]),
            "products": ["All"] + sorted([str(x) for x in self.df["Product"].dropna().unique().tolist()]),
            "regions": ["All"] + sorted([str(x) for x in self.df["Region"].dropna().unique().tolist()]),
            "customers": ["All"] + sorted([str(x) for x in self.df["Customer"].dropna().unique().tolist()]),
            "sales_channels": ["All"] + sorted([str(x) for x in self.df["Sales Channel"].dropna().unique().tolist()]),
            "payment_methods": ["All"] + sorted([str(x) for x in self.df["Payment Method"].dropna().unique().tolist()]),
            "min_date": str(self.df["Date"].min()),
            "max_date": str(self.df["Date"].max())
        }

    def compute_kpis(self, filters: Optional[FilterRequest] = None) -> Dict[str, Any]:
        """Calculates current period KPIs & prior period growth rate dynamically."""
        df_curr = self.filter_dataframe(filters)
        
        if df_curr.empty:
            return {
                "total_revenue": 0,
                "total_revenue_formatted": "₹0",
                "total_sales": 0,
                "total_sales_formatted": "0",
                "total_orders": 0,
                "total_orders_formatted": "0",
                "total_profit": 0,
                "total_profit_formatted": "₹0",
                "avg_order_value": 0,
                "avg_order_value_formatted": "₹0",
                "total_customers": 0,
                "profit_margin": 0,
                "revenue_growth": 0,
                "orders_growth": 0,
                "profit_growth": 0
            }

        total_revenue = float(df_curr["Revenue"].sum())
        total_sales = int(df_curr["Quantity"].sum())
        total_orders = int(df_curr["Order ID"].nunique())
        total_profit = float(df_curr["Profit"].sum())
        avg_order_value = float(total_revenue / total_orders) if total_orders > 0 else 0.0
        total_customers = int(df_curr["Customer"].nunique())
        profit_margin = float((total_profit / total_revenue) * 100) if total_revenue > 0 else 0.0

        # Calculate Prior Period Growth if dates permit
        revenue_growth = 0.0
        orders_growth = 0.0
        profit_growth = 0.0

        min_d = pd.to_datetime(df_curr["Date"].min())
        max_d = pd.to_datetime(df_curr["Date"].max())
        duration = (max_d - min_d).days + 1

        if duration > 1 and len(self.df) > len(df_curr):
            prior_end = min_d - timedelta(days=1)
            prior_start = prior_end - timedelta(days=duration)
            
            df_prior = self.df[(pd.to_datetime(self.df["Date"]) >= prior_start) & (pd.to_datetime(self.df["Date"]) <= prior_end)]
            if not df_prior.empty:
                prior_rev = float(df_prior["Revenue"].sum())
                prior_orders = int(df_prior["Order ID"].nunique())
                prior_prof = float(df_prior["Profit"].sum())
                
                if prior_rev > 0:
                    revenue_growth = round(((total_revenue - prior_rev) / prior_rev) * 100, 1)
                if prior_orders > 0:
                    orders_growth = round(((total_orders - prior_orders) / prior_orders) * 100, 1)
                if prior_prof > 0:
                    profit_growth = round(((total_profit - prior_prof) / prior_prof) * 100, 1)

        return {
            "total_revenue": total_revenue,
            "total_revenue_formatted": format_inr(total_revenue),
            "total_revenue_compact": format_inr(total_revenue, compact=True),
            "total_sales": total_sales,
            "total_sales_formatted": format_number_inr(total_sales),
            "total_orders": total_orders,
            "total_orders_formatted": format_number_inr(total_orders),
            "total_profit": total_profit,
            "total_profit_formatted": format_inr(total_profit),
            "total_profit_compact": format_inr(total_profit, compact=True),
            "avg_order_value": round(avg_order_value, 2),
            "avg_order_value_formatted": format_inr(avg_order_value),
            "total_customers": total_customers,
            "profit_margin": round(profit_margin, 2),
            "revenue_growth": revenue_growth,
            "orders_growth": orders_growth,
            "profit_growth": profit_growth
        }

    def compute_trends(self, filters: Optional[FilterRequest] = None, grain: str = "Monthly") -> List[Dict[str, Any]]:
        """Computes time series trends for Revenue, Orders, and Profit."""
        df_filtered = self.filter_dataframe(filters).copy()
        if df_filtered.empty:
            return []

        df_filtered["dt"] = pd.to_datetime(df_filtered["Date"])

        if grain == "Daily":
            df_filtered["period"] = df_filtered["dt"].dt.strftime("%Y-%m-%d")
        elif grain == "Yearly":
            df_filtered["period"] = df_filtered["dt"].dt.strftime("%Y")
        else: # Monthly default
            df_filtered["period"] = df_filtered["dt"].dt.strftime("%Y-%m")

        trend = df_filtered.groupby("period").agg(
            Revenue=("Revenue", "sum"),
            Profit=("Profit", "sum"),
            Orders=("Order ID", "nunique"),
            Quantity=("Quantity", "sum")
        ).reset_index().sort_values("period")

        res = []
        for _, r in trend.iterrows():
            rev = float(r["Revenue"])
            prof = float(r["Profit"])
            res.append({
                "period": r["period"],
                "revenue": round(rev, 2),
                "revenue_formatted": format_inr(rev, compact=True),
                "profit": round(prof, 2),
                "profit_formatted": format_inr(prof, compact=True),
                "orders": int(r["Orders"]),
                "quantity": int(r["Quantity"])
            })

        return res

    def compute_category_analysis(self, filters: Optional[FilterRequest] = None) -> List[Dict[str, Any]]:
        """Breakdown of Revenue, Profit, and Quantity by Category."""
        df_filtered = self.filter_dataframe(filters)
        if df_filtered.empty:
            return []

        cat = df_filtered.groupby("Category").agg(
            Revenue=("Revenue", "sum"),
            Profit=("Profit", "sum"),
            Quantity=("Quantity", "sum"),
            Orders=("Order ID", "nunique")
        ).reset_index().sort_values("Revenue", ascending=False)

        total_rev = cat["Revenue"].sum()

        res = []
        for _, r in cat.iterrows():
            rev = float(r["Revenue"])
            prof = float(r["Profit"])
            res.append({
                "category": str(r["Category"]),
                "revenue": round(rev, 2),
                "revenue_formatted": format_inr(rev),
                "revenue_compact": format_inr(rev, compact=True),
                "profit": round(prof, 2),
                "profit_formatted": format_inr(prof),
                "quantity": int(r["Quantity"]),
                "orders": int(r["Orders"]),
                "revenue_share": round((rev / total_rev * 100), 1) if total_rev > 0 else 0.0,
                "profit_margin": round((prof / rev * 100), 1) if rev > 0 else 0.0
            })
        return res

    def compute_product_analysis(self, filters: Optional[FilterRequest] = None) -> Dict[str, Any]:
        """Top 10 products by Revenue, Quantity, Profit, and overall Product Table."""
        df_filtered = self.filter_dataframe(filters)
        if df_filtered.empty:
            return {"top_revenue": [], "top_quantity": [], "top_profit": [], "bottom_performers": []}

        prod = df_filtered.groupby(["Product", "Category"]).agg(
            Revenue=("Revenue", "sum"),
            Profit=("Profit", "sum"),
            Quantity=("Quantity", "sum"),
            AvgPrice=("Unit Price", "mean")
        ).reset_index()

        prod["ProfitMargin"] = np.where(prod["Revenue"] > 0, (prod["Profit"] / prod["Revenue"]) * 100, 0.0)

        top_rev = prod.sort_values("Revenue", ascending=False).head(10)
        top_qty = prod.sort_values("Quantity", ascending=False).head(10)
        top_prof = prod.sort_values("Profit", ascending=False).head(10)
        bottom_rev = prod.sort_values("Revenue", ascending=True).head(5)

        def format_product_list(sub_df):
            out = []
            for _, r in sub_df.iterrows():
                rev = float(r["Revenue"])
                prof = float(r["Profit"])
                out.append({
                    "product": str(r["Product"]),
                    "category": str(r["Category"]),
                    "revenue": round(rev, 2),
                    "revenue_formatted": format_inr(rev),
                    "revenue_compact": format_inr(rev, compact=True),
                    "profit": round(prof, 2),
                    "profit_formatted": format_inr(prof),
                    "quantity": int(r["Quantity"]),
                    "avg_price": round(float(r["AvgPrice"]), 2),
                    "profit_margin": round(float(r["ProfitMargin"]), 1)
                })
            return out

        return {
            "top_revenue": format_product_list(top_rev),
            "top_quantity": format_product_list(top_qty),
            "top_profit": format_product_list(top_prof),
            "bottom_performers": format_product_list(bottom_rev)
        }

    def compute_regional_analysis(self, filters: Optional[FilterRequest] = None) -> List[Dict[str, Any]]:
        """Regional Revenue, Sales, and Profit analysis."""
        df_filtered = self.filter_dataframe(filters)
        if df_filtered.empty:
            return []

        reg = df_filtered.groupby("Region").agg(
            Revenue=("Revenue", "sum"),
            Profit=("Profit", "sum"),
            Quantity=("Quantity", "sum"),
            Orders=("Order ID", "nunique"),
            Customers=("Customer", "nunique")
        ).reset_index().sort_values("Revenue", ascending=False)

        total_rev = reg["Revenue"].sum()

        res = []
        for _, r in reg.iterrows():
            rev = float(r["Revenue"])
            prof = float(r["Profit"])
            res.append({
                "region": str(r["Region"]),
                "revenue": round(rev, 2),
                "revenue_formatted": format_inr(rev),
                "revenue_compact": format_inr(rev, compact=True),
                "profit": round(prof, 2),
                "profit_formatted": format_inr(prof),
                "quantity": int(r["Quantity"]),
                "orders": int(r["Orders"]),
                "customers": int(r["Customers"]),
                "share": round((rev / total_rev * 100), 1) if total_rev > 0 else 0.0,
                "profit_margin": round((prof / rev * 100), 1) if rev > 0 else 0.0
            })
        return res

    def compute_channel_payment_analysis(self, filters: Optional[FilterRequest] = None) -> Dict[str, Any]:
        """Breakdown by Sales Channel and Payment Method."""
        df_filtered = self.filter_dataframe(filters)
        if df_filtered.empty:
            return {"channels": [], "payments": []}

        ch = df_filtered.groupby("Sales Channel").agg(
            Revenue=("Revenue", "sum"),
            Orders=("Order ID", "nunique")
        ).reset_index().sort_values("Revenue", ascending=False)

        py = df_filtered.groupby("Payment Method").agg(
            Revenue=("Revenue", "sum"),
            Orders=("Order ID", "nunique")
        ).reset_index().sort_values("Revenue", ascending=False)

        tot_rev = df_filtered["Revenue"].sum()

        channels_out = []
        for _, r in ch.iterrows():
            rev = float(r["Revenue"])
            channels_out.append({
                "channel": str(r["Sales Channel"]),
                "revenue": round(rev, 2),
                "revenue_formatted": format_inr(rev, compact=True),
                "orders": int(r["Orders"]),
                "share": round((rev / tot_rev * 100), 1) if tot_rev > 0 else 0.0
            })

        payments_out = []
        for _, r in py.iterrows():
            rev = float(r["Revenue"])
            payments_out.append({
                "method": str(r["Payment Method"]),
                "revenue": round(rev, 2),
                "revenue_formatted": format_inr(rev, compact=True),
                "orders": int(r["Orders"]),
                "share": round((rev / tot_rev * 100), 1) if tot_rev > 0 else 0.0
            })

        return {"channels": channels_out, "payments": payments_out}

    def compute_eda_summary(self, filters: Optional[FilterRequest] = None) -> Dict[str, Any]:
        """Exploratory Data Analysis summary statistics for numerical columns."""
        df_filtered = self.filter_dataframe(filters)
        if df_filtered.empty:
            return {"statistics": [], "histograms": {}}

        num_cols = ["Revenue", "Profit", "Quantity", "Unit Price", "Profit Margin %"]
        stats_out = []

        for col in num_cols:
            if col in df_filtered.columns:
                series = df_filtered[col].dropna()
                if not series.empty:
                    stats_out.append({
                        "column": col,
                        "mean": round(float(series.mean()), 2),
                        "median": round(float(series.median()), 2),
                        "min": round(float(series.min()), 2),
                        "max": round(float(series.max()), 2),
                        "std_dev": round(float(series.std()), 2),
                        "total": round(float(series.sum()), 2),
                        "count": int(series.count()),
                        "formatted_mean": format_inr(series.mean()) if "Revenue" in col or "Profit" in col or "Price" in col else str(round(series.mean(), 2)),
                        "formatted_total": format_inr(series.sum()) if "Revenue" in col or "Profit" in col or "Price" in col else str(int(series.sum()))
                    })

        # Distribution binning for visualizations
        histograms = {}
        for col in ["Revenue", "Profit"]:
            if col in df_filtered.columns:
                counts, bin_edges = np.histogram(df_filtered[col].dropna(), bins=6)
                hist_bins = []
                for j in range(len(counts)):
                    hist_bins.append({
                        "bin_range": f"{format_inr(bin_edges[j], compact=True)} - {format_inr(bin_edges[j+1], compact=True)}",
                        "count": int(counts[j])
                    })
                histograms[col] = hist_bins

        return {"statistics": stats_out, "histograms": histograms}

    def compute_customer_analysis(self, filters: Optional[FilterRequest] = None) -> List[Dict[str, Any]]:
        """Top Customers by Total Spend, Orders count, and AOV."""
        df_filtered = self.filter_dataframe(filters)
        if df_filtered.empty:
            return []

        cust = df_filtered.groupby(["Customer", "Region"]).agg(
            TotalRevenue=("Revenue", "sum"),
            TotalProfit=("Profit", "sum"),
            TotalOrders=("Order ID", "nunique"),
            TotalItems=("Quantity", "sum"),
            LastPurchase=("Date", "max")
        ).reset_index().sort_values("TotalRevenue", ascending=False).head(15)

        res = []
        for _, r in cust.iterrows():
            rev = float(r["TotalRevenue"])
            orders = int(r["TotalOrders"])
            aov = rev / orders if orders > 0 else 0.0
            res.append({
                "customer": str(r["Customer"]),
                "region": str(r["Region"]),
                "revenue": round(rev, 2),
                "revenue_formatted": format_inr(rev),
                "profit": round(float(r["TotalProfit"]), 2),
                "orders": orders,
                "items": int(r["TotalItems"]),
                "aov_formatted": format_inr(aov),
                "last_purchase": str(r["LastPurchase"])
            })

        return res
