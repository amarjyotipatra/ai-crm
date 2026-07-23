def test_ai_email_generation(client):
    cust = client.post("/customers", json={"name": "Grace", "email": "grace@test.com", "company": "GraceTech"}).json()
    cust_id = cust["id"]

    res = client.post("/ai/generate-email", json={"customer_id": cust_id, "tone": "Professional"})
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "Grace" in data["result"] or "Subject:" in data["result"]

def test_ai_summarize_notes(client):
    cust = client.post("/customers", json={"name": "Hank", "email": "hank@test.com"}).json()
    cust_id = cust["id"]
    client.post("/notes", json={"customer_id": cust_id, "content": "Met with Hank. Discussed annual pricing."})

    res = client.post("/ai/summarize-notes", json={"customer_id": cust_id})
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert len(data["result"]) > 10

def test_ai_next_best_action(client):
    cust = client.post("/customers", json={"name": "Ivy", "email": "ivy@test.com", "stage": "Proposal"}).json()
    cust_id = cust["id"]

    res = client.post("/ai/next-best-action", json={"customer_id": cust_id})
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "Recommended" in data["result"] or "Action" in data["result"]

def test_ai_meeting_summary(client):
    cust = client.post("/customers", json={"name": "Jack", "email": "jack@test.com"}).json()
    cust_id = cust["id"]

    raw_transcript = "Jack: We need custom reporting.\nSales: We can deliver that in Q3."
    res = client.post("/ai/meeting-summary", json={"customer_id": cust_id, "raw_transcript": raw_transcript})
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "Meeting Summary" in data["result"] or "Action" in data["result"]
