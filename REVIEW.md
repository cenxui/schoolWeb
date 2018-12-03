I will just accumulate all my comments in this document and please simply provide status next to each item as 'DONE'when it is done, 'DISAGREE' with reason and no comment as open item.


Review Comment 
10/14/18
1. https://b87wrelcj3.execute-api.us-east-1.amazonaws.com/Dev/logitecdatabase/{deviceId} with '8c8590d45eca' while this one 
/logitecdatabase/ is fine. 
2. for GET specific device id, I would suggest to use URL  /logitechdatabase/device/{deviceId}
3. All URLs in api gateway are open to public, I assume we will enforce token authentication and authorization later. [Confirmed DONE]

Thanks Stephen
