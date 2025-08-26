from services.gcp_vertex import generate_content

# Example: Generate SEO description from artisan’s translated text
prompt = "Generate a short SEO-friendly product description for clay pottery made by an artisan in Rajasthan."
result = generate_content(prompt)

print("Vertex AI Output:", result)
