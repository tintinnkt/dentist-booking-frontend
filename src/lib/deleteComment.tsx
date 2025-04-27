export default async function deleteComment(commentID : string , token : string ){
    const response = await fetch (`https://project-s-backend-cyan.vercel.app/api/v1/comments/${commentID}` , {
        method : "DELETE" ,
        headers : {
            authorization : `Bearer ${token}`,
            "Content-Type" : "application/json"
        } ,
        
    })
    if(!response.ok) {
        throw new Error("Failed to delete comment")
    }
    return await response.json() ;

}