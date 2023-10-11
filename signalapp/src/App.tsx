import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import {HubConnection,HubConnectionBuilder, LogLevel} from '@microsoft/signalr'

function App() {
  const [array, setArray] = useState([])
  const [hubConnection, setHubConnection] = useState<HubConnection>()

  interface Notificacao {
    id: Number;
    nome: string;
    motivo: string;
    situacao: string;
    data: Date;
  }

    useEffect(() => {        
        get();
        createConnection();
    }, [])

    useEffect(() => {        
        if(hubConnection){
            hubConnection.on("ReceiveMessage", (response) => {
                setArray(response)
                console.log('R',response)
            })
        }
    }, [hubConnection])
  const api = axios.create({
    baseURL: 'https://localhost:7253/',
    headers: {      
      'Accept': 'application/json, text/plain',
      'Content-Type': 'application/json;charset=UTF-8'
    },
    
  });
  const get = () => {
    api.get('Home/')
    .then(response => {
        setArray(response.data)
        console.log(response)
    })
    .catch(error =>{
        console.log(error)
    })
  }
  const post = () => {
    let notificacao = {
      id: 0,
      nome: 'EMG001',
      motivo: 'Pendente BO',
      situacao: 'Novo',
      data: new Date(),
  }
      api.post(`Home/`,notificacao)
      .then(response => {
          console.log(response)
      })
      .catch(error =>{
          console.log(error)
      })
  }
  const createConnection = async () =>  {
    const connection = new HubConnectionBuilder()
    .withUrl("https://localhost:7253/notification")
    .withAutomaticReconnect()
    .build();
    try{
        await connection.start()
        console.log('conectado')
    }
    catch(e){
        console.log('erro: ',e)
    }
    setHubConnection(connection)
}
  return (
    <div className="App">
      <header className="App-header">
        <div>
        <button onClick={()=>get()}>Get</button>
        <button onClick={()=>post()}>Post</button>
        </div>   
        <div>
          <ul>
            {
              array!=undefined && array.map((item: Notificacao, index)=>{
                return(
                    <li key={index}>{item.nome} </li>
                    )})}
          </ul>
        </div>     
      </header>
    </div>
  );
}

export default App;
