curl -X GET "http://example.com/api/user/12345"

curl -X POST "http://example.com/api/user/12345" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "organization": "Example Corp",
    "website": "https://example.com",
    "x_username": "johndoe",
    "telegram_username": "johndoe",
    "discord_username": "johndoe#1234",
    "email": "john@example.com"
  }'

curl -X GET "http://example.com/api/user_key/12345"

curl -X GET "http://example.com/api/user/12345"

curl -X POST "http://example.com/api/user/12345" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "organization": "Example Corp",
    "website": "https://example.com",
    "x_username": "johndoe",
    "telegram_username": "johndoe",
    "discord_username": "johndoe#1234",
    "email": "john@example.com"
  }'
  
curl -X GET "http://example.com/api/user_key/12345"

curl -X GET "http://example.com/api/usage/12345"

curl -X POST "http://example.com/api/usage/12345" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "perk-001",
    "title": "Conference Discount",
    "category": "Event",
    "url": "https://conference.example.com/discount",
    "perk_status": "active",
    "credential_requirements": "[\"certificate-1\", \"certificate-2\"]",
    "global_operator": "AND"
  }'
