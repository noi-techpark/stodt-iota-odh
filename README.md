# stodt-iota-odh
Repository for the IOTA Tangle MAM streams of traffic data as Open Data part of the project STODT

# Install
```sh
git clone https://github.com/noi-techpark/stodt-iota-odh
cd stodt-iota-odh
npm install
npm start
```

# Information

One the service will start, it fetches the latest data of all given stations from the open hup api, saves it to a local json file and published it to the IOTA Tangle.

### Fetch mam streams

To get the data from a mam stream, you can use https://mam-explorer.firebaseapp.com.
Just add the route, check the provider (main or devnet) and the select the mode "public". 

# Endpoints
All open endpoints to get or post the specific data

### parking
|  Route |  Description  |
|---|---|
|  /  | Get App info  |
|  /parking/get-stations  |   returns all IDs of the parking stations  |
|  /parking/get-newest-record  | Return the timestamp and value of the latest recorded data. (param: station or mam root)  |
|  /parking/get-records  |   Returns all the data of a parking station  |
|  /parking/append_dataset  |   Append a custom dataset to a stream of a parking station  |

### bluetooth
|  Route |  Description  |
|---|---|
|  /  | Get App info  |
|  /bluetooth/get-stations  |   returns all IDs of the bluetooth stations  |
|  /bluetooth/get-newest-record  | Return the timestamp and value of the latest recorded data. (param: station or mam root)  |
|  /bluetooth/get-records  |   Returns all the data of a bluetooth station  |
|  /bluetooth/append_dataset  |   Append a custom dataset to a stream of a bluetooth station  |

### environment
|  Route |  Description  |
|---|---|
|  /  | Get App info  |
|  /environment/get-stations  |   returns all IDs of the environment stations  |
|  /environment/get-newest-record  | Return the timestamp and value of the latest recorded data. (param: station or mam root)  |
|  /environment/get-records  |   Returns all the data of a environment station  |
|  /environment/append_dataset  |   Append a custom dataset to a stream of a environment station  |


# Includes Data

Bluetooth
http://ipchannels.integreen-life.bz.it/BluetoothFrontEnd/swagger-ui.html

Parking
http://ipchannels.integreen-life.bz.it/parking/swagger-ui.html

Environment
http://ipchannels.integreen-life.bz.it/environment/swagger-ui.html

Meteorology
(not found)