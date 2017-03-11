window.onload = function() {
  var config = {
    apiKey: "AIzaSyDHQ1wGhiNYdzBHIdb_mzMXfnyp0GdGnR8",
    authDomain: "breaking-vad-online-simulation.firebaseapp.com",
    databaseURL: "https://breaking-vad-online-simulation.firebaseio.com",
    storageBucket: "breaking-vad-online-simulation.appspot.com",
  };
  firebase.initializeApp(config);

  const txtEmail = document.querySelectorAll("#txtEmail")[0];
  console.log(txtEmail);
  const txtPassword = document.querySelectorAll("#txtPassword")[0];
  console.log(txtPassword);
  const btnLogin = document.querySelectorAll("#btnLogin")[0];
  console.log(btnLogin);
  const btnSignUp = document.querySelectorAll("#btnSignUp")[0];
  console.log(btnSignUp);
  var users = firebase.database().ref("Users");

  btnLogin.addEventListener('click', function(e){
    console.log(txtEmail.value);
    //alert(txtPassword.value)
    const email = txtEmail.value;
    const password = txtPassword.value;
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email, password).then(function() {
      window.open('../instructorInterface/mainPage.html');
    });
    promise.catch(function(e) {alert(e.message)});

  });

  btnSignUp.addEventListener('click', function(e){
    const email = txtEmail.value;
    const password = txtPassword.value;
    const auth = firebase.auth();

    const promise = auth.createUserWithEmailAndPassword(email, password);
    promise.catch(function(e){alert(e.message)});

  });


  const forgotPW = document.querySelectorAll("#forgotPW")[0];
  forgotPW.addEventListener('click', function(e){
    const email = txtEmail.value;
    if(!email) {
        alert('Please enter Email Address and re-click "Forgot password?" to get password recovery email.')
      }
      var auth = firebase.auth();
      auth.sendPasswordResetEmail(email).then(function() {
         alert('A password reset email has been sent to your email address.')
      }, function(error) {
        if(error.code == "auth/invalid-email") {
          alert('Please enter your Email Address and re-click "Forgot password?" to get password recovery email.');
        } else {
          alert(error.message);
        }
      });
  });

  firebase.auth().onAuthStateChanged(function(firebaseUser) {
    if(firebaseUser.emailVerified){
      if(firebaseUser){
        console.log(firebaseUser);
        var userID =  firebaseUser.uid;
        var userEmail = firebaseUser.email;
        users.set({
          UserID: userID
        });
        var usersMap = firebase.database().ref("Users Map/" + userID);
        usersMap.set({
          email: firebaseUser.email
        });
        localStorage.setItem('userid', userID);
      }else{
        console.log("Not Logged In");
      }
    }
    else{
      if(firebaseUser){
        firebaseUser.sendEmailVerification().then(function(){
          alert("A verification email has been sent to you, please verify prior to logging in.");
        },function(error){
          alert(error.message);
        })
      }
    }
  });
};