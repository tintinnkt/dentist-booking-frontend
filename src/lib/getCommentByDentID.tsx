export default async function getCommentByDentID(dentID : string , token : string){
    const response = await fetch (`https://project-s-backend-cyan.vercel.app/api/v1/comments/dentist/?dentistId=${dentID}` , {
        method : "GET" ,
        headers : {
            authorization : `Bearer ${token}`
        }
    })
    if(!response.ok) {
        throw new Error("Failed to fetch comment")
    }
    return await response.json() ;

}