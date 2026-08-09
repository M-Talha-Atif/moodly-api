# Load testing (Apache Bench)

Sample `ab` command for a quick load test against booking creation. Replace `<ACCESS_TOKEN>`
with a real token from `POST /v1/auth/login` (never commit a real token here, this file is
checked into git).

```bash
ab -n 50 -c 20 \
  -p payload.json -T "application/json" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  http://localhost:3002/v1/user/bookings
```

`payload.json` (not committed, create it locally, `experienceId` must be a real experience's UUID):

```json
{ "experienceId": "976f487a-f7de-4be4-a47a-f68881034f5d" }
```
