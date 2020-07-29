import React from 'react';
import './App.css';
import { PrimaryButton} from 'office-ui-fabric-react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';

const App: React.FC = () => {
  const [url, setUrl] = React.useState('');
  const apiKey = 'YOUR_API_KEY';
  const endpoint = 'YOUR_API_ENDPOINT';
  const params = `returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender`;
  
  const ImageAPI= (): Promise<void> | void => {
    fetch (`${endpoint}?${params}`, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey,
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({url: url}),
   }
    ).then(async (response: Response) =>{
        if(response.ok){
            const result:any = await response.json();
            console.log(result)
       }
        else{
           console.log(url);
       }
    });
  
  };

  const updateUrl = (_: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string | undefined): void => {
  if (newValue !== undefined) {
    setUrl(newValue);
  }
     };

    // Add an onChange function to monitor the text field and work on making the onClick function call the API
    return (
      <div className='App'>
       <title>Image-ine</title>
      <div>
          <h1>Welcome to Image-ine!</h1>
           <p>The world's leading image analysis software developed by a guy name Jachi</p>
        </div>
        <div className='App-content'>
        <form>
        <TextField label="Please enter an image url" styles={{root:{marginTop: '10px'}}} onChange={updateUrl}/>
        </form>
      
        <PrimaryButton text="Identify" styles={{root:{float: 'right', marginTop: '10px'}}} onClick={ImageAPI}/>
       </div>
      
      </div>
    );
}

export default App;
