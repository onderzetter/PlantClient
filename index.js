//var pinlist = [40, 37, 38, 35, 36, 33, 32, 31, 22, 29, 18, 15, 16, 13, 12, 11]

var mqtt = require('mqtt')
var pumps = require('./pumps.js');
var server = 'mqtt://192.168.1.9'
var clientid = 'sol';
var topicroot = clientid+'/';
var ListenTopics = [topicroot+'system', topicroot+'plant',topicroot+'test',topicroot+'exit',topicroot+'start',topicroot+'stop']
var AnswerTopics = [topicroot+'',]
var PlantList = []
var MessageList = 0
const NrOfPlants = PlantList.length;
var client  = mqtt.connect(server);
var pumpRunning = false;
var ready=false;

//Start
console.log('Starting..')
LogtimestampUX();
LogtimestampHuman();
LogcurrentDate();



pumps.data.Init(500); //Sets all pumps inactive
//pumps.data.StartPump(40);
//pumps.data.StopPump(40);
//console.log(pumps)
//pumps.data.Test(5000);
//pumps.data.End(); 

client.on('connect', function () {
  console.log('Connected to :' + server)
  SubscribeToTopics();
})
 
client.on('message', function (rtopic, message) {
  // message is Buffer
  MessageList++
  console.log('We received ' + MessageList + ' message(s) so far.')
  console.log('Msg: '+ message.toString()+ ' -Top: '+ rtopic.toString());
  switch (rtopic) {
    case topicroot+'plant':
        switchPlants(message);
        break;
    case topicroot+'system':
        switchSystem(message);
        break;
    case topicroot+'test':
        switchTest(message);
        break;    
    case topicroot+'start':
        switchStart(message);
        break; 
    case topicroot+'stop':
        switchStop(message);
        break;         
    case topicroot+'exit':
        ready=false;
        running=false;
        closeMqttclient();
        break;
    default:
    {
        switchDefault(rtopic, message);
    }
        
}
  //client.end()
})

function SubscribeToTopics() {
    console.log('Subscribing to topics..')
    client.subscribe(ListenTopics, function (mqttConnectError) {
        if (!mqttConnectError) {
            for (topic in ListenTopics) {
                console.log('We are subscribed to: '+ ListenTopics[topic]);
                //PublishMsg(topic,pubmessage);
            }
        }
    });
}

function PublishMsg(pubtopic, pubmessage) {
    //for(pubtopic in Topics)
    //{
        try {
            //console.log('Publishing msq to '+Topics[topic])
            //client.publish(Topics[topic], pubmessage,0);
            console.log('Publishing msq to '+pubtopic)
            client.publish(pubtopic, pubmessage,0);
        } catch (error) {
            LogError(error);
        }
    //}
    
}

function switchDefault(rtopic, message) {
    console.log('Message received doesnt match known topic: ' + rtopic.toString());
    console.log(message.toString());
}

function switchSystem(message) {
    console.log('Received system message ' + message.toString());
}

function switchTest(message) {
    if(ready){    
    if(!pumpRunning){
        LogtimestampHuman();
        console.log('No pumps active')
        console.log('Testing start')
        pumps.data.Test(500);
        pumpRunning=true;
    }
    else{
        LogtimestampHuman();
        console.log('There is already a pump active..')
        //reply to broker
    }
}
else{
    console.log('Wait.. init not done');
    //reply to broker
    }
}

function switchStart(message) {
    if(ready){    
    if(!pumpRunning){
        LogtimestampHuman();
        console.log('No pumps active')
        console.log('Starting pump on: '+ message)
        pumps.data.StartPump(message)
        pumpRunning=true;
    }
    else{
        LogtimestampHuman();
        console.log('There is already a pump active..')
        //reply to broker
    }
}
else{
    console.log('Wait.. init not done');
    //reply to broker
    }
}

function switchStop(message) {
    if(pumpRunning){
        LogtimestampHuman();
        console.log('Stopping pump on: '+ message)
        pumps.data.StopPump(message)
        pumpRunning=false;
    }
    else{
        LogtimestampHuman();
        console.log('No pumps active')
        //reply to broker
    }
    
}

function switchPlants(message) {
    switch(message){
        case 'add':
            console.log('Received plant message '+ message.toString());
            //if(message.)
            console.log('Adding plant, current count: '+ NrOfPlants);
            try {
            PlantList.push(message.toString());
                } 
            catch (PlantListerror) {
            LogError(PlantListerror);
                }
        break;
        
        case 'pump':
        switchStart(message);
        //pumps.data.StartPump()
        break;


        default:
        if(NrOfPlants < 1){
            console.log('we now have the following plants on list:');
            try 
            {
                //PlantList.forEach(showPlant());    
                for(plant in PlantList)
                {
                    console.log(PlantList[plant]);
                }
                } 
            catch (error) 
                {
                LogError(error);
                }
            }
            else
            {
                console.log('we dont have plants on the list:');
            }
    }
    
    
    
}

function LogError(error) {
    console.error(error.toString());
}

function closeMqttclient() {
    client.end();
}

function LogtimestampUX() {
    console.log('Current time for machines: '+ Math.floor(Date.now() / 1000));
}

function LogtimestampHuman() {
    console.log('Current time for humans: '+ new Date().toLocaleTimeString());
}

function LogcurrentDate() {
    console.log('Current date is: '+ new Date().toISOString().slice(0,10));
}

var methods = {
LogError: function (error) {
    console.error(error.toString());
},
Init: function (bool) {
    ready=bool;
},
Busy: function (bool) {
    pumpRunning=bool;
}
};

exports.data = methods;