import { sleep } from 'k6'
import http from 'k6/http'

// See https://k6.io/docs/using-k6/options
export const options = {
  stages: [
    { duration: '1m', target: 50 },
    { duration: '3m', target: 50 },
    { duration: '5m', target: 50 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.02'], // http errors should be less than 2%
    http_req_duration: ['p(95)<2000'], // 95% requests should be below 2s
  },
  ext: {
    loadimpact: {
      distribution: {
       // 'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 30 },
        'amazon:fr:paris': { loadZone: 'amazon:fr:paris', percent: 100 },
      },
    },
  },
}


//let accessToken = "YOUR_ACCESS_TOKEN";

export default function () {

  let query = `
  query GetUserDetail {
    getAddressResult(q: "del",rows: 25,start:0,search_type:"keyword",) {
         response {
        numFound
        start
        docs {
           zipcode
            address1
        }
      }      
    }
  }`;

  let headers = {
    // 'Authorization': `Bearer ${accessToken}`,
    "Content-Type": "application/json"
  };

  let res = http.post("https://your-api/graphql",
    JSON.stringify({ query: query }),
    { headers: headers }
  );
  if (res.status !== 200) {
    console.log(JSON.stringify(res));   
  }
  
  sleep(0.3);
}
