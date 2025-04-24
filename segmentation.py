import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from datetime import datetime
import warnings
import json
import os

# Suppress warnings
warnings.filterwarnings('ignore')

# Load the dataset (using UCI Online Retail Dataset)
retail = pd.read_excel(r"D:\DSPL\retail.xlsx")

# Data Cleaning
# Remove missing CustomerID rows
retail = retail.dropna(subset=['CustomerID'])
# Convert CustomerID to string
retail['CustomerID'] = retail['CustomerID'].astype(str)
# Remove negative quantities (returns/cancellations)
retail = retail[retail['Quantity'] > 0]
# Remove transactions with zero or negative UnitPrice
retail = retail[retail['UnitPrice'] > 0]
# Convert InvoiceDate to datetime
retail['InvoiceDate'] = pd.to_datetime(retail['InvoiceDate'])

# Filter for international customers (exclude UK)
retail = retail[retail['Country'] != 'United Kingdom']

# Calculate Total Amount per transaction
retail['Amount'] = retail['Quantity'] * retail['UnitPrice']

# RFM Analysis
# Recency: Days since last purchase
max_date = retail['InvoiceDate'].max() + pd.Timedelta(days=1)
retail['Diff'] = (max_date - retail['InvoiceDate']).dt.days
rfm_r = retail.groupby('CustomerID')['Diff'].min().reset_index()
rfm_r.columns = ['CustomerID', 'Recency']

# Frequency: Number of transactions
rfm_f = retail.groupby('CustomerID')['InvoiceNo'].nunique().reset_index()
rfm_f.columns = ['CustomerID', 'Frequency']

# Monetary: Total spend
rfm_m = retail.groupby('CustomerID')['Amount'].sum().reset_index()
rfm_m.columns = ['CustomerID', 'Monetary']

# Merge RFM
rfm = pd.merge(rfm_r, rfm_f, on='CustomerID', how='inner')
rfm = pd.merge(rfm, rfm_m, on='CustomerID', how='inner')

# Item-based Features: Product Category Purchases
# Simplify product descriptions into categories (basic approach: use first word of Description)
retail['Category'] = retail['Description'].str.split().str[0].str.upper()
# Count unique categories purchased per customer
category_counts = retail.groupby('CustomerID')['Category'].nunique().reset_index()
category_counts.columns = ['CustomerID', 'UniqueCategories']
# Merge with RFM
rfm = pd.merge(rfm, category_counts, on='CustomerID', how='inner')

# Top 5 categories purchased (pivot table for category presence)
top_categories = retail['Category'].value_counts().head(5).index
category_pivot = retail[retail['Category'].isin(top_categories)].pivot_table(
    index='CustomerID',
    columns='Category',
    values='Amount',
    aggfunc='sum',
    fill_value=0
).reset_index()
# Merge with RFM
rfm = pd.merge(rfm, category_pivot, on='CustomerID', how='left').fillna(0)

# Prepare data for clustering
features = ['Recency', 'Frequency', 'Monetary', 'UniqueCategories'] + list(top_categories)
X = rfm[features]

# Scale features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Determine optimal number of clusters using Elbow Method
inertia = []
for k in range(1, 11):
    kmeans = KMeans(n_clusters=k, random_state=42)
    kmeans.fit(X_scaled)
    inertia.append(kmeans.inertia_)

# Plot Elbow Curve
plt.figure(figsize=(8, 6))
plt.plot(range(1, 11), inertia, marker='o')
plt.xlabel('Number of Clusters')
plt.ylabel('Inertia')
plt.title('Elbow Method for Optimal K')
plt.savefig('elbow_curve.png')
plt.close()

# Choose 4 clusters (based on typical elbow curve analysis; adjust if needed)
n_clusters = 4
kmeans = KMeans(n_clusters=n_clusters, random_state=42)
rfm['Cluster_ID'] = kmeans.fit_predict(X_scaled)

# Add Country to RFM for analysis
customer_country = retail[['CustomerID', 'Country']].drop_duplicates()
rfm = pd.merge(rfm, customer_country, on='CustomerID', how='left')

# Visualize Clusters
# Recency vs Monetary
plt.figure(figsize=(10, 8))
sns.scatterplot(x='Recency', y='Monetary', hue='Cluster_ID', size='Frequency', data=rfm, palette='viridis')
plt.title('Customer Segments: Recency vs Monetary')
plt.savefig('recency_monetary_clusters.png')
plt.close()

# Cluster Summary
cluster_summary = rfm.groupby('Cluster_ID').agg({
    'CustomerID': 'count',
    'Recency': 'mean',
    'Frequency': 'mean',
    'Monetary': 'mean',
    'UniqueCategories': 'mean'
}).reset_index()
cluster_summary.columns = ['Cluster_ID', 'CustomerCount', 'AvgRecency', 'AvgFrequency', 'AvgMonetary', 'AvgUniqueCategories']

# Prepare data for JSON output
# Customer Segments
customer_segments = rfm[['CustomerID', 'Country', 'Recency', 'Frequency', 'Monetary', 'UniqueCategories', 'Cluster_ID']]
customer_segments_json = customer_segments.to_dict(orient='records')

# Cluster Summary
cluster_summary_json = cluster_summary.to_dict(orient='records')

# Combine into a single JSON structure
output_json = {
    'customer_segments': customer_segments_json,
    'cluster_summary': cluster_summary_json
}

# Save to JSON file
with open('customer_segmentation_output.json', 'w') as f:
    json.dump(output_json, f, indent=4)

# Print confirmation
print("Clustering completed. Output saved to 'customer_segmentation_output.json' with:")
print("- customer_segments: Customer-level data with cluster assignments")
print("- cluster_summary: Summary statistics per cluster")