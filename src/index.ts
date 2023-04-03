import * as dotenv from 'dotenv'

dotenv.config()

function test(){
    const port = process.env.PORT
    const appName = process.env.APP_NAME
    console.log("Hello world yfdyf");  
    console.log(`${appName} on  ${port}`)
}

test()