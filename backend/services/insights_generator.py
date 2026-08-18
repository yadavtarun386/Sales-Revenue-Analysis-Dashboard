import pandas as pd
from typing import List, Dict, Any, Optional
from backend.models.schema import FilterRequest
from backend.services.data_engine import DataEngine
from backend.utils.indian_formatter import format_inr, format_number_inr

class InsightsGenerator:
    def __init__(self, data_engine: DataEngine):
        self.engine = data_engine

    def generate_insights(self, filters: Optional[FilterRequest] = None) -> List[Dict[str, Any]]:
        """Generates dynamic natural language business insights from Pandas calculations."""
        df = self.engine.filter_dataframe(filters)
        if df.empty:
            return [{
                "title": "No Data Available",
                "category": "General",
                "importance": "high",
                "text": "No records match the current filter selection to generate business insights."
            }]

        insights = []

        # 1. Total Financial Overview Insight
        total_rev = float(df["Revenue"].sum())
        total_prof = float(df["Profit"].sum())
        total_orders = int(df["Order ID"].nunique())
        avg_aov = total_rev / total_orders if total_orders > 0 else 0
        overall_margin = (total_prof / total_rev * 100) if total_rev > 0 else 0

        insights.append({
            "title": "Overall Revenue & Profit Performance",
            "category": "Financial",
            "importance": "high",
            "text": f"The business generated {format_inr(total_rev)} in total revenue across {format_number_inr(total_orders)} orders, achieving an average order value of {format_inr(avg_aov)} and an overall profit margin of {overall_margin:.1f}%."
        })

        # 2. Category Performance Insights
        cat_df = df.groupby("Category").agg(
            Revenue=("Revenue", "sum"),
            Profit=("Profit", "sum")
        ).reset_index().sort_values("Revenue", ascending=False)

        if not cat_df.empty:
            top_cat = cat_df.iloc[0]
            top_cat_name = str(top_cat["Category"])
            top_cat_rev = float(top_cat["Revenue"])
            cat_share = (top_cat_rev / total_rev * 100) if total_rev > 0 else 0

            # Most Profitable Category
            top_prof_cat = cat_df.sort_values("Profit", ascending=False).iloc[0]
            top_prof_cat_name = str(top_prof_cat["Category"])
            top_prof_cat_val = float(top_prof_cat["Profit"])

            insights.append({
                "title": "Category Revenue Leadership",
                "category": "Category",
                "importance": "high",
                "text": f"The '{top_cat_name}' category generated the highest revenue, contributing {format_inr(top_cat_rev)} ({cat_share:.1f}% of total sales)."
            })

            insights.append({
                "title": "Most Profitable Category",
                "category": "Category",
                "importance": "medium",
                "text": f"'{top_prof_cat_name}' yielded the highest total profit of {format_inr(top_prof_cat_val)}."
            })

        # 3. Product Analysis Insights
        prod_df = df.groupby("Product").agg(
            Revenue=("Revenue", "sum"),
            Quantity=("Quantity", "sum"),
            Profit=("Profit", "sum")
        ).reset_index()

        if not prod_df.empty:
            top_prod_rev = prod_df.sort_values("Revenue", ascending=False).iloc[0]
            top_prod_qty = prod_df.sort_values("Quantity", ascending=False).iloc[0]

            insights.append({
                "title": "Top Revenue Product",
                "category": "Product",
                "importance": "high",
                "text": f"The highest revenue-generating product was '{top_prod_rev['Product']}', delivering {format_inr(float(top_prod_rev['Revenue']))} across {int(top_prod_rev['Quantity'])} units."
            })

            insights.append({
                "title": "Highest Volume Product",
                "category": "Product",
                "importance": "medium",
                "text": f"'{top_prod_qty['Product']}' achieved the highest sales volume with {format_number_inr(int(top_prod_qty['Quantity']))} units sold."
            })

        # 4. Regional Performance Insights
        reg_df = df.groupby("Region").agg(
            Revenue=("Revenue", "sum"),
            Profit=("Profit", "sum")
        ).reset_index().sort_values("Revenue", ascending=False)

        if not reg_df.empty:
            top_reg = reg_df.iloc[0]
            lowest_reg = reg_df.iloc[-1]

            insights.append({
                "title": "Regional Market Leader",
                "category": "Regional",
                "importance": "high",
                "text": f"The '{top_reg['Region']}' region emerged as the best-performing territory, generating {format_inr(float(top_reg['Revenue']))} in sales."
            })

            if len(reg_df) > 1:
                insights.append({
                    "title": "Lowest Performing Region",
                    "category": "Regional",
                    "importance": "low",
                    "text": f"The '{lowest_reg['Region']}' region recorded the lowest sales total of {format_inr(float(lowest_reg['Revenue']))}, indicating a key growth opportunity for targeted campaigns."
                })

        # 5. Peak Month Insights
        df_copy = df.copy()
        df_copy["Month"] = pd.to_datetime(df_copy["Date"]).dt.strftime("%B %Y")
        monthly = df_copy.groupby("Month").agg(
            Revenue=("Revenue", "sum"),
            Profit=("Profit", "sum")
        ).reset_index()

        if not monthly.empty:
            peak_rev_month = monthly.sort_values("Revenue", ascending=False).iloc[0]
            peak_prof_month = monthly.sort_values("Profit", ascending=False).iloc[0]

            insights.append({
                "title": "Highest Revenue Month",
                "category": "Trend",
                "importance": "medium",
                "text": f"{peak_rev_month['Month']} was the top-performing sales month with a record revenue of {format_inr(float(peak_rev_month['Revenue']))}."
            })

            if peak_prof_month["Month"] != peak_rev_month["Month"]:
                insights.append({
                    "title": "Highest Profit Month",
                    "category": "Trend",
                    "importance": "medium",
                    "text": f"{peak_prof_month['Month']} delivered maximum profitability at {format_inr(float(peak_prof_month['Profit']))}."
                })

        # 6. Sales Channel & Payment Method Insights
        ch_df = df.groupby("Sales Channel")["Revenue"].sum().reset_index().sort_values("Revenue", ascending=False)
        if not ch_df.empty:
            top_ch = ch_df.iloc[0]
            insights.append({
                "title": "Dominant Sales Channel",
                "category": "Channel",
                "importance": "low",
                "text": f"The primary sales driver was '{top_ch['Sales Channel']}', accounting for {format_inr(float(top_ch['Revenue']))} of revenue."
            })

        return insights
