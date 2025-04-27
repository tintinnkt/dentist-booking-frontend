export default async function updateComment(commentID : string , token : string , comment : string){
    const response = await fetch (`https://project-s-backend-cyan.vercel.app/api/v1/comments/${commentID}` , {
        method : "PUT" ,
        headers : {
            authorization : `Bearer ${token}`,
            "Content-Type" : "application/json"
        } ,
        body : JSON.stringify({
            comment : comment
        })
    })
    if(!response.ok) {
        throw new Error("Failed to update comment")
    }
    return await response.json() ;

}