import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
import os

def generate_sample_sales(num_records: int = 650, output_path: str = None) -> pd.DataFrame:
    random.seed(42)
    np.random.seed(42)
    
    categories_products = {
        "Electronics": [
            ("Pro Max 5G Smartphone", 64999, 15000),
            ("Ultra 4K Smart TV 55\"", 48999, 12000),
            ("Slim Book Laptop 16GB", 72500, 18000),
            ("Noise-Canceling Earbuds", 4999, 1800),
            ("Fitness Smartwatch Gen 4", 8999, 3200),
            ("Wireless Ergonomic Mouse", 1499, 650)
        ],
        "Appliances": [
            ("Inverter Split AC 1.5 Ton", 42000, 9500),
            ("Front Load Washing Machine", 34500, 7800),
            ("Convection Microwave Oven", 13999, 3500),
            ("Double Door Refrigerator", 38900, 8200),
            ("RO Water Purifier", 15499, 4100)
        ],
        "Apparel & Fashion": [
            ("Silk Designer Kurta Set", 4500, 1900),
            ("Italian Fit Formal Suit", 12999, 5200),
            ("Slim Stretch Denim Jeans", 2499, 1100),
            ("Genuine Leather Boots", 5999, 2400),
            ("Running Sports Shoes", 3999, 1600)
        ],
        "Home & Furniture": [
            ("Ergonomic Mesh Office Chair", 11500, 3800),
            ("Solid Teak Dining Table", 32000, 9600),
            ("Orthopedic Foam Mattress", 18500, 5400),
            ("Adjustable LED Desk Lamp", 1999, 850),
            ("Modular Storage Bookshelf", 6499, 2100)
        ],
        "Books & Stationery": [
            ("Python Data Analytics Guide", 899, 420),
            ("Financial Modeling Handbook", 1299, 600),
            ("Executive Leather Journal Set", 1499, 700),
            ("Ergonomic Pen & Stand Kit", 699, 310)
        ]
    }

    regions_cities = {
        "North": ["Delhi NCR", "Jaipur", "Lucknow", "Chandigarh"],
        "South": ["Bengaluru", "Chennai", "Hyderabad", "Kochi"],
        "West": ["Mumbai", "Pune", "Ahmedabad", "Surat"],
        "East": ["Kolkata", "Bhubaneswar", "Patna", "Guwahati"],
        "Central": ["Indore", "Bhopal", "Raipur"]
    }

    channels = ["Online Store", "Retail Store", "Amazon India", "Flipkart", "Distributor", "Direct Corporate"]
    channel_weights = [0.25, 0.25, 0.20, 0.15, 0.10, 0.05]

    payment_methods = ["UPI", "Credit Card", "Net Banking", "Debit Card", "Cash on Delivery"]
    payment_weights = [0.40, 0.30, 0.15, 0.10, 0.05]

    customers = [f"Cust-{1000 + i:04d} ({name})" for i, name in enumerate([
        "Aarav Sharma", "Priya Patel", "Rohan Mehta", "Ananya Reddy", "Vikram Singh",
        "Neha Gupta", "Rahul Verma", "Siddharth Rao", "Kavya Nair", "Amit Joshi",
        "Deepak Kumar", "Meera Iyer", "Suresh Menon", "Pooja Deshmukh", "Rajesh Agarwal",
        "Sunita Kulkarni", "Tarun Saxena", "Nisha Choudhury", "Alok Mukherjee", "Divya Malhotra",
        "Karan Kapoor", "Shruti Banerjee", "Manish Pandey", "Swati Pillai", "Gaurav Bhatia"
    ])]

    start_date = datetime(2024, 1, 1)
    end_date = datetime(2026, 8, 10)
    days_range = (end_date - start_date).days

    records = []

    for i in range(1, num_records + 1):
        order_id = f"ORD-2024-{10000 + i}"
        random_days = random.randint(0, days_range)
        order_date = (start_date + timedelta(days=random_days)).strftime("%Y-%m-%d")
        
        category = random.choice(list(categories_products.keys()))
        prod_tuple = random.choice(categories_products[category])
        product_name, base_price, base_profit_per_unit = prod_tuple
        
        # Slight price variation
        price_variation = random.uniform(0.95, 1.05)
        unit_price = round(base_price * price_variation, -1) # rounded to tens
        
        # Quantity based on product type
        if category in ["Electronics", "Appliances"]:
            quantity = random.choices([1, 2, 3], weights=[0.80, 0.15, 0.05])[0]
        else:
            quantity = random.choices([1, 2, 3, 4, 5, 8, 10], weights=[0.40, 0.25, 0.15, 0.10, 0.05, 0.03, 0.02])[0]

        revenue = round(unit_price * quantity, 2)
        profit_margin_factor = random.uniform(0.18, 0.35)
        profit = round(revenue * profit_margin_factor, 2)
        
        region = random.choice(list(regions_cities.keys()))
        city = random.choice(regions_cities[region])
        customer = random.choice(customers)
        channel = random.choices(channels, weights=channel_weights)[0]
        payment = random.choices(payment_methods, weights=payment_weights)[0]

        records.append({
            "Order ID": order_id,
            "Date": order_date,
            "Product": product_name,
            "Category": category,
            "Customer": customer,
            "Region": region,
            "City": city,
            "Quantity": quantity,
            "Unit Price": unit_price,
            "Revenue": revenue,
            "Profit": profit,
            "Sales Channel": channel,
            "Payment Method": payment
        })

    df = pd.DataFrame(records)
    
    # Introduce controlled realistic data quirks in 5% of records for Data Quality testing
    # e.g., missing values or whitespace
    df_clean = df.copy()
    
    if output_path:
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        df_clean.to_csv(output_path, index=False)
        print(f"Generated {len(df_clean)} sample records at {output_path}")

    return df_clean

if __name__ == "__main__":
    curr_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.abspath(os.path.join(curr_dir, "..", ".."))
    csv_path = os.path.join(project_root, "data", "sample_sales.csv")
    generate_sample_sales(650, csv_path)
