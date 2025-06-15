const getAccessToken = async () => {
    const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token',  {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: '4Ao8JjZ5r2hMTqCKnGrnekzIgtAS3jfr',
        client_secret: 'zVHxoug1nxtGRvxq'
      })
    });
  
    const data = await response.json();
    return data.access_token;
  };
  
  export const searchFlights = async () => {
    const token = await getAccessToken();
  
    const response = await fetch(
      'https://test.api.amadeus.com/v2/shopping/flight-offers?' +
      new URLSearchParams({
        originLocationCode: 'LHR',
        destinationLocationCode: 'CDG',
        departureDate: '2025-05-20',
        adults: '1',
        max: '10'
      }),
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  
    const data = await response.json();
    console.log(data);
  };