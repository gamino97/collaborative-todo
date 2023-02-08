def test_logout(app, user):
    with app.test_client(user=user) as client:
        # Assert that the user is logged in
        with client.session_transaction() as session:
            assert session.get("_user_id") == str(user.id)

        # Send a POST request to the logout endpoint
        response = client.post("/api/auth/logout")
        assert response.status_code == 200

        # Assert that the response contains the expected message
        assert response.get_json() == {"message": "Logged Out Successfully"}
        with client.session_transaction() as session:
            # Assert that the user is no longer logged in
            assert "_user_id" not in session


def test_logout_unauthenticated(client):
    # Call the endpoint
    response = client.post("/api/auth/logout")

    # Assert the response
    assert response.status_code == 200
    assert response.get_json() == {"message": "Logged Out Successfully"}
