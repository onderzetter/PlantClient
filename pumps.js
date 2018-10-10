var gpi = require('rpi-gpio')
var main = require('./index.js')
var gpip = gpi.promise;

//gpio stuff
var pinlist = [40, 37, 38, 35, 36, 33, 32, 31, 22, 29, 18, 15, 16, 13, 12, 11]
var NrOfPins = pinlist.length;
var loops = 0;
var errors = 0;
//main.data.LogError(error);

var methods = {
  Test: function (timeout){    
      loops = 0;
      Timed(pinlist[loops],timeout);
      },
    Init: function (timeout){
      console.log('Resetting pins..');
      console.log('We have ' + NrOfPins + ' to do')
      loops = 0;
      Timed(pinlist[loops],timeout);
      },
    StartPump: function (pin){
      RelaySwitchOn(pin)
      },
    StopPump: function (pin){
      RelaySwitchOff(pin)
      },
    End: function (){
      gpi.destroy();
      }
};

function Timed(pin, timeout) {
  if(loops < NrOfPins){
        setTimeout(function(){
    Initialise(pin);
      },timeout)
  }
    if(NrOfPins == loops){
        console.log('Errors: '+errors)
        
        if(errors == 0){
          console.log('Resetting pins done.');
          main.data.Init(true);
        }
        else{
          console.log('Reset pins failed');
        }
        errors=0;
        gpi.destroy();
    }
    
}

function Initialise(pin){
  loops++;
  console.log('Pin ' + pin + ' done');
  Timed(pinlist[loops],1000);
  gpip.setup(pin, gpi.DIR_OUT)
    .then(() => {
        return gpip.write(pin, true)
    })
    .catch((err) => {
      errors++;
      console.log('Error: ' +pin+' '+ err.toString());
      })
}

function RelaySwitchOn(pin){
  gpip.setup(pin, gpi.DIR_LOW)
      .then(() => {
        return gpip.write(pin, false)
    })
    .catch((err) => {
        main.data.Busy(false);
        main.data.LogError('Error: ' +pin+' '+ err.toString());
        })
}

function RelaySwitchOff(pin){
  gpip.setup(pin, gpi.DIR_HIGH)
    .then(() => {
        return gpip.write(pin, true)
    })
    .catch((err) => {
      main.data.Busy(true);
        main.data.LogError('Error: ' +pin+' '+ err.toString());
        })
}
//module.exports = methods; 
exports.data = methods;


 

// To write
// gpip.setup(pin2, gpi.DIR_OUT)
// .then (() =>{
//     return gpip.write(pin2, true)
// })
// .catch ((err) =>{
//     console.log('Error: ', err.toString())
// })

// // To read
// gpi.setup(pin1, gpi.DIR_IN, readInput);

// function readInput(err){
//     if (err) throw err;
//     gpip.read(pin1, function(err,value){
//         if (err) throw err;
//         console.log('The value is ' + value)
//     })
// }

// gpi.setup(pin2, gpi.DIR_IN, readInput2);

// function readInput2(err){
//     if (err) throw err;
//     gpip.read(pin2, function(err,value){
//         if (err) throw err;
//         console.log('The value is ' + value)
//     })
// }
 
 //when connection is succesfull subscribe to a topic
 //add something to keep multiple topics 
 // like a topic list

  // To read

//To write
// gpip.setup(gpiTrigger, gpi.DIR_OUT)
// .then (() =>{
//     return gpip.write(gpiTrigger, true)
// })
// .catch ((err) =>{
//     console.log('Error: ', err.toString())
// })
// gpi.setup(pin2, gpi.DIR_IN, readInput2);

// function readInput2(err){
//     if (err) throw err;
//     gpip.read(pin2, function(err,value){
//         if (err) throw err;
//         console.log('The value is ' + value)
//         client.publish(topic, 'The value is ' + value)
//     })
// }