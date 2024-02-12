export function Signup() {
  return (
    <>
      <form>
        username: <input type="text" id="username" required/>
        password: <input type="password" id="password" required/>
        <input type="submit" onClick={async (event) => {
          event.preventDefault();
          const username = (document.getElementById('username') as HTMLInputElement).value;
          const password = (document.getElementById('password') as HTMLInputElement).value;

          const res = await (await fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({username, password}),
          })).json();
          
          if (res.isError) {
            if (res.message.message === 'username already exist'){
              alert('username already exists');
              return ;
            }
            alert('signup failed');
            return ;
          }
          alert('signup done');
        }}/>
      </form>
    </>
  );
}