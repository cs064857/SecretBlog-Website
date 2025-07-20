export function getCookieValue(key:string):string | null{

    const cookieArray=document.cookie.split(";")
    let cookieValue:string|null=null;
    cookieArray.forEach(cookieString=>{
        
        

        const cookie =cookieString.trim();
        if(cookie.startsWith("jwtToken"+'=')){
            cookieValue=cookie.substring(key.length+1)

        }
    })

    return cookieValue;
}