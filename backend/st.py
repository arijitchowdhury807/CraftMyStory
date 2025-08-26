from google.cloud import storage

def test_gcp_connection():
    client = storage.Client()
    buckets = list(client.list_buckets())
    print("Buckets in your project:")
    for bucket in buckets:
        print(bucket.name)

if __name__ == "__main__":
    test_gcp_connection()
