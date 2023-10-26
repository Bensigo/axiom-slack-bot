
export function extractCokies(cookies: any, name: string){
    console.log({ cookies })
    if (cookies){
        const found = cookies.split(';').find((c: any) => c.trim().startsWith(`${name}=`));
        console.log({found})
        if (found){
            return found.split('=')[1].trim();
        }
    }
    return undefined; 
}