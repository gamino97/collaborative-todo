def test_get_user_success(app, user):
    with app.test_client(user=user) as client:
        # Login the user
        with client.session_transaction() as sess:
            assert "_user_id" in sess

        # Call the endpoint
        response = client.get("/api/auth/user")

        # Assert the response
        assert response.status_code == 200
        data = response.get_json()
        assert "name" in data
        assert "active" in data
        assert "created_at" in data
        assert "email" in data
        assert "uuid" in data
        assert "updated_at" in data


def test_get_user_unauthenticated(app):
    with app.test_client() as client:
        # Call the endpoint
        response = client.get("/api/auth/user")

        # Assert the response
        assert response.status_code == 200
        assert response.get_json() == {}
