import os
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import joblib

def train():
    # Load dataset
    csv_path = os.path.join(os.path.dirname(__file__), 'Dataset', 'LinkedIn_Post.csv')
    if not os.path.exists(csv_path):
        print(f"Error: Dataset not found at {csv_path}")
        return

    df = pd.read_csv('D:\LinkedIn Post Virality Predictor\backend\Dataset\LinkedIn_Post.csv')

    # Map day of week to numeric values
    day_mapping = {
        'Monday': 0, 'Tuesday': 1, 'Wednesday': 2, 'Thursday': 3,
        'Friday': 4, 'Saturday': 5, 'Sunday': 6
    }
    df['day_of_week_num'] = df['day_of_week'].map(day_mapping)

    # Map post_type to numeric values
    post_type_mapping = {
        'Text': 0, 'Image': 1, 'Video': 2, 'Carousel': 3
    }
    df['post_type_num'] = df['post_type'].map(post_type_mapping)

    # Map has_media to numeric
    df['has_media_num'] = df['has_media'].map({'Yes': 1, 'No': 0})

    # Map media_type to numeric
    media_type_mapping = {
        'None': 0, 'Image': 1, 'Video': 2
    }
    df['media_type_num'] = df['media_type'].map(media_type_mapping)

    # Parse post_time to get hour
    df['post_time_hour'] = df['post_time'].apply(lambda x: int(str(x).split(':')[0]) if pd.notnull(x) else 12)

    # Features list
    features = [
        'content_length', 'hashtags_count', 'has_media_num', 
        'media_type_num', 'post_type_num', 'day_of_week_num', 'post_time_hour'
    ]

    X = df[features]
    y = df['engagement_rate']

    # Train Random Forest Regressor
    model = RandomForestRegressor(n_estimators=150, random_state=42)
    model.fit(X, y)

    # Save model and mapping metadata
    models_dir = os.path.join(os.path.dirname(__file__), 'models')
    os.makedirs(models_dir, exist_ok=True)

    # Save the trained model
    joblib.dump(model, os.path.join(models_dir, 'virality_model.pkl'))

    # Save metadata for scaling and reference
    metadata = {
        'min_engagement_rate': float(df['engagement_rate'].min()),
        'max_engagement_rate': float(df['engagement_rate'].max()),
        'day_mapping': day_mapping,
        'post_type_mapping': post_type_mapping,
        'media_type_mapping': media_type_mapping
    }
    joblib.dump(metadata, os.path.join(models_dir, 'metadata.pkl'))

    print("Model trained and saved successfully in 'models/' directory!")

if __name__ == '__main__':
    train()
