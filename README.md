# stodt-iota-odh
Repository for the IOTA Tangle MAM streams of traffic data as Open Data part of the project STODT

# Install
```sh
git clone https://github.com/noi-techpark/stodt-iota-odh
cd stodt-iota-odh
npm install
npm start
```

# Endpoints

|  Route |  Description  |
|---|---|
|  /  | Get App info  |
|  /get-stations  |   returns all IDs of the parking stations  |
|  /get-newest-record  | Return the timestamp and value of the latest recorded data. (param: station or mam root)  |
|  /get-records  |   Returns all the data of a station  |
|  /append_dataset  |   Append a custom dataset to a stream of a station  |
