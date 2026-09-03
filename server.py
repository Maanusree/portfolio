import http.server
import socketserver
import os

PORT = int(os.environ.get("PORT", 8000))

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable caching headers
        self.send_header('Cache-Control', 'public, max-age=3600')
        super().end_headers()

if __name__ == "__main__":
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving static site at http://0.0.0.0:{PORT}")
        httpd.serve_forever()
