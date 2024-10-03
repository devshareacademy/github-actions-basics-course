from fastapi import FastAPI
import requests

app = FastAPI()

@app.get("/{USER}")
def fetch_gists(USER: str, page: int = 1, per_page: int = 30):
    """
    Fetches publicly available gists for a specified GitHub user
    """
    url = f"https://api.github.com/users/{USER}/gists"
    headers = {"Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28"}
    params = {"page": page, "per_page": per_page}
    response = requests.get(url, params=params, headers=headers)
    
    if response.status_code == 200:
        gists = response.json()
        return {"gists": gists}
    else:
        return {"error": f"User {USER} does not exist"}

@app.get("/")
def health_check():
    """
    Checks the health of the API
    """
    response = {"message": "200 OK"}
    return response