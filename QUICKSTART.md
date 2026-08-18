# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Make Sure Your Flask API is Running
```bash
# In a separate terminal, run your Flask app
python your_flask_app.py
```

Your Flask API should be running at `http://127.0.0.1:5000`

### Step 3: Start the Dashboard
```bash
npm run dev
```

Open your browser to: **http://localhost:3000**

---

## 🎯 What You'll See

✅ **KPI Cards** showing today's sales and units
✅ **Category breakdown** for today and monthly
✅ **Top products** by revenue
✅ **Product type analysis** (Unstitched, Stitched, Cotton, etc.)
✅ **Auto-refresh** every 60 seconds
✅ **Mobile-responsive** design

---

## 💡 Pro Tips

1. **Refresh Data**: Click the refresh button in the header
2. **Mobile View**: Try it on your phone - it's fully responsive!
3. **Install as App**: On mobile, tap "Add to Home Screen"
4. **Production Build**: Run `npm run build` for deployment

---

## 🔧 Common Issues

**"Cannot connect to API"**
- Make sure Flask is running on port 5000
- Check: http://127.0.0.1:5000/api/data?reportType=ProductDateWiseSale

**"npm install fails"**
- Use Node.js 18 or higher
- Try: `npm cache clean --force` then `npm install`

**"Data not showing"**
- Check Flask console for errors
- Verify API returns JSON data
- Check browser DevTools console

---

## 📱 Test on Mobile

1. Find your computer's local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. On your phone, open: `http://YOUR_IP:3000`
3. Make sure both devices are on the same network

---

## 🎉 That's It!

Your dashboard is now running and is **10x faster** than Streamlit!

**Questions?** Check the full README.md for detailed documentation.
