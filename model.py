import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
import warnings
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
import json

warnings.filterwarnings('ignore')

# Load the dataset
retail = pd.read_csv(r"D:\Shubham Paper\public\segment.csv")

# Data Cleaning
df_null = round(100 * (retail.isnull().sum()) / len(retail), 2)
retail = retail.dropna()
retail['CustomerID'] = retail['CustomerID'].astype(str)

# Monetary
retail['Amount'] = retail['Quantity'] * retail['UnitPrice']
rfm_m = retail.groupby('CustomerID')['Amount'].sum().reset_index()

# Frequency
rfm_f = retail.groupby('CustomerID')['InvoiceNo'].count().reset_index()
rfm_f.columns = ['CustomerID', 'Frequency']

# Merging Monetary and Frequency
rfm = pd.merge(rfm_m, rfm_f, on='CustomerID', how='inner')

# Recency
retail['InvoiceDate'] = pd.to_datetime(retail['InvoiceDate'], dayfirst=True, errors='coerce')
max_date = max(retail['InvoiceDate'])
retail['Diff'] = max_date - retail['InvoiceDate']
rfm_p = retail.groupby('CustomerID')['Diff'].min().reset_index()
rfm_p['Diff'] = rfm_p['Diff'].dt.days
rfm = pd.merge(rfm, rfm_p, on='CustomerID', how='inner')
rfm.columns = ['CustomerID', 'Amount', 'Frequency', 'Recency']

# Outlier removal
for col in ['Amount', 'Frequency', 'Recency']:
    Q1 = rfm[col].quantile(0.05)
    Q3 = rfm[col].quantile(0.95)
    IQR = Q3 - Q1
    rfm = rfm[(rfm[col] >= Q1 - 1.5*IQR) & (rfm[col] <= Q3 + 1.5*IQR)]

# Scaling
rfm_df = rfm[['Amount', 'Frequency', 'Recency']]
scaler = StandardScaler()
rfm_df_scaled = scaler.fit_transform(rfm_df)
rfm_df_scaled = pd.DataFrame(rfm_df_scaled, columns=['Amount', 'Frequency', 'Recency'])

# KMeans Clustering
kmeans = KMeans(n_clusters=3, max_iter=300)
kmeans.fit(rfm_df_scaled)

# Assign Cluster IDs
rfm['Cluster_ID'] = kmeans.predict(rfm_df_scaled)

# Prepare data for JSON
clusters = rfm[['CustomerID', 'Cluster_ID']].to_dict('records')
purchase_groups = rfm.groupby('CustomerID')['Amount'].sum().reset_index().rename(columns={'Amount': 'totalAmount'}).to_dict('records')

# Save to clusters.json
with open('clusters.json', 'w') as f:
    json.dump({'clusters': clusters, 'purchaseGroups': purchase_groups}, f, indent=4)

# Optional: Save model (if needed for backend later)
import pickle
with open('kmeans_model.pkl', 'wb') as file:
    pickle.dump(kmeans, file)

# Visualizations (optional, for reference)
sns.stripplot(x='Cluster_ID', y='Amount', data=rfm)
plt.savefig("stripplot.png")
sns.stripplot(x='Cluster_ID', y='Frequency', data=rfm)
plt.savefig("Cluster_IdFrequency.png")
sns.stripplot(x='Cluster_ID', y='Recency', data=rfm)
plt.savefig("Cluster_IdRecency.png")