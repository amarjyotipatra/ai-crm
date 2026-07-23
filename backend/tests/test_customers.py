def test_create_customer(client):
    payload = {
        "name": "Jane Doe",
        "email": "jane@example.com",
        "phone": "+1 555-0199",
        "company": "Acme Widgets",
        "stage": "Lead",
        "value": 12000.0,
        "status": "Active",
        "tags": "Inbound"
    }
    response = client.post("/customers", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Jane Doe"
    assert data["email"] == "jane@example.com"
    assert "id" in data

def test_get_customers_list(client):
    client.post("/customers", json={"name": "Alice", "email": "alice@test.com", "company": "Co A"})
    client.post("/customers", json={"name": "Bob", "email": "bob@test.com", "company": "Co B"})

    response = client.get("/customers")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2

def test_get_single_customer(client):
    created = client.post("/customers", json={"name": "Charlie", "email": "charlie@test.com"}).json()
    cust_id = created["id"]

    # Test both singular and plural aliases
    res1 = client.get(f"/customer/{cust_id}")
    assert res1.status_code == 200
    assert res1.json()["name"] == "Charlie"

    res2 = client.get(f"/customers/{cust_id}")
    assert res2.status_code == 200
    assert res2.json()["name"] == "Charlie"

def test_update_customer(client):
    created = client.post("/customers", json={"name": "Dave", "email": "dave@test.com", "stage": "Lead"}).json()
    cust_id = created["id"]

    update_payload = {"stage": "Qualified", "value": 50000.0}
    response = client.put(f"/customer/{cust_id}", json=update_payload)
    assert response.status_code == 200
    assert response.json()["stage"] == "Qualified"
    assert response.json()["value"] == 50000.0

def test_delete_customer(client):
    created = client.post("/customers", json={"name": "Eve", "email": "eve@test.com"}).json()
    cust_id = created["id"]

    del_res = client.delete(f"/customer/{cust_id}")
    assert del_res.status_code == 200

    get_res = client.get(f"/customer/{cust_id}")
    assert get_res.status_code == 404
