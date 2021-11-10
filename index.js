addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})


const corsHeaders = {
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': ['POST','GET'],
  'Access-Control-Allow-Origin': "*"
}

async function handleRequest(request) {
  const { pathname } = new URL(request.url);
  if (request.method === "OPTIONS") {
    return new Response("OK", { headers: corsHeaders})
  }

    if (request.method === "GET") {
      if(pathname == "/posts"){
        const content = await MY_KV.list()
        const obj = content['keys']
        const res = []
        for(const k in obj){
          const key = obj[k]["name"]
          const value = await MY_KV.get(key)
          res.push(value)
        }
        console.log(typeof(res))
        return new Response(JSON.stringify(res), 
        {
          headers: { "Content-Type": "application/json",
          ...corsHeaders
          },
        });
      }
      else if(pathname.includes('/post/')){
        const id = pathname.substring(pathname.indexOf('/post/')+6,pathname.length)
        const content = await MY_KV.get(id)
        
        return new Response(content, {
        headers: { "Content-Type": "application/text",
        ...corsHeaders }
      });
      
      }
      else if(pathname.includes('/assets/')){
        const id = pathname.split("/").filter(part => part !== "")[1]
       
        const content = await IMG_KV.get(id, {"type": "arrayBuffer"})
        return new Response(content, {
        headers: { 'Content-type':'image/png',
        ...corsHeaders }
      });
      }
    
    }
    if (request.method === "POST") {
      
      if(pathname == '/posts'){
        const req = await request.json();
        await MY_KV.put(`p${req['id']}`, JSON.stringify(req))
        return new Response(JSON.stringify(`Success`),{
          headers:  { "Content-Type": "application/text",
          ...corsHeaders }
        });
      }
      else if(pathname == '/image'){
          const content = await MY_KV.list();
          const id = content['keys'].length+1
          const arrB = await request.arrayBuffer();
          await IMG_KV.put(`i${id}`, arrB)
          return new Response(JSON.stringify(`https://my-worker.anantha1996sn.workers.dev/assets/i${id}`),{
          headers:  { "Content-Type": "application /text",
          ...corsHeaders }
        });
        
  
      }
      
  }

}
    
