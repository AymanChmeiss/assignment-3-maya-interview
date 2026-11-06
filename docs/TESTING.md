# Testing Notes

## Mission 2: Employee profile
- Success: profile shows name, email, and company from `/users/1`.
- Failure: changed the URL to `/users/99999`. The API returned 404, `res.ok` was false, `ApiError` was thrown and caught in `EmployeeProfile`. A friendly profile-specific message appeared and thes page title still rendered.

git add app lib docs/TESTING.md
git commit -m "feat: fetch employee profile in a Server Component"