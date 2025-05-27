from flask import Flask,request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import tweepy
from textblob import TextBlob
import os
import time
app = Flask(__name__)
CORS(app)
# Add this near the top, after your imports
data = pd.read_csv('indian-national-level-election[cleaned].csv')
# Twitter API credentials (replace with your own)
BEARER_TOKEN = "AAAAAAAAAAAAAAAAAAAAAHZawgEAAAAAg%2BSpqef24CDoT8w2QvtCB4GhyxE%3D1STcWyTfzULqBW7CjySw5Ysuy7CBQLGtnB8u0eNew5FqNqUlmR"
tweet_cache = {}  # {query: {"data": [...], "timestamp": ...}}
client = tweepy.Client(bearer_token=BEARER_TOKEN)

def analyze_sentiment(text):
    analysis = TextBlob(text)
    if analysis.sentiment.polarity > 0.1:
        return "Positive"
    elif analysis.sentiment.polarity < -0.1:
        return "Negative"
    else:
        return "Neutral"

@app.route('/tweets', methods=['GET'])
def get_tweets():
    query = request.args.get('query', '').strip().lower()
    if not query:
        return jsonify([])

    now = time.time()
    # Check cache: if data exists and is less than 15 minutes old, return it
    if query in tweet_cache and now - tweet_cache[query]["timestamp"] < 900:
        return jsonify(tweet_cache[query]["data"])

    try:
        tweets = client.search_recent_tweets(query=query, max_results=20, tweet_fields=["text"])
        tweet_list = []
        for tweet in tweets.data or []:
            sentiment = analyze_sentiment(tweet.text)
            tweet_list.append({
                "text": tweet.text,
                "sentiment": sentiment
            })
        # Save to cache
        tweet_cache[query] = {"data": tweet_list, "timestamp": now}
        return jsonify(tweet_list)
    except tweepy.TooManyRequests as e:
        print("Rate limit exceeded:", e)
        # Return cached data if available, else mock data
        if query in tweet_cache:
            return jsonify(tweet_cache[query]["data"])
        mock_tweets = [
            {"text": "Great work by BJP!", "sentiment": "Positive"},
            {"text": "Congress is facing challenges.", "sentiment": "Neutral"},
            {"text": "I dislike the corruption in politics.", "sentiment": "Negative"}
        ]
        return jsonify(mock_tweets), 200
    except Exception as e:
        print(e)
        # Return cached data if available, else mock data
        if query in tweet_cache:
            return jsonify(tweet_cache[query]["data"])
        mock_tweets = [
            {"text": "Great work by BJP!", "sentiment": "Positive"},
            {"text": "Congress is facing challenges.", "sentiment": "Neutral"},
            {"text": "I dislike the corruption in politics.", "sentiment": "Negative"}
        ]
        return jsonify(mock_tweets), 200
    

# if __name__ == "__main__":
#     app.run(debug=True)
# ...rest of your code...
@app.route('/years', methods=['GET'])
def get_years():
    try:
        # Get unique years from the dataset
        unique_years = data['year'].unique().tolist()
        return jsonify(unique_years)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/chart/<int:year>', methods=['GET'])
def get_chart(year):
    try:
        # Filter data for the requested year
        filtered_data = data[data['year'] == year]

        # If no data is found for the year, return an empty list
        if filtered_data.empty:
            return jsonify([])

        # Convert the filtered data to a list of dictionaries
        result = filtered_data[['pc_name', 'partyname', 'totvotpoll', 'st_name']].to_dict(orient='records')
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
 
@app.route('/party-votes/<int:year>', methods=['GET'])
def get_party_votes(year):
    try:
        # Filter data for the requested year
        filtered_data = data[data['year'] == year]

        # If no data is found for the year, return an empty list
        if filtered_data.empty:
            return jsonify([])

        # Group by 'st_name' and 'partyname', and calculate the total votes for each party in each state
        state_party_votes = filtered_data.groupby(['st_name', 'partyname']).agg({
            'totvotpoll': 'sum'
        }).reset_index()

        # Convert the grouped data to a list of dictionaries
        result = state_party_votes.to_dict(orient='records')
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/state-party-votes/<state>/<int:year>', methods=['GET'])
def get_state_party_votes(state, year):
    try:
        # Filter data for the requested state and year
        filtered_data = data[(data['st_name'] == state) & (data['year'] == year)]

        # If no data is found, return an empty list
        if filtered_data.empty:
            return jsonify([])

        # Calculate total votes for the state
        total_votes = filtered_data['totvotpoll'].sum()

        # Calculate vote percentage for each party
        filtered_data['vote_percentage'] = (filtered_data['totvotpoll'] / total_votes) * 100

        # Group by partyname and sum the vote percentages
        grouped_data = filtered_data.groupby('partyname', as_index=False).agg({
            'vote_percentage': 'sum'
        })

        # Convert the grouped data to a list of dictionaries
        result = grouped_data.to_dict(orient='records')
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/states/<int:year>', methods=['GET'])
def get_states(year):
    try:
        # Filter data for the requested year
        filtered_data = data[data['year'] == year]

        # Get unique states
        unique_states = filtered_data['st_name'].unique().tolist()
        return jsonify(unique_states)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/state', methods=['GET'])
def get_state():
    try:
        # Get unique states from the dataset
        unique_states = data['st_name'].unique().tolist()
        return jsonify(unique_states)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/state-data/<state>', methods=['GET'])
def get_state_data(state):
    try:
        # Filter data for the requested state
        filtered_data = data[data['st_name'] == state]

        # If no data is found for the state, return an empty list
        if filtered_data.empty:
            return jsonify([])

        # Convert the filtered data to a list of dictionaries
        result = filtered_data.to_dict(orient='records')
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
model = joblib.load('model/model.pkl')
model_features = joblib.load('model/model_features.pkl')
df = pd.read_csv('indian-national-level-election[cleaned].csv')
joblib.dump(model_features, 'model/model_features.pkl')

@app.route('/predict', methods=['POST'])
def predict_state():
    try:
        request_data = request.get_json()  # Get the request data
        print("Received request data:", request_data)  # Debugging log

        state = request_data.get('state')
        if not state:
            return jsonify({"error": "State is required"}), 400

        # Filter data for the requested state
        filtered_data = data[data['st_name'] == state]
        print("Filtered data for state:", filtered_data)  # Debugging log

        # If no data is found for the state, return an empty list
        if filtered_data.empty:
            return jsonify([])

        # Ensure all model features are present in the filtered data
        for feature in model_features:
            if feature not in filtered_data.columns:
                filtered_data[feature] = 0  # Fill missing columns with default value

        # Convert non-numeric values to numeric
        for feature in model_features:
            if filtered_data[feature].dtype == 'object':  # Check if the column is non-numeric
                filtered_data[feature] = pd.to_numeric(filtered_data[feature], errors='coerce').fillna(0)

        # Perform prediction probabilities
        probabilities = model.predict_proba(filtered_data[model_features])  # Use only model features
        class_labels = model.classes_  # Get the class labels (parties)
        print("Prediction Probabilities:", probabilities)  # Debugging log

        # Prepare the result
        result = []
        for row, probs in zip(filtered_data.to_dict(orient='records'), probabilities):
            party_probabilities = {str(class_labels[i]): probs[i] for i in range(len(class_labels))}  # Convert keys to str
            result.append({
                "constituency": str(row['pc_name']).strip(),
                "candidate": str(row['cand_name']).strip(),
                "partyname": str(row['partyname']).strip(),
                "predicted_party": max(party_probabilities, key=party_probabilities.get),
                "party_probabilities": party_probabilities
            })

        return jsonify(result)
    except Exception as e:
        print("Error occurred:", str(e))  # Debugging log
        return jsonify({"error": str(e)}), 500
    
    
if __name__ == '__main__':
    app.run(debug=True)