import Client from "@axiomhq/axiom-node";


export function createAxiomClient(token: string, orgId: string){
    if (!token && !orgId){
        console.log("Error: unable to create axiom client")
        return;
    }
   try {
     const client = new Client({
        token,
        orgId
    });
    return client;
   }catch(err){
    console.log('Error::', err)
   }
}