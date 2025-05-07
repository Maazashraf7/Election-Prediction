from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
from flask import Flask, jsonify, request
app = Flask(__name__)
CORS(app)

# Load the CSV file once when the app starts
data = pd.read_csv('indian-national-level-election[cleaned].csv')

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

# @app.route('/states', methods=['GET'])
# def get_states():
#     try:
#         # Get unique states from the dataset
#         unique_states = data['st_name'].unique().tolist()
#         return jsonify(unique_states)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
    
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