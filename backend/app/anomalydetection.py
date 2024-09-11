import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from geopy.distance import geodesic

# Sample data
data = {
    'Latitude': [34.052235, 34.052236, 34.052237, 34.052238, 34.052239, 34.052240],
    'Longitude': [-118.243683, -118.243684, -118.243685, -118.243686, -118.243687, -118.243688],
    'SOG': [10, 11, 10.5, 10, 12, 15],
    'COG': [0, 5, 2, 1, 7, 50]
}

def calculate_distances(lat_lon_list):
    distances = []
    for i in range(1, len(lat_lon_list)):
        dist = geodesic(lat_lon_list[i-1], lat_lon_list[i]).kilometers
        distances.append(dist)
    return distances

def anomalyDetection(data):
    # Convert to DataFrame
    df = pd.DataFrame(data)

    # Feature engineering
    df['lat_lon'] = list(zip(df['Latitude'], df['Longitude']))

    # Compute distance between consecutive points

    df['distance'] = [0] + calculate_distances(df['lat_lon'].tolist())
    df.drop(columns=['lat_lon'], inplace=True)

    # Prepare data for anomaly detection
    features = df[['SOG', 'COG', 'distance']].values
    scaler = StandardScaler()
    scaled_features = scaler.fit_transform(features)

    # Isolation Forest for anomaly detection
    iso_forest = IsolationForest(contamination=0.2)
    df['anomaly'] = iso_forest.fit_predict(scaled_features)

    # Flag anomalies
    df['anomaly'] = df['anomaly'].apply(lambda x: 'Anomaly' if x == -1 else 'Normal')

    result = True in [(i == 'Anomaly') for i in df['anomaly']]
    return result
