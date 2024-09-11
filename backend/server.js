const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 5000;

let fetch; // Declare fetch

const loadFetch = async () => {
  // Dynamically import node-fetch
  fetch = (await import('node-fetch')).default;
};

loadFetch().then(() => {
  class Source {
    constructor() {
      this.browser = null;
    }

    async getBrowser() {
      if (this.browser) {
        return this.browser;
      }
      this.browser = await puppeteer.launch({
        headless: true,
        defaultViewport: {
          width: 1280, // Width of a MacBook screen
          height: 1400, // Height of a MacBook screen
        },
        args: [
          '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
        ],
      });
      return this.browser;
    }

    convertRawCoordinatesIntoDecimal(input) {
      const grade = parseInt(input.substring(0, input.indexOf('°')));
      const rest = input.substring(input.indexOf('°') + 1);
      const minutes = parseInt(rest.substring(0, rest.indexOf("'")));
      const seconds = parseInt(rest.substring(rest.indexOf("'") + 1).split('"')[0]);
      return grade + (minutes + seconds / 60) / 60;
    }

    async fetch(url, headers = {}, method = 'GET') {
      const response = await fetch(url, { headers, method });
      return response.text();
    }
  }

  class Marinetraffic extends Source {
    async parseLocation(result) {
      return {
        timestamp: result.timestamp,
        latitude: result.latitude,
        longitude: result.longitude,
        course: result.course,
        speed: result.speed,
        source: 'Marinetraffic',
        source_type: 'AIS',
      };
    }
  
    async getLocation(mmsi) {
      const browser = await this.getBrowser();
      const page = await browser.newPage();
      const url = `https://www.marinetraffic.com/en/ais/details/ships/mmsi:${mmsi}`;
  
      await page.goto(url);
  
      // Create a promise that resolves when the response is received
      const responsePromise = new Promise((resolve, reject) => {
        const handleResponse = async (response) => {
          try {
            const request = response.request();
            if (request.url().includes('latestPosition')) {
              const jsonresult = await response.text();
              const parsedData = JSON.parse(jsonresult);
              resolve(parsedData);
            }
          } catch (error) {
            reject(error); // Reject if there's an error in processing the response
          }
        };
  
        // Set up a listener for the 'response' event
        page.on('response', handleResponse);
  
        // Timeout mechanism to reject the promise if no response is received within a certain time
        setTimeout(() => {
          page.off('response', handleResponse); // Clean up the listener
          reject(new Error('Timeout: No response received'));
        }, 10000); // Adjust the timeout duration as needed
      });
  
      try {
        const parsedData = await responsePromise;
        console.log("got to the ending");
        await browser.close();
  
        const result = {
          course: parseFloat(parsedData.course),
          speed: parseFloat(parsedData.speed),
          latitude: parseFloat(parsedData.lat),
          longitude: parseFloat(parsedData.lon),
          timestamp: new Date(parsedData.lastPos * 1000).toISOString(), // assuming lastPos is in seconds
        };
  
        return this.parseLocation(result);
      } catch (error) {
        console.error('Error fetching or parsing response:', error);
        await browser.close();
        throw error; // Rethrow the error to be handled by the caller
      }
    }
  }
  
  const marinetraffic = new Marinetraffic();

  app.get('/ais/mt/:mmsi/location/latest', async (req, res) => {
    try {
      console.log("yooo");
      const mmsi = req.params.mmsi;
      const location = await marinetraffic.getLocation(mmsi);
      res.json(location);
    } catch (error) {
      console.error('Error fetching ship position data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
