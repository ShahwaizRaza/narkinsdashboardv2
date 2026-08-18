from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import time
import os
from datetime import datetime, date, timedelta
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# API Credentials (set these in Coolify's Environment Variables, not here)
API_KEY = os.environ.get("SPLENDID_API_KEY")
API_SECRET = os.environ.get("SPLENDID_API_SECRET")
APP_ID = os.environ.get("SPLENDID_APP_ID")

if not all([API_KEY, API_SECRET, APP_ID]):
    raise RuntimeError(
        "Missing required environment variables: "
        "SPLENDID_API_KEY, SPLENDID_API_SECRET, SPLENDID_APP_ID must all be set."
    )

HEADERS = {
    "accept": "*/*",
    "X-Api-Key": API_KEY,
    "X-Api-Secret": API_SECRET,
    "X-App-Id": APP_ID,
    "Content-Type": "application/json-patch+json"
}

# Define API URLs for Different Reports
REPORTS = {
    "ProductDateWiseSale": {
        "url": "https://narkins.splendidaccounts.com/api/narkins-textile-industries/2125/Reports/ProductDateWiseSaleReport",
    }
}

# Branches to EXCLUDE from every report. New branches added on the Splendid
# Accounts side will show up automatically without any code change - just
# add a branch's ID (or name) here if you ever want to hide it.
EXCLUDED_BRANCH_IDS = [
    # e.g. 2994,
    24166
]
EXCLUDED_BRANCH_NAMES = [
    # e.g. "Some Branch Name",
]

# Cache configuration
data_cache = {}
CACHE_DURATION = 300  # 5 minutes in seconds (change to 60 for 1 minute)

def fetch_api_data(report_type):
    """Fetch data from Splendid Accounts API with retries."""
    print(f"\n{'='*50}")
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Fetching fresh data for: {report_type}")
    print(f"{'='*50}")
    
    if report_type not in REPORTS:
        print(f"❌ Invalid report type: {report_type}")
        return None

    report_config = REPORTS[report_type]
    url = report_config["url"]
    
    # Calculate date range
    current_date = date.today()
    first_day = current_date.replace(day=1)
    
    payload = {
        "fromDate": first_day.strftime("%Y-%m-%d"),
        "endDate": current_date.strftime("%Y-%m-%d"),
        # No branchIds filter here on purpose - we ask the API for every
        # branch, then remove excluded ones below. This is what makes new
        # branches show up automatically.
        "ascending": True,
        "orderBy": "Date"
    }

    max_retries = 3
    for attempt in range(max_retries):
        try:
            print(f"🔄 Attempt {attempt + 1}/{max_retries}")
            print(f"📅 Date Range: {payload['fromDate']} to {payload['endDate']}")
            
            response = requests.post(url, headers=HEADERS, json=payload, timeout=30)
            
            print(f"📡 Response Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                
                if isinstance(data, list) and len(data) > 0:
                    print(f"✅ Success! Fetched {len(data)} records before exclusions")
                    
                    # Process data, skipping any excluded branch
                    processed_data = []
                    skipped = 0
                    for item in data:
                        branch_id = item.get("branchId")
                        branch_name = item.get("branchName", "")

                        if branch_id in EXCLUDED_BRANCH_IDS or branch_name in EXCLUDED_BRANCH_NAMES:
                            skipped += 1
                            continue

                        processed_data.append({
                            "Date": item.get("date", ""),
                            "Month": item.get("monthName", ""),
                            "Branch": branch_name,
                            "Code": item.get("productCode", ""),
                            "Product Name": item.get("productName", ""),
                            "Category": item.get("productCategoryName", ""),
                            "SOLD QTY": item.get("soldQuantity", 0),
                            "Type": item.get("symbol", ""),
                            "Total Sales": item.get("includingTaxAmount", 0)
                        })

                    print(f"✅ {len(processed_data)} records kept, {skipped} excluded")

                    return processed_data
                else:
                    print(f"⚠️ API returned empty data")
                    return []
            else:
                print(f"❌ HTTP Error: {response.status_code}")
                print(f"Response: {response.text[:200]}")
                
        except requests.exceptions.Timeout:
            print(f"⏱️ Timeout on attempt {attempt + 1}")
            if attempt < max_retries - 1:
                time.sleep(2)
        except requests.exceptions.RequestException as e:
            print(f"❌ Request Error: {str(e)}")
            if attempt < max_retries - 1:
                time.sleep(2)
        except Exception as e:
            print(f"❌ Unexpected error: {str(e)}")
            return None

    print(f"❌ Failed after {max_retries} attempts")
    return None

@app.route('/')
def home():
    """Health check endpoint."""
    return jsonify({
        "status": "running",
        "message": "Narkins API is running!",
        "api": "Splendid Accounts",
        "endpoints": {
            "/api/data": "Get sales data (requires ?reportType=ProductDateWiseSale)",
            "/api/refresh": "Manually refresh data cache (POST)",
            "/api/cache-status": "Check cache status"
        },
        "cache_duration": f"{CACHE_DURATION} seconds"
    })

@app.route('/api/data', methods=['GET'])
def get_data():
    """Get data with smart caching that auto-refreshes on new day."""
    report_type = request.args.get('reportType', 'ProductDateWiseSale')

    if report_type not in REPORTS:
        return jsonify({"error": "Invalid report type"}), 400

    current_time = datetime.now()
    current_date = current_time.date()
    
    # Check if we have cached data
    if report_type in data_cache:
        cached_data, cache_time, cache_date = data_cache[report_type]
        
        # Check if it's a new day - if so, force refresh
        if cache_date != current_date:
            print(f"🌅 New day detected! Previous: {cache_date}, Current: {current_date}")
            print(f"♻️ Forcing data refresh for new day...")
        # Check if cache is still fresh (within timeout)
        elif (current_time - cache_time).total_seconds() < CACHE_DURATION:
            cache_age = int((current_time - cache_time).total_seconds())
            print(f"📦 Returning cached data (age: {cache_age}s, {len(cached_data)} records)")
            return jsonify(cached_data)
        else:
            cache_age = int((current_time - cache_time).total_seconds())
            print(f"⏰ Cache expired (age: {cache_age}s), fetching fresh data...")
    else:
        print(f"🆕 No cache found, fetching fresh data...")
    
    # Fetch fresh data
    fresh_data = fetch_api_data(report_type)
    
    if fresh_data is None:
        # If fetch fails, return cached data if available
        if report_type in data_cache:
            print("⚠️ Fetch failed, returning stale cache")
            return jsonify(data_cache[report_type][0])
        return jsonify({"error": "Failed to fetch data"}), 500
    
    if not fresh_data:
        # Empty data but successful fetch
        if report_type in data_cache:
            print("⚠️ Empty data returned, using cache")
            return jsonify(data_cache[report_type][0])
        return jsonify([])

    # Update cache with current date
    data_cache[report_type] = (fresh_data, current_time, current_date)
    print(f"💾 Cache updated with {len(fresh_data)} records for date: {current_date}")
    
    return jsonify(fresh_data)

@app.route('/api/refresh', methods=['POST'])
def refresh_data():
    """Manually force refresh of data."""
    report_type = request.args.get('reportType', 'ProductDateWiseSale')
    
    if report_type not in REPORTS:
        return jsonify({"error": "Invalid report type"}), 400
    
    print(f"🔄 Manual refresh requested for {report_type}")
    fresh_data = fetch_api_data(report_type)
    
    if fresh_data is not None:
        current_time = datetime.now()
        current_date = current_time.date()
        data_cache[report_type] = (fresh_data, current_time, current_date)
        return jsonify({
            "status": "success",
            "message": "Data refreshed successfully",
            "records": len(fresh_data),
            "date": str(current_date)
        })
    
    return jsonify({"status": "error", "message": "Failed to refresh data"}), 500

@app.route('/api/cache-status', methods=['GET'])
def cache_status():
    """Get current cache status."""
    status = {}
    current_time = datetime.now()
    
    for report_type in data_cache:
        cached_data, cache_time, cache_date = data_cache[report_type]
        age_seconds = int((current_time - cache_time).total_seconds())
        
        status[report_type] = {
            "cached_date": str(cache_date),
            "cache_time": cache_time.strftime("%Y-%m-%d %H:%M:%S"),
            "age_seconds": age_seconds,
            "age_minutes": round(age_seconds / 60, 1),
            "records": len(cached_data),
            "is_fresh": age_seconds < CACHE_DURATION,
            "is_today": cache_date == current_time.date()
        }
    
    return jsonify({
        "current_time": current_time.strftime("%Y-%m-%d %H:%M:%S"),
        "current_date": str(current_time.date()),
        "cache_duration_seconds": CACHE_DURATION,
        "caches": status
    })

if __name__ == '__main__':
    print("""
    ╔═══════════════════════════════════════════════╗
    ║   🚀 NARKINS SALES API SERVER STARTING...    ║
    ╚═══════════════════════════════════════════════╝
    """)
    print(f"🏢 API Provider: Splendid Accounts")
    print(f"📅 Today's Date: {datetime.now().strftime('%Y-%m-%d')}")
    print(f"⏱️  Cache Duration: {CACHE_DURATION} seconds")
    print(f"🔄 Auto-refresh: Enabled (on cache expiry)")
    print(f"🌅 New Day Detection: Enabled")
    print(f"\n{'='*50}\n")
    
    # Initial data fetch
    print("📊 Fetching initial data...")
    for report in REPORTS.keys():
        data = fetch_api_data(report)
        if data:
            current_time = datetime.now()
            current_date = current_time.date()
            data_cache[report] = (data, current_time, current_date)
            print(f"✅ Cached {len(data)} records for {report}")
        else:
            print(f"⚠️ No data cached for {report}")
    
    print(f"\n{'='*50}")
    print("✅ Server ready!")
    print("🌐 Access at: http://127.0.0.1:5000")
    print(f"{'='*50}\n")
    
    app.run(debug=True, port=5000, use_reloader=False)
