def test_add_and_get_notes(client):
    # 1. Create a customer
    customer = client.post("/customers", json={"name": "Frank", "email": "frank@test.com"}).json()
    cust_id = customer["id"]

    # 2. Post a note
    note_payload = {
        "customer_id": cust_id,
        "content": "Excited about the product. Great demo call!",
        "author": "Sales Lead",
        "category": "Meeting"
    }
    response = client.post("/notes", json=note_payload)
    assert response.status_code == 201
    data = response.json()
    assert data["customer_id"] == cust_id
    assert data["sentiment"] == "Positive"

    # 3. Retrieve notes for customer
    get_res = client.get(f"/notes/{cust_id}")
    assert get_res.status_code == 200
    notes_list = get_res.json()
    assert len(notes_list) == 1
    assert notes_list[0]["content"] == "Excited about the product. Great demo call!"

def test_note_invalid_customer(client):
    note_payload = {
        "customer_id": 9999,
        "content": "Orphan note"
    }
    response = client.post("/notes", json=note_payload)
    assert response.status_code == 404
