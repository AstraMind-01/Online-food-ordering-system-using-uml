/**
 * Retro STOMP-over-WebSocket Client for Chow Chow Food Ordering System
 * Provides live bi-directional updates for:
 * - /topic/orders/{orderId}/location (Live delivery courier GPS map movement)
 * - /topic/orders/{orderId} (Order status changes: PREPARING -> READY -> OUT_FOR_DELIVERY -> DELIVERED)
 * - /topic/deliveries/{deliveryId}/location
 * - /topic/deliveries (Courier available delivery broadcast)
 */

class StompClient {
  constructor() {
    this.ws = null;
    this.connected = false;
    this.subscriptions = new Map(); // subId -> { destination, callback }
    this.subCounter = 1;
    this.reconnectTimer = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
  }

  getWsUrl() {
    const isHttps = window.location.protocol === 'https:';
    const proto = isHttps ? 'wss:' : 'ws:';
    // Use environment variable or localhost:8080 default
    return `${proto}//localhost:8080/ws`;
  }

  connect(onConnect, onError) {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      if (this.connected && onConnect) onConnect();
      return;
    }

    try {
      const url = this.getWsUrl();
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        // Send STOMP CONNECT frame
        const token = localStorage.getItem('token');
        let connectFrame = 'CONNECT\naccept-version:1.1,1.0\nheart-beat:10000,10000\n';
        if (token) {
          connectFrame += `Authorization:Bearer ${token}\n`;
        }
        connectFrame += '\n\0';
        this.ws.send(connectFrame);
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(event.data, onConnect);
      };

      this.ws.onerror = (err) => {
        console.warn('[WebSocket] Connection error, switching to graceful polling fallback', err);
        if (onError) onError(err);
      };

      this.ws.onclose = () => {
        this.connected = false;
        this.scheduleReconnect();
      };
    } catch (e) {
      console.warn('[WebSocket] Unable to initiate native STOMP socket:', e);
      if (onError) onError(e);
    }
  }

  handleMessage(data, onConnect) {
    if (!data || typeof data !== 'string') return;

    // Check for CONNECTED frame
    if (data.startsWith('CONNECTED')) {
      this.connected = true;
      this.reconnectAttempts = 0;
      if (onConnect) onConnect();

      // Resubscribe active subscriptions
      for (const [subId, sub] of this.subscriptions.entries()) {
        this.sendSubscribeFrame(subId, sub.destination);
      }
      return;
    }

    // Check for MESSAGE frame
    if (data.startsWith('MESSAGE')) {
      const headerEnd = data.indexOf('\n\n');
      if (headerEnd === -1) return;

      const headersRaw = data.slice(0, headerEnd).split('\n');
      let destination = '';
      for (const h of headersRaw) {
        if (h.startsWith('destination:')) {
          destination = h.substring('destination:'.length).trim();
        }
      }

      // Extract body (trimmed of null-byte trailer)
      let bodyRaw = data.slice(headerEnd + 2);
      if (bodyRaw.endsWith('\0')) {
        bodyRaw = bodyRaw.slice(0, -1);
      }

      let payload = bodyRaw;
      try {
        payload = JSON.parse(bodyRaw);
      } catch {
        // payload remains text string
      }

      // Dispatch to matching subscriber callbacks
      for (const [, sub] of this.subscriptions.entries()) {
        if (sub.destination === destination || destination.startsWith(sub.destination)) {
          try {
            sub.callback(payload);
          } catch (cbErr) {
            console.error('[WebSocket] Subscription callback error:', cbErr);
          }
        }
      }
    }
  }

  sendSubscribeFrame(subId, destination) {
    if (!this.connected || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    const subFrame = `SUBSCRIBE\nid:${subId}\ndestination:${destination}\nack:auto\n\n\0`;
    this.ws.send(subFrame);
  }

  subscribe(destination, callback) {
    const subId = `sub-${this.subCounter++}`;
    this.subscriptions.set(subId, { destination, callback });

    if (this.connected) {
      this.sendSubscribeFrame(subId, destination);
    } else {
      this.connect();
    }

    // Return un-subscribe function
    return () => {
      this.subscriptions.delete(subId);
      if (this.connected && this.ws && this.ws.readyState === WebSocket.OPEN) {
        const unsubFrame = `UNSUBSCRIBE\nid:${subId}\n\n\0`;
        this.ws.send(unsubFrame);
      }
    };
  }

  scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) return;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);

    const delay = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts), 15000);
    this.reconnectAttempts++;
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.subscriptions.clear();
    this.connected = false;
    if (this.ws) {
      try {
        this.ws.close();
      } catch {}
      this.ws = null;
    }
  }
}

export const wsClient = new StompClient();
export default wsClient;
