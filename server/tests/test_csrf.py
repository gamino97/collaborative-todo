def test_request_example(client):
    response = client.get("/api/getcsrf")
    assert response.json["detail"] == "CSRF cookie set"
    assert response.headers.get("X-CSRFToken")
