import React from 'react';
import './App.css';
import { PrimaryButton} from 'office-ui-fabric-react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';

const App: React.FC = () => {
  const [url, setUrl] = React.useState('');
  const[mainWidth, setMainWidth] = React.useState<number|null>(0);
  const[mainHeight, setMainHeight] = React.useState<number|null>(0);
  const[payload, setPayload] = React.useState<any[]>();

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
            const result = await response.json();
            setPayload(result);
            console.log(result)
       }
        else{
           console.log(url);
       }
    });
  
  };

  // Making the identification Rectangle
  const canvas = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(()=>{
    // Dynamically allocated the size (width and height) of the canvas to match the size of the image
    let canWidth = canvas.current ? canvas.current.width : null;
    canWidth = canvas.current? canvas.current.clientWidth : null;
    
    let canHeight = canvas.current ? canvas.current.height : null;
    canHeight = canvas.current? canvas.current.clientHeight : null;
    

    // Create the context  that will be used to draw on the canvas
    const ctx: CanvasRenderingContext2D | null = canvas.current ? canvas.current.getContext('2d') : null;

    // Create a new image object
    const imageObj = new Image();

    // Draw rectangles on and annotate all the faces identified
    function drawRect(payload: any): void { payload?.forEach((pay: any) => {
      ctx!.rect(pay['faceRectangle']['left'],pay['faceRectangle']['top'],pay['faceRectangle']['width'],pay['faceRectangle']['height']);
      ctx!.font = 'bold 15px Arial';
      ctx!.fillText(` ${pay['faceAttributes']['gender']} ${pay['faceAttributes']['age']}`, pay['faceRectangle']['left'], pay['faceRectangle']['top']);
    })
  };
    
    // Set the image to be drawn starting from the left most corner of the canvas
    imageObj.onload = () => {
      ctx!.drawImage(imageObj, 0, 0);
      drawRect(payload);
      console.log(`I am the payload${payload}`);
      ctx!.stroke();
    };
    // Set the image source to be the url entered in the textfield
    imageObj.src = url;
    console.log(imageObj.width);
    
    //Dynamically set the size of the canvas to the size of the image
    setMainWidth(imageObj.width);
    setMainHeight(imageObj.height);
  }, [url, mainHeight, mainWidth, payload])

  // Update the url hook whenever the value in the textfield changes
  const updateUrl = (_: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string | undefined): void => {
  if (newValue !== undefined) {
    setUrl(newValue);
  }
     };

    return (
      <div className='App'>
       <title>Image-ine</title>
      <div className='App-content'>
          <h1>Welcome to Image-ine!</h1>
           <p>The world's leading image analysis software developed by a guy named Jachi</p>
        </div>
        <div className='App-content'>
        <form>
        <TextField label="Please enter an image url" styles={{root:{marginTop: '10px'}}} onChange={updateUrl}/>
        </form>
        <PrimaryButton text="Identify" styles={{root:{float: 'right', marginTop: '10px'}}} onClick={ImageAPI}/>

        <div className='ImageContent'>
          <h2>Original Photo</h2>
        <span><img alt='A person or group of people' src={url}/></span>
        <h2>Analyzed Photo</h2>
          <canvas
            ref={canvas}
            width={mainWidth?.toString()}
            height={mainHeight?.toString()}
          />
          
        </div>

       </div>
      </div>
    );
}

export default App;
