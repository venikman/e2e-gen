import axios from 'axios';
import WebSocket from 'ws';

const mcpServerUrl = process.env.MCP_SERVER_URL || '';
const timeout = parseInt(process.env.MCP_TIMEOUT || '30000');

export const connectToMCP = () => {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(mcpServerUrl);

    ws.on('open', () => {
      console.log('Connected to MCP server.');
      resolve(ws);
    });

    ws.on('error', (err) => {
      console.error('MCP connection error:', err);
      reject(err);
    });

    ws.on('close', () => {
      console.log('MCP connection closed.');
    });
  });
};

export const sendMCPMessage = (ws: WebSocket, message: any) => {
  return new Promise((resolve, reject) => {
    const id = Math.random().toString(36).substring(2);
    ws.send(JSON.stringify({ ...message, id }));
    const timer = setTimeout(() => reject(new Error('MCP timeout')), timeout);

    ws.on('message', (data) => {
      const response = JSON.parse(data.toString());
      if (response.id === id) {
        clearTimeout(timer);
        resolve(response);
      }
    });
  });
};
