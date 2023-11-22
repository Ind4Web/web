const registerForm = document.querySelector('.registerForm');
const loginForm = document.querySelector('.loginForm');
const userName = document.querySelector('.userName');
// pass: false (allowed)
// pass: true (denied)
var validator = {
  userName: false,
  userEmail: false,
  userPassword: false,
  pass: false
};

function errorMsg(f, id) {
  var test = document.querySelector(`[for="${f}"]`);
  var test2 = document.getElementById(`${id}`);
  test.style.color = "var(--error-red)";
  test2.style.display = "initial";
};

function errorMsgLogin(f, id, oldSpn1, oldSpn2) {
  var test = document.querySelector(`[for="${f}"]`);
  var test2 = document.getElementById(`${id}`);
  var test3 = document.getElementById(`${oldSpn1}`);
  var test4 = document.getElementById(`${oldSpn2}`);
  test.style.color = "var(--error-red)";
  test2.style.display = "initial";
  test3.style.display = "none";
  test4.style.display = "none";
};

function erseErrorMsg(f, id) {
  var test = document.querySelector(`[for="${f}"]`);
  var test2 = document.getElementById(`${id}`);
  test.style.color = "var(--main-black)";
  test2.style.display = "none";
}

function erseErrorMsgLogin(f, id, oldSpn) {
  var test = document.querySelector(`[for="${f}"]`);
  var test2 = document.getElementById(`${id}`);
  var test3 = document.getElementById(`${oldSpn}`);
  test.style.color = "var(--main-black)";
  test2.style.display = "none";
  test3.style.display = "initial";
}

function setCookie(name, value, daysToLive) {
  const date = new Date();
  date.setTime(date.getTime() + (daysToLive * 24 * 60 * 60 * 1000));
  let expires = "expires=" + date.toUTCString();
  document.cookie = `${name}=${value}; ${expires}; path=/`;
}

loginForm.addEventListener('submit', async event => {
  event.preventDefault();
  await validateInputs('login');
  const userEmail = document.querySelector('.userEmail-login').value;
  const userPassword = document.querySelector('.userPassword-login').value;

  // fetch login
  // https://apimr.onrender.com/register
  if (validator.pass === false) {
    await fetch(`https://apimr.onrender.com/api/login?email=${userEmail}&password=${userPassword}`, {
      method: 'GET'
    })
    .then(res => res.json())
    .then(data => {obj = data;})
    .catch(err => console.log(err));
    
    switch(obj){
      case 'correctPass':
        console.log('correctPass');
        setCookie("login", userEmail, 2);
        window.location.assign("Ind4Web/index_sesioniniciada.html");
        break;
      case 'incorrectPass':
        console.log('incorrectPass');
        break;
      case 'not found':
        console.log('notFound');
        break;
    }

    

    // if (obj === 'denied'){
    //   // console.log('teest');
    //   var test = document.querySelector(`[for="${f}"]`);
    //   var test2 = document.getElementById(`${id}`);
    //   var test3 = document.getElementById(`${oldSpn1}`);
    //   var test4 = document.getElementById(`${oldSpn2}`);
    //   test.style.color = "var(--error-red)";
    //   test2.style.display = "initial";
    //   test3.style.display = "none";
    //   test4.style.display = "none";
    //   errorMsgLogin('userEmail-login', 'loginErr1', 'loginEmail-old', 'loginEmail-new');
    //   errorMsgLogin('userPassword-login', 'loginErr2', 'loginPassword-old', 'loginPassword-new');
    // }
  }
});

// register data to the server
registerForm.addEventListener('submit',async event => {
  event.preventDefault();
  await validateInputs('register');

  if (validator.pass === false) {
    const formData = new FormData(registerForm);
    const data = Object.fromEntries(formData);
    const dataStringify = JSON.stringify(data);
    // https://apimr.onrender.com/register
    // http://localhost:3000
    fetch('https://apimr.onrender.com/api/register', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        body: dataStringify
      })
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.log(err));
  }
});
    
async function validateInputs(type) {
  var obj;
  var pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

  validator = {
    userName: false,
    userEmail: false,
    userPassword: false,
    pass: false
  };
  
  const finalCheck = obj => {
    for(const key in obj){
      if (obj[key]) return key;
    };
    return undefined;
  };
  
  if(type === 'register') {
    const userName = document.querySelector('.userName').value;
    const userEmail = document.querySelector('.userEmail-register').value;
    const userPassword = document.querySelector('.userPassword-register').value;

    //error search
    try{
      erseErrorMsg('inputEmail', 'registerEmail2');
      if (userName === '' || userName.length < 2) {
        errorMsg('inputName', 'registerName')
        validator.userName = true;
      }
      if (!userEmail.match(pattern)) {
        errorMsg('inputEmail', 'registerEmail');
        validator.userEmail = true;
      }
      if (userPassword.length < 8) {
        errorMsg('inputPassword', 'registerPass');
        validator.userPassword = true;
      }
      if (finalCheck(validator) !== undefined) {
        validator.pass = true;
      }
    }catch (err) {console.log(err);};

    //error eraser
    if (validator.userName === false) {
      erseErrorMsg('inputName', 'registerName');
    }
    if (validator.userEmail === false) {
      erseErrorMsg('inputEmail', 'registerEmail');
    }
    if (validator.userPassword === false) {
      erseErrorMsg('inputPassword', 'registerPass');
    }

    // https://apimr.onrender.com/register
    if (validator.pass === false) {
      await fetch(`https://apimr.onrender.com/api/register?email=${userEmail}`, {
        method: 'GET'
      })
      .then(res => {
        return res.json();
      })
      .then(data => {
        obj = data;
      })
      .catch(err => console.log(err));
      if (obj === 'found'){
        errorMsg('inputEmail', 'registerEmail2');
        validator.pass = true;
      }
      console.log(obj);
    }
  }else if (type === 'login'){
    const userEmail = document.querySelector('.userEmail-login').value;
    const userPassword = document.querySelector('.userPassword-login').value;

    //error search
    try{
      // erseErrorMsg('inputEmail', 'registerEmail2');
      if (!userEmail.match(pattern)) {
        errorMsgLogin('userEmail-login', 'loginEmail-new', 'loginEmail-old');
        validator.userEmail = true;
      }
      if (userPassword.length < 8) {
        errorMsgLogin('inputPassword-login', 'loginPassword-new', 'loginPassword-old');
        validator.userPassword = true;
      }
      if (finalCheck(validator) !== undefined) {
        validator.pass = true;
      }
    }catch (err) {console.log(err);};

    //error eraser
    if (validator.userEmail === false) {
      erseErrorMsgLogin('userEmail-login', 'loginEmail-new', 'loginEmail-old')
    }
    if (validator.userPassword === false) {
      erseErrorMsgLogin('inputPassword-login', 'loginPassword-new', 'loginPassword-old')
    }
  }
};

/*login-register switcher*/
function registerSwitch() {
  const firstContainer = document.querySelector('#container1')
  const secondContainer = document.querySelector('#container2')
  firstContainer.style.display = 'none';
  secondContainer.style.display = 'initial';
}

function loginSwitch() {
  const firstContainer = document.querySelector('#container1')
  const secondContainer = document.querySelector('#container2')
  firstContainer.style.display = 'initial';
  secondContainer.style.display = 'none';
}