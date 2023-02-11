from collections import Counter


def test_get_user_success(app, user):
    with app.test_client(user=user) as client:
        # Login the user
        with client.session_transaction() as sess:
            assert "_user_id" in sess

        # Call the endpoint
        response = client.get("/api/auth/user")

        # Assert the response
        assert response.status_code == 200
        data: dict = response.json
        response_keys = ["name", "active", "created_at", "email", "uuid", "updated_at"]
        for key in response_keys:
            assert key in data
        assert Counter(data.keys()) == Counter(response_keys)


def test_get_user_unauthenticated(app):
    with app.test_client() as client:
        # Call the endpoint
        response = client.get("/api/auth/user")

        # Assert the response
        assert response.status_code == 200
        assert response.json == {}
