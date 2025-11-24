from flask import Flask, request, jsonify
from flask_cors import CORS
import praw
import yfinance as yf
import pandas as pd
import numpy as np
from nltk.sentiment import SentimentIntensityAnalyzer
import nltk
import os
from dotenv import load_dotenv

load_dotenv()

# Download NLTK resources
try:
    nltk.data.find('vader_lexicon')
except LookupError:
    nltk.download('vader_lexicon')

app = Flask(__name__)
CORS(app)

class StockAnalyzer:
    def __init__(self):
        self.reddit = praw.Reddit(
            client_id=os.getenv('REDDIT_CLIENT_ID'),
            client_secret=os.getenv('REDDIT_CLIENT_SECRET'),
            user_agent=os.getenv('REDDIT_USER_AGENT')
        )
        self.sia = SentimentIntensityAnalyzer()
            
            # --- NEW CODE: UPDATE LEXICON WITH FINANCIAL SLANG ---
            # VADER scores range from -4.0 (Most Negative) to 4.0 (Most Positive)
        stock_lexicon = {
            # Bearish / Negative Terms
            'put': -3.0,
            'puts': -3.0,
            'short': -3.0,
            'shorts': -3.0,
            'sell': -2.0,
            'selling': -2.0,
            'drop': -2.0,
            'tank': -3.0,
            'tanking': -3.0,
            'crash': -4.0,
            'crashing': -4.0,
            'bear': -2.5,
            'bearish': -2.5,
            'bagholder': -2.0,
            'rip': -2.0,
            'down': -2.0,
                
                # Bullish / Positive Terms
            'call': 3.0,
            'calls': 3.0,
            'long': 2.0,
            'buy': 2.0,
            'buying': 2.0,
            'bull': 2.5,
            'bullish': 2.5,
            'moon': 4.0,
            'rocket': 4.0,
            'hold': 1.0,
            'holding': 1.0,
            'upside': 2.0,
            'green': 2.0,
            'print': 2.0  # e.g. "my calls are printing"
        }
        self.sia.lexicon.update(stock_lexicon)
    def get_stock_details(self, symbol):
        try:
            stock = yf.Ticker(symbol)
            info = stock.info
            
            # 1. Get Core Data
            current_price = info.get('currentPrice') or info.get('regularMarketPrice')
            previous_close = info.get('previousClose') or info.get('regularMarketPreviousClose')
            
            if not current_price: 
                return None

            percent_change = ((current_price - previous_close) / previous_close) * 100

            # 2. Get Chart Data (1 Year History)
            # We fetch 1Y and slice it on the frontend for 1W, 1M, etc.
            # This keeps the API fast.
            hist = stock.history(period="1y")
            chart_data = []
            
            for date, row in hist.iterrows():
                chart_data.append({
                    "date": date.strftime('%Y-%m-%d'),
                    "price": round(row['Close'], 2)
                })

            return {
                "price": round(current_price, 2),
                "currency": info.get('currency', 'USD'),
                "percent_change": round(percent_change, 2),
                "market_cap": info.get('marketCap', 0),
                "volume": info.get('volume', 0),
                "average_volume": info.get('averageVolume', 0), # <--- ADD THIS LINE
                "chart_data": chart_data
            }
        except Exception as e:
            print(f"Stock Error: {e}")
            return None

    def analyze_reddit(self, symbol):
        try:
            # INCREASED LIMIT to 300 to capture more volume for big stocks
            query = f"{symbol} stock"
            subreddit = self.reddit.subreddit("stocks+investing+wallstreetbets+stockmarket+options+finance+economics+securityanalysis+pennystocks+dividends")
            posts = subreddit.search(query, sort='relevance', time_filter='month', limit=300)

            analyzed_posts = []
            sentiment_scores = []

            for post in posts:
                text = f"{post.title} {post.selftext}"
                score = self.sia.polarity_scores(text)['compound']
                sentiment_scores.append(score)

                analyzed_posts.append({
                    "title": post.title,
                    "url": post.url,
                    "score": post.score,
                    "num_comments": post.num_comments,
                    "subreddit": post.subreddit.display_name,
                    "sentiment_score": score,
                    "sentiment_label": "Bullish" if score > 0.05 else ("Bearish" if score < -0.05 else "Neutral"),
                    "created_utc": post.created_utc
                })

            if not analyzed_posts:
                return None

            avg_sentiment = np.mean(sentiment_scores)
            unique_sources = list(set([post['subreddit'] for post in analyzed_posts]))
            
            distribution = {
                "bullish": len([s for s in sentiment_scores if s > 0.05]),
                "neutral": len([s for s in sentiment_scores if -0.05 <= s <= 0.05]),
                "bearish": len([s for s in sentiment_scores if s < -0.05])
            }

            return {
                "average_sentiment": round(avg_sentiment, 3),
                "post_count": len(analyzed_posts),
                "distribution": distribution,
                "top_posts": sorted(analyzed_posts, key=lambda x: x['score'], reverse=True)[:5],
                "sources": unique_sources
            }

        except Exception as e:
            print(f"Reddit Error: {e}")
            return None

analyzer = StockAnalyzer()

@app.route('/api/analyze', methods=['POST'])
def analyze():
    data = request.json
    symbol = data.get('symbol', '').upper()
    
    if not symbol:
        return jsonify({"error": "No symbol provided"}), 400

    # Parallelize this in production, but sequential is fine for now
    stock_data = analyzer.get_stock_details(symbol)
    sentiment_data = analyzer.analyze_reddit(symbol)

    if not stock_data:
        return jsonify({"error": "Could not fetch stock data (Symbol might be wrong)"}), 404

    return jsonify({
        "symbol": symbol,
        "market_data": stock_data,
        "sentiment_data": sentiment_data
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)