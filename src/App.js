import './App.css';
import web3 from './web3';
import lottery from './lottery';
import {useEffect,useState} from 'react';


function App() {
  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState('');
  const [balance, setBalance] = useState('');
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');

  useEffect(()=>{
      const getData = async () =>{

      const manager = await lottery.methods.manager().call();
      // console.log(manager)
      setManager(manager);

      const players = await lottery.methods.getPlayers().call();
      setPlayers(players);

      const balance = await web3.eth.getBalance(lottery.options.address);
      setBalance(balance);

    }

    getData();

  },[]);

  const onSubmit = async (event) => {
    event.preventDefault();
    try{
    const accounts = await web3.eth.getAccounts();

    setMessage('Waiting on transaction success...');

    await lottery.methods.enter().send({
      from:accounts[0],
      value:web3.utils.toWei(value,"ether")
    });

    event.target.value = '';

    setMessage('You have been entered');
  }catch(err){
    setMessage('Invalid input!!! To enter you need to enter ether greater then 0.01');
  }

  }

  const pickWinner = async () =>{
    try{
      const accounts = await web3.eth.getAccounts();

      setMessage('Waiting on transaction success...');

      await lottery.methods.pickWinner().send({
        from:accounts[0]
      });

        setMessage('Winner has been picked!!!!');
    }
    catch(err){
      setMessage('Only Manager of Contract can pick the winner!')
    }
  }

  return (
    <div className="App DarkApp">
      <h1 id = "headerDark">Lottery Dapp</h1>
      <div id="centerContainerDark">
        <h4>This lotter is managed by {manager}.</h4>
        <h4>There are currently {players.length} people entered,</h4>
        <h4>competing to win {web3.utils.fromWei(balance,'ether')} ether!</h4>
      </div>
      <div className="displayFlex">
        <form id="darkForm" onSubmit = {onSubmit}>
            <h3>Want to try your luck?</h3>
            <div>
              <input name="value" placeholder = "Enter the amount of Ether" value={value} onChange={event => setValue(event.target.value)}
              />
            </div>
            <button className="darkButton">Enter</button>
       </form>
       <div id="darkPickWinner">
         <h4>Ready to pick a winner?</h4>
         <button className="darkButton" onClick = {pickWinner}>Pick a winner</button>
       </div>
      </div>

      <div className="darkNotification">
       <h5>{message}</h5>
      </div>
    </div>

  );
}

export default App;
