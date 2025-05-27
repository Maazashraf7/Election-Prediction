import os
import requests

from flask import jsonify, request


BEARER_TOKEN = os.getenv("TWITTER_BEARER_TOKEN")

def get_tweets(query, max_results=10):
    url = f"https://api.twitter.com/2/tweets/search/recent?query={query}&max_results={max_results}&tweet.fields=text"
    headers = {"Authorization": f"Bearer {BEARER_TOKEN}"}
    
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        return {"error": "Failed to fetch tweets"}, response.status_code

    tweets = response.json().get("data", [])
    return [{"text": tweet["text"], "sentiment": dummy_sentiment(tweet["text"])} for tweet in tweets]

def dummy_sentiment(text):
    import random
    return random.choice(["Positive", "Negative", "Neutral"])

# Optional Flask route
from flask import Blueprint

twitter_api = Blueprint('twitter_api', __name__)

@twitter_api.route("/api/tweets", methods=["GET"])
def twitter_endpoint():
    query = request.args.get("query")
    if not query:
        return jsonify({"error": "Missing query param"}), 400
    return jsonify(get_tweets(query))
