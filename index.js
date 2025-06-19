const express = require('express')
const Axios = require('axios')

const app = express()

function f2(req, avail_keyword)
{
    let query_keywords = req.query.keywords
    if(typeof(query_keywords) != "string")
    {
        return "Enter a URL with a query labelled as keywords"
    }

    query_keywords = query_keywords.split(',')
    //query_keywords = ['bonfire','bool']

    let prefix = new Array()
    let valid_keyword = [];

    query_keywords.map((val)=>{
        if(avail_keyword.includes(val))
        {
            valid_keyword.push(val)
        }
        else{
            valid_keyword.push('n/a')
        }
    })

    for(let i=0;i<valid_keyword.length;i++){
        let currentWord = valid_keyword[i];
        if(currentWord === 'n/a'){
            prefix.push('not_applicable')
            continue;
        }
        let shortUniquePrefixFound= false;

        for(let j=1;j<currentWord.length;j++){
            let currentPrefix = currentWord.substring(0,j);
            let isUnique = true;

            for(let k=0;k<valid_keyword.length;k++){
                if(i===k){
                    continue;
                }
                const otherWord = valid_keyword[k];
                if(otherWord.startsWith(currentPrefix)){
                    isUnique = false;
                    break;
                }
            }
            if(isUnique){
                prefix.push(currentPrefix)
                shortUniquePrefixFound  = true;
                break;
            }
        }
        if(!shortUniquePrefixFound){
            prefix.push(currentWord)
        }
    }

    // console.log(avail_keyword)
    // console.log(query_keywords)
    //console.log(prefix)

    let response = new Array()

    for(let i=0;i<valid_keyword.length;i++){
        let status = avail_keyword.includes(query_keywords[i]) ? 'found' : 'not found'
        response.push({
            "keyword": query_keywords[i],
            "status":status,
            "prefix":prefix[i]
        })
    }

    return response
}

app.get('/prefixes', (req, res) => {
    let avail_keyword = new Array()

    async function f1() 
    {
        Axios.get('https://mocki.io/v1/ed6a8ece-6536-4898-8a4c-7121f2d7e052')
        .then(async (val)=>{
        avail_keyword = await val.data.keywords
         response = f2(req,avail_keyword)
         res.send(response)
        })
        .catch((err)=>{
            console.log(err)
            res.send("Bye")
        })
    }
    f1();
})

app.listen(5500, () => {
    console.log("Server started at 5500")
})