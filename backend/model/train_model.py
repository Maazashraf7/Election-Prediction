import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib

# Load CSV
df = pd.read_csv('indian-national-level-election[cleaned].csv')

# Prepare features and target
df = df[df['partyname'].notnull()]  # Ensure no missing values

# Determine if the candidate is the winner
df['is_winner'] = df.groupby(['year', 'pc_name'])['totvotpoll'].transform('max') == df['totvotpoll']
df['is_winner'] = df['is_winner'].astype(int)

# Encode categorical features
df['cand_sex'] = df['cand_sex'].map({'M': 0, 'F': 1})
df = pd.get_dummies(df, columns=['partyname', 'pc_type'], drop_first=True)

# Features
X = df[['year', 'pc_no', 'cand_sex', 'totvotpoll', 'electors'] + 
       [col for col in df.columns if col.startswith('partyname_') or col.startswith('pc_type_')]]

# Target: Is winner
y = df['is_winner']

# Train model
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)

# Save model
joblib.dump(clf, 'model.pkl')
joblib.dump(X.columns.tolist(), 'model_features.pkl')  # Save feature columns
