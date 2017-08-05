  // Initialize Firebase
 /* var config = {
    apiKey: "AIzaSyD64Pvbid5872NQNwrRm8pjeWvqJ4wykDM",
    authDomain: "storyme-5b335.firebaseapp.com",
    databaseURL: "https://storyme-5b335.firebaseio.com",
    projectId: "storyme-5b335",
    storageBucket: "storyme-5b335.appspot.com",
    messagingSenderId: "574338650013"
  };

  firebase.initializeApp(config);
*/

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAP42hRl_xz8Z7SMIRqcBgDuPeNELo0xt4",
    authDomain: "practicestoryme.firebaseapp.com",
    databaseURL: "https://practicestoryme.firebaseio.com",
    projectId: "practicestoryme",
    storageBucket: "practicestoryme.appspot.com",
    messagingSenderId: "680274883572"
  };
  firebase.initializeApp(config);


  var database = firebase.database(); ////reference to database root
  var storyRef = database.ref("/storyLines"); 
  var usersRef = database.ref("/Users");
  var startingSentence = database.ref("/Starting Sentences");
  var usersKeysArr = [];
  var playersNum = 0;

  $("#resetBtn").show();


////////The login html page code///////////////// 

///when the user logs in the user's name is pushed into the users database
$("#login").on("click", function(){

  var userName = $("#nameInput").val().trim();
  
  usersRef.child(playersNum+1).update({name: userName, status: "online"});
  sessionStorage.setItem("playerKey", JSON.stringify(playersNum));
  sessionStorage.setItem("userName", JSON.stringify(userName));
  var userNum = JSON.parse(sessionStorage.getItem("playerKey"));
  console.log(userNum);
 
 if(userNum === 0){
  console.log("please sign in");
  }

  else if(userNum === 1){
      console.log("you are the first player");

      $("#login").attr("href", "storyThemes.html");
       
      //setTimeout(function(){}, 3000);


  }
  else{
      console.log("you are not the first player");
        $("#login").attr("href", "storyPage.html");
       //setTimeout(function(){}, 3000);

  }


});


///When new user is added to the database if this is the first user then he is moved
///to the story themes page to choose a theme that applies to the rest of the players
///if this is not the first player then he automatically moves to the story page with the
///chosen theme
usersRef.on("value", function(snap){
  playersNum = snap.numChildren();


 //var userNum = JSON.parse(sessionStorage.getItem("playerKey"));
 //console.log(userNum);
 /*
  if(playersNum === 0){
    console.log("please sign in");
  }

  else if(playersNum=== 1){
      console.log("you are the first player");
        $("#login").attr("href", "storyThemes.html");


  }
  else{
      console.log("you are not the first player");
        $("#login").attr("href", "storyPage.html");

  }
*/

  $("#playerStatus").empty();
  for (var i = 1; i <= playersNum; i++) {
    var j = i.toString();
    var obj = snap.child(j).val();
    console.log(obj.name);
    console.log(obj.status);
    var newUser = $("<p>");
    newUser.html(obj.name+ " is " + obj.status);
    $("#playerStatus").append(newUser);

  }

},function(err){
  console.log(err);
});

/////////////////////////////////////////////////



////The stories themes html page code////////////

//initializing an array with the starting sentences, a sentence for each theme
var startingSentences = ["The night sky was full of stars but no moon.",
   "Lately, Marlene felt that there was something missing from her life.",
   "Lady Luck was always on my side at the casinos.",
   "The subway stopped suddenly inside the tunnel."];

///When the first player clicks on the story theme, the starting sentence related
//that theme is picked from the database and displayed on the story page 
$(".story-image").on("click", function(){
  var imageId = parseInt($(this).attr("id"));
  console.log(imageId);
  console.log(startingSentences[imageId]);
  $(this).attr("href", "storyPage.html");
  database.ref("/Starting Sentences").update({s: startingSentences[imageId]});

});

/////////////////////////////////////////////////////

/////////The story page html code ////////////////

$("#resetBtn").hide();

//////When////// 
startingSentence.on("child_added", function(snap){

    console.log(snap.val());

    $("#storyDiv").html(snap.val());

});


///When the user clicks write the sentence he entered is pushed to the database
$("#submitSentence").on("click", function(event){

    event.preventDefault();

    var newSentence = $("#userInput").val();
    var speaker = JSON.parse(sessionStorage.getItem("userName"));

    $("#userInput").val('');

    storyRef.push(speaker+" says "+newSentence);
    

});

////When a new story sentence is added to the database it is automatically displayed 
///in the story page
storyRef.on("child_added", function(snapshot){
    $("#storyDiv").append("<br>"+snapshot.val());

});

/////when the number of sentences reaches the limit, the users are notified that the
////the coming sentence is the last one. When the last sentence is entered the players
///cannot enter any more sentences
storyRef.on("value", function(snap){

    console.log(snap.numChildren());

    var numSentences = snap.numChildren();
    var limitSentence = 5;

    if(numSentences === 5){
      $("#storyDiv").append("This is the last sentence! Enter the ending, Make it count!");

    }

    if(numSentences === (limitSentence+1)){

     $("#submitSentence").attr("disabled", true);

     $("#resetBtn").show();
    }
   

  });

////When the reset button is pressed the database is cleared  
$("#resetBtn").on("click", function(){

    database.ref().remove();
    $("#storyDiv").empty();
     window.location = "index.html";

 });


////when the user hits the leave button, this user is signed out and his status is updated
$("#leaveBtn").on("click", function(){
    var offPlayer = JSON.parse(sessionStorage.getItem("playerKey"));
    usersRef.child(offPlayer).update({status: "offline"});
    window.location = "index.html";
  
  
});
    
  

///////////////////////////////////////////////////





