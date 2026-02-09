import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv
import uuid
from datetime import datetime

load_dotenv()

# Mock Firestore for Demo Mode
class MockCollection:
    def __init__(self, data):
        self.data = data

    def document(self, doc_id=None):
        if not doc_id:
            doc_id = str(uuid.uuid4())
        return MockDocument(doc_id, self.data)

    def where(self, field, op, value):
        filtered_data = [d for d in self.data.values() if d.get(field) == value]
        return MockStream(filtered_data)

    def stream(self):
        return [MockSnapshot(d) for d in self.data.values()]

class MockDocument:
    def __init__(self, doc_id, data_store):
        self.id = doc_id
        self.data_store = data_store
    
    def set(self, data):
        self.data_store[self.id] = data
    
    def get(self):
        return MockSnapshot(self.data_store.get(self.id))

    def delete(self):
        if self.id in self.data_store:
            del self.data_store[self.id]

class MockSnapshot:
    def __init__(self, data):
        self._data = data
        self.exists = data is not None
        self.id = data.get('id') if data else None

    def to_dict(self):
        return self._data

class MockClient:
    def __init__(self):
        self._data = {
            "employees": {},
            "attendance": {}
        }
        print("\n" + "="*50)
        print(" WARNING: RUNNING IN DEMO MODE (Mock Database)")
        print(" Data will be lost when server restarts.")
        print(" Add serviceAccountKey.json for real persistence.")
        print("="*50 + "\n")

    def collection(self, name):
        return MockCollection(self._data[name])

# Database Connection Logic
cred_path = "serviceAccountKey.json"
db = None

if os.path.exists(cred_path):
    try:
        cred = credentials.Certificate(cred_path)
        if not firebase_admin._apps:
            firebase_admin.initialize_app(cred)
        db = firestore.client()
        print("SUCCESS: Connected to Firebase Firestore.")
    except Exception as e:
        print(f"ERROR: Failed to connect to Firebase: {e}")
        db = MockClient()
else:
    db = MockClient()

def get_db():
    return db
