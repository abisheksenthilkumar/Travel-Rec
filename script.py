import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify
from flask_cors import CORS

# Load the dataset
data = pd.read_csv('filtered_semidata_cleaned_with_weather.csv')

# Preprocess the data
scaler = MinMaxScaler()
data['scaled_cost'] = scaler.fit_transform(data[['cost_per_person']])
data['weather_encoded'] = data['weather'].apply(lambda x: 1 if x == 'cool' else 0)

# Function to recommend vacations using content-based filtering
def recommend_vacations(user_preferences):
    user_vector = [user_preferences['cost_per_person'], user_preferences['weather_encoded']]
    vacation_vectors = data[['scaled_cost', 'weather_encoded']].values
    similarity_scores = cosine_similarity([user_vector], vacation_vectors).flatten()
    top_indices = similarity_scores.argsort()[-3:]  # Top 3 recommendations
    return data.iloc[top_indices].to_dict(orient='records')

# Initialize Flask app
app = Flask(__name__)
CORS(app)

@app.route('/recommend-vacations', methods=['POST'])
def recommend():
    user_preferences = request.json
    user_preferences['weather_encoded'] = 1 if user_preferences['weather'] == 'cool' else 0
    recommendations = recommend_vacations(user_preferences)
    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(debug=True)
