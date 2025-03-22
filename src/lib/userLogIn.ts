import { BackendRoutes } from "@/conifg/apiRoutes"

export default async function userLogIn (userEmail:string,userPassword:string){
  const response = await fetch(BackendRoutes.LOGIN,
      {method:"POST",
          headers:{
              "Content-Type":"application/json",

          },
          body:JSON.stringify({
              email:userEmail,
              password:userPassword,
          }),
      })

  if(!response.ok){
      throw new Error("Failed to log in")
  }
  return await response.json()
}